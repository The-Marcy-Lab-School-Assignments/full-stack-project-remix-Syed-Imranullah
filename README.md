# MatchDay — Soccer Pick'em Prediction League

A full-stack Soccer Prediction League built with React, Express, and PostgreSQL. Users can create accounts, join private leagues, and predict soccer match outcomes each week. The app demonstrates session-based authentication, protected API routes, CRUD operations, and external API integration using real-world soccer data.

---

# User Stories

## Authentication

- A user can register with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user with an active session stays logged in after refreshing the page

---

## Leagues & Predictions

A logged-in user can:

- Create a new league
- Join a league using an invite code
- View upcoming soccer fixtures
- Submit match predictions before kickoff
- View past predictions and results
- See a leaderboard of all league members

---

# Match Rules

- Users predict match outcomes (Win / Draw / Loss or score prediction)
- Predictions lock before kickoff time
- Points are awarded after match results are confirmed
- Leaderboard updates based on total points

---

# Important Design Notes

## Authentication Strategy

- This project uses **session-based authentication (express-session + bcrypt)**

---

## Prediction Constraints

To ensure data consistency:

- A user can only submit **one prediction per fixture per league**
- Enforced with a database constraint:

```sql
UNIQUE(user_id, fixture_id, league_id)
```

---

## Fixtures Integration (External API)

- Fixtures are pulled from API-Football
- To avoid duplicate data, each fixture must store the external API ID:

```sql
api_fixture_id INTEGER UNIQUE
```

This ensures we do not re-insert the same match on every sync.

---

## Scoring System (To Define Early)

Scoring logic must be decided before implementing the backend job:

Example options:
- Correct outcome (Win/Draw/Loss): 1 point
- Exact score: 3 points bonus
- Streak bonus: optional

This will directly affect:
- prediction updates
- leaderboard calculations
- cron job logic

---

# Database Schema

## users

```sql
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
```

---

## leagues

```sql
leagues
─────────────────────────────
league_id     SERIAL PRIMARY KEY
name          TEXT NOT NULL
invite_code   TEXT UNIQUE NOT NULL
created_by    INTEGER REFERENCES users(user_id)
```

---

## league_members

```sql
league_members
─────────────────────────────
id            SERIAL PRIMARY KEY
user_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE
league_id     INTEGER REFERENCES leagues(league_id) ON DELETE CASCADE
```

---

## fixtures

```sql
fixtures
─────────────────────────────
fixture_id       SERIAL PRIMARY KEY
api_fixture_id   INTEGER UNIQUE
home_team        TEXT NOT NULL
away_team        TEXT NOT NULL
match_date       TIMESTAMP
status           TEXT
home_score       INTEGER
away_score       INTEGER
```

---

## predictions

```sql
predictions
─────────────────────────────
prediction_id  SERIAL PRIMARY KEY
user_id        INTEGER REFERENCES users(user_id)
fixture_id     INTEGER REFERENCES fixtures(fixture_id)
league_id      INTEGER REFERENCES leagues(league_id)
prediction     TEXT
points         INTEGER DEFAULT 0
created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

# API Contract

## Auth Endpoints

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| POST | /api/auth/register | `{ username, password }` | `{ user_id, username }` |
| POST | /api/auth/login | `{ username, password }` | `{ user_id, username }` |
| DELETE | /api/auth/logout | — | `{ message }` |
| GET | /api/auth/me | — | `{ user_id, username }` or `null` |

---

## League Endpoints

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| POST | /api/leagues | `{ name }` | `{ league }` |
| POST | /api/leagues/join | `{ invite_code }` | `{ league }` |
| GET | /api/leagues | — | `[{ leagues }]` |

---

## Fixtures Endpoints

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| GET | /api/fixtures | — | `[{ fixture }]` |

---

## Predictions Endpoints

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| POST | /api/predictions | `{ fixture_id, prediction }` | `{ prediction }` |
| GET | /api/predictions | — | `[{ prediction }]` |
| PATCH | /api/predictions/:id | `{ prediction }` | `{ updated prediction }` |

---

## Leaderboard

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| GET | /api/leaderboard/:league_id | — | `[{ user, points }]` |

---

# Features

- Session-based authentication (express-session + bcrypt)
- Protected API routes
- League system with invite codes
- Match prediction system
- Deadline-based prediction locking
- Points-based leaderboard system
- External soccer API integration (API-Football)
- Responsive dashboard UI

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS

## Backend
- Express.js
- Node.js

## Database
- PostgreSQL

## Authentication
- Express Session
- Bcrypt

## External API
- API-Football (fixtures + results)

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd matchday
```

---

## 2. Database Setup

```bash
createdb matchday
```

---

## 3. Server Setup

```bash
cd server
npm install
cp .env.template .env
```

Add:

```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_secret_key
API_FOOTBALL_KEY=your_api_key
```

Seed database:

```bash
npm run db:seed
```

Start server:

```bash
npm run dev
```

---

## 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Application Structure

```txt
matchday/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js
│   │   │   ├── league-adapters.js
│   │   │   ├── fixture-adapters.js
│   │   │   └── prediction-adapters.js
│   │   └── components/
│   │       ├── AuthPage.jsx
│   │       ├── Dashboard.jsx
│   │       ├── FixturesPage.jsx
│   │       ├── LeaguePage.jsx
│   │       ├── PredictionForm.jsx
│   │       └── Leaderboard.jsx
│   └── vite.config.js
│
└── server/
    ├── index.js
    ├── controllers/
    │   ├── authControllers.js
    │   ├── leagueControllers.js
    │   ├── fixtureControllers.js
    │   └── predictionControllers.js
    ├── models/
    │   ├── userModel.js
    │   ├── leagueModel.js
    │   ├── fixtureModel.js
    │   └── predictionModel.js
    ├── middleware/
    │   ├── checkAuthentication.js
    │   └── logRoutes.js
    └── db/
        ├── pool.js
        └── seed.js
```