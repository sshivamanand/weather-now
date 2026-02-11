import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    const res = await db.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully!");
    console.log("Current time from DB:", res.rows[0].now);
  } catch (err) {
    console.error("PostgreSQL connection failed:");
    console.error(err.message);
  } finally {
    db.end();
  }
}

testConnection();
