import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import pg from "pg";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5050);

const { Pool } = pg;
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || "").split(",").map((x) => x.trim()),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

async function ensureUsersTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      google_id TEXT UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

function userResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    googleId: user.google_id || null,
  };
}

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const cleanEmail = String(email).trim().toLowerCase();
      const result = await db.query("SELECT * FROM users WHERE email = $1", [cleanEmail]);

      if (result.rows.length === 0) {
        return done(null, false, { message: "Invalid email or password" });
      }

      const user = result.rows[0];
      if (!user.password) {
        return done(null, false, { message: "Use Google login for this account" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Invalid email or password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0] || false);
  } catch (err) {
    done(err);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      },
      async (_a, _r, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const name = profile.displayName || "Google User";

          if (!email) return done(new Error("Google email missing"));

          const existing = await db.query(
            "SELECT * FROM users WHERE google_id = $1 OR email = $2 LIMIT 1",
            [googleId, email]
          );

          if (existing.rows.length > 0) {
            const user = existing.rows[0];
            if (!user.google_id) {
              const updated = await db.query(
                "UPDATE users SET google_id = $1 WHERE id = $2 RETURNING *",
                [googleId, user.id]
              );
              return done(null, updated.rows[0]);
            }
            return done(null, user);
          }

          const dummyPassword = await bcrypt.hash(`google-${Date.now()}`, 10);
          const created = await db.query(
            "INSERT INTO users (name, email, password, google_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, dummyPassword, googleId]
          );
          return done(null, created.rows[0]);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Not authenticated" });
}

app.get("/api/auth/me", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  return res.json({ user: userResponse(req.user) });
});

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const created = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [String(name).trim(), cleanEmail, hashed]
    );

    req.logIn(created.rows[0], (err) => {
      if (err) return res.status(500).json({ message: "Signup done but login failed" });
      return res.status(201).json({ message: "Signup successful", user: userResponse(created.rows[0]) });
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Login failed" });

    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.json({ message: "Login successful", user: userResponse(user) });
    });
  })(req, res, next);
});

app.post("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out" });
    });
  });
});

app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (_req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/weather`);
  }
);

app.get("/weather", requireAuth, (req, res) => {
  return res.json({ user: userResponse(req.user) });
});

app.use((err, _req, res, _next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS blocked" });
  }
  return res.status(500).json({ message: "Internal server error" });
});

(async () => {
  try {
    await ensureUsersTable();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed", err);
    process.exit(1);
  }
})();
