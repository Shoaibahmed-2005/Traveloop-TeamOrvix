# Traveloop — Personalized Travel Planning Made Easy

> **"Dream it. Plan it. Live it."**

Traveloop is a full-stack travel planning application built for the Odoo Hackathon.
Plan multi-city trips, manage budgets, build itineraries, and share with the community.

## Tech Stack

- **Frontend**: React.js (Vite), React Router v6, Axios, Recharts, React Beautiful DnD
- **Backend**: Node.js, Express.js, PostgreSQL, JWT, bcrypt
- **Database**: PostgreSQL with 13 relational tables

## Prerequisites

- Node.js v18+
- PostgreSQL v14+
- `traveloop` database already created in PostgreSQL

## Setup

### 1. Clone the repo
```bash
git clone <repo-url>
cd traveloop_TeamOrvix
```

### 2. Configure backend
```bash
cd backend
npm install
```
Edit `backend/.env` and set your PostgreSQL password:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/traveloop
```

### 3. Start backend
```bash
cd backend
npm run dev
# Backend auto-runs migrations and seeds on first start ✅
# You'll see:
# ✅ Database connected
# ✅ Migrations complete
# ✅ Seed data loaded
# 🚀 Backend running on http://localhost:5000
```

### 4. Start frontend (new terminal)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# Open http://localhost:5173
```

## Default Accounts

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@traveloop.com    | Admin@123 |
| User  | john@example.com       | Test@123  |
| User  | sarah@example.com      | Test@123  |

## Features

- ✅ JWT Authentication with auto-session restore on page refresh
- ✅ Multi-city trip creation with drag-and-drop itinerary builder
- ✅ Real-time budget tracking with Recharts pie + bar charts
- ✅ City and activity search with filters, sorting, and caching
- ✅ Packing checklist with categories, progress bar, reset, print
- ✅ Trip notes and journal per stop
- ✅ Community tab for public trip sharing with likes & views
- ✅ Public itinerary sharing via unique URL (no login required)
- ✅ Admin dashboard with analytics and user management
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Skeleton loaders and empty states throughout
- ✅ Toast notifications for all user actions
- ✅ Rate limiting and CORS security

## Database Schema

13 relational tables:
- `users`, `cities`, `activities`
- `trips`, `trip_stops`, `itinerary_sections`, `trip_activities`
- `expenses`, `packing_items`, `trip_notes`
- `community_posts`, `saved_destinations`

With proper foreign keys, indexes, and constraints.

## API Base URL

`http://localhost:5000/api/v1/`

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login |
| GET | /trips | Get all trips |
| POST | /trips | Create trip |
| GET | /cities/popular | Top 10 cities (cached) |
| GET | /activities | Activities with filters |
| GET | /community | Public community posts |
| GET | /public/itinerary/:token | Public share view |
| GET | /admin/stats | Admin analytics |

## Team — TeamOrvix
