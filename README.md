# Job Application Tracker

A full-stack Job Application Tracker built with React, Express, and PostgreSQL. Users can create an account, log in, and manage their job applications in one place. The app demonstrates session-based authentication, protected API routes, CRUD operations, and full-stack state management.

---

# User Stories

## Authentication

- A user can register with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user with an active session stays logged in after refreshing the page

---

## Job Applications

A logged-in user can:

- View all of their job applications
- Add a new job application
- Edit an existing application
- Delete an application
- Update the application status
- Add notes about interviews or follow-ups

---

# Application Statuses

- Applied
- Interview
- Final Round
- Offer
- Rejected

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

## applications

```sql
applications
─────────────────────────────
application_id SERIAL PRIMARY KEY
company_name   TEXT NOT NULL
position_title TEXT NOT NULL
status         TEXT DEFAULT 'Applied'
notes          TEXT
date_applied   DATE
user_id        INTEGER REFERENCES users(user_id) ON DELETE CASCADE
```

A user has many job applications. Deleting a user deletes all of their applications.

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

## Application Endpoints

(All routes require authentication)

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| GET | /api/applications | — | `[{ application }]` |
| POST | /api/applications | `{ company_name, position_title, status, notes }` | `{ application }` |
| PATCH | /api/applications/:application_id | `{ status, notes }` | `{ updated application }` |
| DELETE | /api/applications/:application_id | — | `{ deleted application }` |

---

# Features

- Session-based authentication
- Protected API routes
- Persistent login sessions
- CRUD operations
- Status tracking
- Responsive UI
- Dashboard organization

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

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd job-application-tracker
```

---

## 2. Database Setup

Create a PostgreSQL database:

```bash
createdb job_tracker
```

---

## 3. Server Setup

```bash
cd server
npm install
cp .env.template .env
```

Open `.env` and add:

```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_secret_key
```

Seed the database:

```bash
npm run db:seed
```

Start the server:

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:8080
```

---

## 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Application Structure

```txt
job-application-tracker/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js
│   │   │   └── application-adapters.js
│   │   └── components/
│   │       ├── AuthPage.jsx
│   │       ├── Dashboard.jsx
│   │       ├── AddApplicationForm.jsx
│   │       ├── ApplicationList.jsx
│   │       └── ApplicationCard.jsx
│   └── vite.config.js
│
└── server/
    ├── index.js
    ├── controllers/
    │   ├── authControllers.js
    │   └── applicationControllers.js
    ├── models/
    │   ├── userModel.js
    │   └── applicationModel.js
    ├── middleware/
    │   ├── checkAuthentication.js
    │   └── logRoutes.js
    └── db/
        ├── pool.js
        └── seed.js
```

---

