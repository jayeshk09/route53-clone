# Route53 Clone

A DNS management console built to look and feel like AWS Route53. You can create hosted zones, manage DNS records, search, filter, and paginate through your data — all backed by FastAPI and SQLite.

![Route53 Dashboard Screenshot](screenshot.png)

---

## Getting Started

You'll need Node.js 18+ and Python 3.9+.

### Backend

```bash
cd backend

# set up a virtual environment
python3 -m venv venv
source venv/bin/activate

# install dependencies
pip install -r requirements.txt

# copy and edit the env file — change SECRET_KEY at minimum
cp .env.example .env

# seed the database with demo data (25 hosted zones)
python -m app.seed

# start the server
python run.py
```

The API runs at `http://localhost:8000`. Swagger docs are at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend

# copy the env file
cp .env.example .env.local

npm install
npm run dev
```

The app runs at `http://localhost:3000`.

### Demo Login

```
Email:    demo@example.com
Password: password123
```

---

## What You Can Do

### Hosted Zones
- View all zones in a sortable, searchable table with pagination
- Create new zones (public or private)
- Edit zone details — you can rename the domain and update the description
- Delete zones (with a confirmation dialog)
- Filter by type (Public / Private)

### DNS Records
- Create records across 9 types: A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA
- Each record type validates its value format (IPv4 for A records, domain format for CNAMEs, priority+server for MX, etc.)
- Edit values and TTLs inline via modals
- Delete records with confirmation

### Dashboard
- Quick overview of your hosted zone count
- Navigation cards to jump to different sections

---

## How It's Built

### Frontend — Next.js 14 + Tailwind
The layout mimics the actual AWS console with a dark sidebar, orange accent colors, and clean typography. Common components (tables, modals, forms, action menus) are shared across pages. The action menu dropdowns use React portals so they never clip inside scrollable containers. Toast notifications show up for every create, update, and delete action.

API calls go through a service layer (`services/`) that wraps fetch with cookie-based auth. The hooks (`hooks/`) handle state management for zones and records, including search, sort, and pagination.

### Backend — FastAPI + SQLite
A REST API with 14 endpoints covering auth, zone CRUD, and record CRUD. Passwords are hashed with bcrypt. Sessions use HTTP-only cookies with configurable expiry. Pydantic handles all input validation — domain name format, IPv4 addresses, TTL ranges, MX record structure. SQLAlchemy manages the SQLite database with cascade deletes and indexed columns.

### Database — SQLite
Stored in `backend/data/route53.db`. Four tables: `users`, `sessions`, `hosted_zones`, `dns_records`. The seed script creates a demo user and 25 zones so pagination works out of the box. Zone and record IDs are UUIDs.

---

## Project Layout

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/login/       # Login page
│   └── (dashboard)/        # All authenticated pages
├── components/
│   ├── common/             # Button, Input, Modal, Toast, Spinner...
│   ├── layout/             # AppShell, Header, Sidebar, Breadcrumbs
│   ├── forms/              # CreateZone, EditZone, CreateRecord, EditRecord
│   ├── tables/             # DataTable, HostedZonesTable, DNSRecordsTable
│   ├── sections/           # Tabs, EmptyState, ComingSoon, Collapsible
│   └── modals/             # DeleteConfirm
├── hooks/                  # useAuth, useHostedZones, useDNSRecords, useToast
├── services/               # authService, hostedZoneService, recordService
├── lib/                    # API client (fetch wrapper)
├── constants/              # Validation regexes and limits
└── types/                  # TypeScript interfaces

backend/
├── app/
│   ├── main.py
│   ├── config.py           # Reads from .env
│   ├── database.py         # SQLAlchemy setup
│   ├── seed.py             # Creates demo user + 25 zones
│   ├── auth/               # Login, logout, session endpoints
│   ├── hosted_zones/       # Zone CRUD
│   ├── dns_records/        # Record CRUD
│   └── middleware/          # Auth guard, error handler
├── data/                   # SQLite database lives here
└── requirements.txt
```

---

## Environment Variables

### Frontend
| Variable | Default |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` |

### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite connection string |
| `SECRET_KEY` | Used for session encryption |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `SESSION_TIMEOUT` | Session expiry in seconds (default 86400) |

---

## Deploying

### Frontend on Vercel
- Push the repo to GitHub
- Import the project in Vercel
- Set the root directory to `frontend`
- Add `NEXT_PUBLIC_API_URL` pointing to your deployed backend

### Backend on Render / Railway
- Set the root directory to `backend`
- Add all four environment variables from `.env.example`
- Start command: `pip install -r requirements.txt && python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Both services have free tiers that work fine for this project.

---

## API Reference

All endpoints return `{ "success": true, "data": {...} }`. Errors return `{ "success": false, "error": { "code": "...", "message": "..." } }`.

| Method | Path | Auth |
|--------|------|------|
| POST | /api/auth/login | No |
| POST | /api/auth/logout | Yes |
| GET | /api/auth/session | Yes |
| GET | /api/hosted-zones | Yes |
| POST | /api/hosted-zones | Yes |
| GET | /api/hosted-zones/{id} | Yes |
| PUT | /api/hosted-zones/{id} | Yes |
| DELETE | /api/hosted-zones/{id} | Yes |
| GET | /api/hosted-zones/{id}/records | Yes |
| POST | /api/hosted-zones/{id}/records | Yes |
| PUT | /api/hosted-zones/{id}/records/{id} | Yes |
| DELETE | /api/hosted-zones/{id}/records/{id} | Yes |

Hosted zones support `search`, `sort_by`, `sort_order`, `page`, and `limit` query params.