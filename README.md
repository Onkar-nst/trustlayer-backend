# TrustLayer — Premium Identity & Transactions Platform

> A full-stack trust and reputation system built with React + TypeScript (frontend) and Express + Prisma + SQLite (backend).

---

## 🏗️ Project Architecture

```
trustlayer-backend/        ← Monorepo Root
├── frontend/              ← Vite + React + TypeScript (deployed to Vercel)
├── backend/               ← Express + Prisma + TypeScript (deployed to Render)
├── README.md
├── sequenceDiagram.md
├── useCaseDiagram.md
├── classDiagram.md
└── ErDiagram.md
```

**Stack:**

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, TailwindCSS   |
| Backend    | Node.js, Express, TypeScript, Prisma ORM  |
| Database   | SQLite (dev) → PostgreSQL (production)    |
| Auth       | JWT (access token + refresh token)        |
| Validation | Zod schemas                               |
| Patterns   | Observer (EventBus), Strategy (TrustScore)|

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
# → Backend running on http://localhost:5001
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# → Frontend running on http://localhost:5173
```

### Environment Variables

**backend/.env**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_super_secret_key"
PORT=5001
NODE_ENV=development
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5001/api
```

---

## ☁️ Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com).
2. Connect your GitHub repo.
3. Set the **Root Directory** to `backend`.
4. Configure the following:
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `node dist/index.js`
5. Add **Environment Variables** in the Render dashboard:
   ```
   DATABASE_URL=postgresql://...   ← your PostgreSQL connection string
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. Optionally add a **PostgreSQL** database from Render's dashboard and copy the connection string.

### Frontend → Vercel

1. Import your GitHub repo at [vercel.com](https://vercel.com).
2. Set **Framework Preset** to `Vite`.
3. Set **Root Directory** to `frontend`.
4. Add **Environment Variables** in the Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Click **Deploy**.

> **Note:** After deploying the backend, copy the Render URL and update `VITE_API_URL` in Vercel before redeploying.

---

## 📡 API Reference

### Auth
| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| POST   | /api/auth/register | Register new user   |
| POST   | /api/auth/login    | Login, get tokens   |
| POST   | /api/auth/refresh  | Refresh access token|
| POST   | /api/auth/logout   | Clear cookies       |

### Transactions
| Method | Endpoint                       | Description              |
|--------|--------------------------------|--------------------------|
| GET    | /api/transactions              | Get user's transactions  |
| POST   | /api/transactions              | Create new transaction   |
| PATCH  | /api/transactions/:id/complete | Mark as completed        |

### Trust Score
| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | /api/trust/:id   | Get user trust score |

### Identity
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | /api/identity                     | Submit ID document       |
| POST   | /api/admin/identity/:id/approve   | Admin: approve identity  |
| POST   | /api/admin/identity/:id/reject    | Admin: reject identity   |

### Reviews
| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| GET    | /api/reviews/me   | Get received reviews |
| GET    | /api/reviews/given| Get given reviews    |
| POST   | /api/reviews      | Submit a review      |

### Disputes
| Method | Endpoint           | Description        |
|--------|--------------------|---------------------|
| GET    | /api/disputes/me   | Get user disputes  |
| POST   | /api/disputes      | Raise a dispute    |

### Audit Log
| Method | Endpoint      | Description           |
|--------|---------------|-----------------------|
| GET    | /api/audit/me | Get user's audit logs |

---

## 🔐 Authentication Flow

All protected routes require a valid `Authorization: Bearer <token>` header.
Tokens are short-lived (15m). Use `/api/auth/refresh` to obtain a new one.

---

## 🛡️ Design Patterns

- **Observer Pattern** — `EventBus` notifies services when domain events occur (e.g., `TRANSACTION_COMPLETED` triggers trust score recalculation).
- **Strategy Pattern** — Trust score calculation is pluggable via a `ScoreCalculator` interface.
- **Repository Pattern** — Data access is abstracted away from the service layer.
- **Layered Architecture** — `Controller → Service → Repository → Prisma`.

---

## 📊 Score Calculation

```
TrustScore = baseScore (50)
           + identityBonus   (up to +20 for verified ID)
           + transactionBonus (up to +30 for completed txns)
           + reviewBonus     (up to +20 from ratings)
           - penaltyPoints   (deducted for disputes)
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/src/index.ts` | Express app entrypoint |
| `backend/src/routes/index.ts` | All route registrations |
| `backend/prisma/schema.prisma` | Database schema |
| `frontend/src/App.tsx` | React router & app layout |
| `frontend/src/api/apiClient.ts` | Axios instance with token refresh |
| `frontend/src/context/AuthContext.tsx` | Global auth state |
