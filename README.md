# WeatherNow

Full-stack weather app with session auth.

## Stack
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express + Passport.js
- Auth: Passport Local + Google OAuth 2.0 + bcrypt
- Database: PostgreSQL
- Weather API: OpenWeather

## Run locally

1. Configure env files:
- `/Users/shivamanand/Work/AI-ML/weather-now/weather-now/server/.env`
- `/Users/shivamanand/Work/AI-ML/weather-now/weather-now/client/.env`

2. Install and start backend:
```bash
cd server
npm install
npm run start
```
Backend runs on `http://localhost:5050`.

3. Install and start frontend:
```bash
cd client
npm install
npm run dev
```
Frontend runs on Vite default origin (typically `http://localhost:5173`).

## Auth routes
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`

## Google OAuth setup
In Google Cloud Console, add:
- Authorized JavaScript origin: `http://localhost:5173`
- Authorized redirect URI: `http://localhost:5050/api/auth/google/callback`

If your frontend runs on a different Vite origin, add that origin too.

## Notes
- The backend auto-creates a `users` table if missing.
- Sessions are cookie-based (`credentials: include` required in frontend requests).
