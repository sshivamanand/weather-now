# WeatherNow — Secure Full-Stack Weather Platform

## 📋 Overview

WeatherNow is a production-ready full-stack web application that provides **real-time weather information** with **secure user authentication**. Users can create accounts, log in using email/password or Google OAuth, and access a personalized weather dashboard featuring current conditions and 5-day forecasts.

This project demonstrates modern web development best practices including:
- Secure authentication with multiple providers
- Session management and database integration
- RESTful API design
- Third-party API integration
- Full-stack deployment

---

## Features

### Authentication & Security
- **Secure user authentication** system with industry-standard practices
- **Email/password authentication** using bcrypt hashing
- **Google OAuth 2.0** authentication for seamless login
- **Session-based authentication** using Passport.js
- **Secure cookie sessions** with HTTP-only flags
- **Protected routes** accessible only to authenticated users

### Weather Features
- **Real-time weather data** from OpenWeather API
- **City search** with autocomplete suggestions
- **5-day weather forecast** with detailed predictions
- **Current conditions** including temperature, humidity, wind speed
- **Global coverage** for cities worldwide

### Deployment
- **Fully deployed** frontend and backend
- **Production-ready** infrastructure
- **Scalable architecture**

---

## Tech Stack

### Frontend
- **React** 18+ — Modern UI framework
- **TailwindCSS** — Utility-first styling
- **Vite** — Lightning-fast build tool
- **Axios** — HTTP client for API calls

### Backend
- **Node.js** 16+ — Runtime environment
- **Express.js** 4.x — Web application framework
- **Passport.js** — Authentication middleware
- **express-session** — Session management
- **bcrypt** — Password hashing

### Database
- **PostgreSQL** 13+ — Relational database
- **pg** — PostgreSQL client for Node.js

### Authentication
- **bcrypt** — Password hashing (10 rounds)
- **Google OAuth 2.0** — Third-party authentication
- **Passport Local Strategy** — Email/password auth
- **Passport Google Strategy** — Google OAuth

### APIs
- **OpenWeather API** — Real-time weather data
- **Google OAuth API** — Authentication

### Deployment
- **Frontend:** Vercel (CDN + serverless)
- **Backend:** Render (Node.js hosting)
- **Database:** Render PostgreSQL

---

## 📁 Project Structure

```
weather-now/
│
├── client/                       # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   └── GoogleAuth.jsx
│   │   │   ├── Weather/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── CurrentWeather.jsx
│   │   │   │   └── Forecast.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/                       # Backend Express application
│   ├── index.js                  # Main server file
│   ├── auth.js                   # Authentication logic
│   ├── db.js                     # Database connection
│   ├── passport.js               # Passport configuration
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   └── weather.js            # Weather routes
│   ├── middleware/
│   │   ├── authMiddleware.js     # Protected route middleware
│   │   └── validation.js         # Input validation
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Installation

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 13+
- OpenWeather API key ([Get one free](https://openweathermap.org/api))
- Google OAuth credentials ([Google Console](https://console.cloud.google.com/))

---

### 1. Clone Repository

```bash
git clone https://github.com/sshivamanand/weather-now.git
cd weather-now
```

---

### 2. Database Setup

**Create PostgreSQL database:**

```bash
createdb weathernow
```

**Run migrations:**

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
```

---

### 3. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://username:password@localhost:5432/weathernow
SESSION_SECRET=your_random_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
EOF

# Start server
npm start
```

**Backend runs at:** `http://localhost:5000`

---

### 4. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_BACKEND_URL=http://localhost:5000
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
EOF

# Start development server
npm run dev
```

**Frontend runs at:** `http://localhost:5173`

---

## 🌍 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/weathernow` |
| `SESSION_SECRET` | Secret key for session encryption | `your_random_secret_key` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `YOUR_SECRET` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` / `production` |

---

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_OPENWEATHER_API_KEY` | OpenWeather API key | `your_api_key_here` |

---

## 📄 License

This project is licensed under the MIT License.

---
