# Inventory Reservation System

A full-stack multi-warehouse inventory reservation platform built with Next.js App Router, Prisma, and PostgreSQL.

The system prevents overselling during checkout by implementing temporary inventory reservations with expiry handling, confirmation flow, cancellation flow, and concurrency-safe stock updates.

---

# Features

- Multi-warehouse inventory management
- Real-time stock visibility
- Temporary stock reservations
- Reservation confirmation flow
- Reservation cancellation flow
- Automatic expiry cleanup
- Concurrency-safe inventory updates
- Countdown timer for reservation expiry
- Live inventory refresh
- Idempotency support (bonus)
- Modern responsive SaaS-style UI

---

# Tech Stack

## Frontend
- Next.js 16 (App Router)
- React
- Tailwind CSS

## Backend
- Next.js API Routes
- Prisma ORM

## Database
- Neon PostgreSQL (Hosted)

## Optional Infrastructure
- Upstash Redis (Optional for distributed locking / advanced idempotency)

---

# Project Architecture

## Core Models

### Product
Represents sellable products.

### Warehouse
Represents fulfillment warehouses.

### Inventory
Maintains:
- total stock
- reserved stock
- available stock

### Reservation
Tracks:
- pending reservations
- confirmed reservations
- released reservations
- expiry timestamps

---

# Reservation Flow

1. User clicks "Reserve Inventory"
2. System checks available stock
3. Reservation is created for limited duration
4. Reserved stock is temporarily blocked
5. User can:
   - confirm purchase
   - cancel reservation
6. Expired reservations are automatically released

---

# Concurrency Handling

The reservation endpoint uses Prisma transactions to ensure correctness under concurrent requests.

Available stock is calculated as:

```txt
availableStock = totalStock - reservedStock
```

If multiple users attempt to reserve the last available unit simultaneously:
- only one succeeds
- others receive HTTP 409 Conflict

This prevents overselling.

---

# API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | List products with warehouse stock |
| GET | /api/warehouses | List warehouses |
| POST | /api/reservations | Create reservation |
| POST | /api/reservations/:id/confirm | Confirm reservation |
| POST | /api/reservations/:id/release | Release reservation |
| POST | /api/cleanup-expired | Cleanup expired reservations |

---

# Clone Repository

```bash
git clone https://github.com/keepudihemanth/allohealth-takehome.git
```

Move into project:

```bash
cd inventory-reservation-system
```

---

# Installation

## Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="your_neon_database_url"
```

---

# Prisma Setup

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Database Migrations

```bash
npx prisma migrate dev --name init
```

---

# Run the Application

## Start development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# Deployment

## Recommended Stack

- Vercel → Next.js Hosting
- Neon → Hosted PostgreSQL
- Upstash Redis → Optional infrastructure

---

# Vercel Notes

The project uses:

```json
"postinstall": "prisma generate"
```

to ensure Prisma Client generation during Vercel builds.

---

# Expiry Cleanup Strategy

Expired reservations are automatically released using a cleanup API.

Production-ready approaches:
- Vercel Cron Jobs
- Background workers
- Scheduled serverless functions

Current implementation supports API-triggered cleanup.

---

# Idempotency (Bonus)

The reservation endpoint supports:

```txt
Idempotency-Key
```

Repeated requests with the same key return the original response instead of creating duplicate reservations.

---

# Challenges Faced

## 1. Concurrency Handling

One of the major challenges was ensuring that simultaneous reservation requests could not oversell inventory.

This was solved using:
- Prisma transactions
- atomic stock updates
- reservation-based stock locking

---

## 2. Reservation Expiry Management

Handling expired reservations while restoring stock correctly required designing a cleanup strategy that works reliably in both local and production environments.

---

## 3. Next.js 16 Dynamic Params

Next.js App Router introduced async dynamic route params, which required restructuring API routes and reservation pages accordingly.

---

## 4. Prisma + Vercel Deployment

Prisma client generation on Vercel required additional configuration to avoid cached dependency issues during deployment.

---

# Future Improvements

- Redis distributed locking
- WebSocket live updates
- Admin dashboard
- Authentication & authorization
- Payment gateway integration
- Queue-based expiry workers
- Advanced analytics

---

# Thank You

Thank you for reviewing this project and providing the opportunity to work on this assignment.

This project was a great opportunity to explore:
- distributed inventory challenges
- concurrency-safe backend design
- reservation lifecycle management
- real-world e-commerce workflows

I genuinely enjoyed building and refining the system.

Looking forward to your feedback.

~Hemanth
