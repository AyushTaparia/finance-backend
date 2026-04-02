# Finance Dashboard API

This is a production-grade backend for a finance dashboard system built with Node.js, Express, TypeScript, SQLite, and Prisma ORM.

## Features
- **User Management & RBAC**: Admin, Analyst, and Viewer roles with middleware protection.
- **Financial Records CRUD**: Admins can manage records, Analysts/Viewers can view them.
- **Dashboard Summary**: Aggregate income, expense, and category net changes.
- **Validation**: Strict input validation using Zod.
- **Security**: Password hashing with bcrypt, JWT authentication, helmet, cors.

## Setup Requirements

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   This project uses SQLite. The `dev.db` is configured in `.env`.
   ```bash
   npx prisma db push
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```
   (Alternatively, use `npx ts-node src/index.ts`)

## Role Permissions
- **Viewer**: Read-only access to Records and Recent Activity.
- **Analyst**: Same as Viewer, plus read access to Dashboard summaries (Income/Expense/Category Totals).
- **Admin**: Full access. Can create/update/delete records and manage user roles.

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` (email, password, optional role)
- `POST /api/auth/login` (email, password) -> returns JWT Token

### User Management (Admin Only)
- `GET /api/users` 
- `PUT /api/users/:id/role` 
- `PUT /api/users/:id/status`

### Financial Records
- `GET /api/records` (All Authorized Users)
- `POST /api/records` (Admin Only)
- `PUT /api/records/:id` (Admin Only)
- `DELETE /api/records/:id` (Admin Only)

### Dashboard Metrics
- `GET /api/dashboard/summary` (Admin, Analyst)
- `GET /api/dashboard/category-totals` (Admin, Analyst)
- `GET /api/dashboard/recent` (All Authorized Users)

*(Tokens must be passed as `Authorization: Bearer <token>`)*
