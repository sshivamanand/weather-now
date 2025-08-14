import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import pg from "pg";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } 
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // you can configure CSP manually later
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // React dev server
    credentials: true, // allow cookies
  })
);
app.use(express.json());

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // false for local
      httpOnly: true,
      sameSite: "none",
      maxAge: 2 * 60 * 1000, 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const res = await db.query("SELECT * FROM users WHERE email=$1", [
          email,
        ]);
        if (res.rows.length === 0)
          return done(null, false, { message: "Incorrect email" });

        const user = res.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE id=$1", [id]);
    done(null, res.rows[0]);
  } catch (err) {
    done(err);
  }
});

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check by Google ID first
        let res = await db.query("SELECT * FROM users WHERE google_id=$1", [
          profile.id,
        ]);

        if (res.rows.length > 0) {
          return done(null, res.rows[0]);
        }

        // If not found, check if email already exists (manual signup before)
        res = await db.query("SELECT * FROM users WHERE email=$1", [
          profile.emails[0].value,
        ]);

        let user;
        if (res.rows.length > 0) {
          // Link existing account to Google ID
          user = res.rows[0];
          await db.query("UPDATE users SET google_id=$1 WHERE id=$2", [
            profile.id,
            user.id,
          ]);
          user.google_id = profile.id;
        } else {
          // New user — create account
          const dummyPassword = await bcrypt.hash(
            Math.random().toString(36),
            10
          );
          const insertRes = await db.query(
            "INSERT INTO users (name, email, google_id, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [
              profile.displayName,
              profile.emails[0].value,
              profile.id,
              dummyPassword,
            ]
          );
          user = insertRes.rows[0];
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "Logged in successfully",
        user: { id: user.id, name: user.name, email: user.email },
      });
    });
  })(req, res, next);
});

// Logout
app.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

// Protected route example
app.get("/weather", (req, res) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Not authenticated" });
  res.json({ message: `Welcome, ${req.user.name}`, user: req.user });
});

// Start Google OAuth login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/weather`);
  }
);

app.listen(PORT, () => {console.log("Server now live on PORT =", PORT)});
