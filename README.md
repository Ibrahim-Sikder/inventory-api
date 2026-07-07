# Mini ERP – Inventory & Sales Management System (Backend)

Backend API for a full-stack Inventory & Sales Management System, built for the **MERN Stack Technical Assessment** (Full Stack MERN Developer position).

This repository contains the **backend only**. The API is built with Node.js, Express, TypeScript, and MongoDB, and implements JWT authentication, role-based authorization, product/inventory management with image upload, sales processing with automatic stock deduction, customer management, and a dashboard statistics endpoint.

---

## 🔗 Live Links

| Resource | URL |
|---|---|
| Live Backend API | `https://erpapi.softypy.com/>/api/v1` |
| Backend GitHub Repository | `https://github.com/Ibrahim-Sikder/inventory-api` |

## 🔑 Admin Login Credentials

| Field | Value |
|---|---|
| Email | `admin@gmail.com` |
| Password | `123456` |
| Role | `admin` |

> ⚠️ These are demo credentials provided solely for evaluation purposes.

---

## 🧱 Tech Stack

- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access Token + Refresh Token, HTTP-only cookies)
- **Validation:** Zod
- **Image Upload:** Multer + Sharp (processing) + Cloudinary (storage)
- **Security:** Helmet, CORS, express-rate-limit, bcrypt (password hashing)
- **Caching / Queues:** Redis (ioredis), BullMQ
- **Scheduling:** node-cron
- **Logging:** Morgan
- **Other:** slugify, date-fns, nodemailer

---

## ✨ Features

### Authentication & Authorization
- JWT-based login with short-lived access token and long-lived refresh token (HTTP-only cookies)
- Silent token refresh via `/auth/refresh-token`
- Protected routes via `auth()` middleware
- Role-Based Access Control (RBAC) with three roles:

| Role | Permissions |
|---|---|
| Admin | Full access to all modules |
| Manager | Manage products, manage customers, create sales |
| Employee | View products, view customers, create sales |

### Product Module
- Full CRUD operations
- Fields: Product Name, SKU, Category, Purchase Price, Selling Price, Stock Quantity, Product Image
- Mandatory image upload on product creation (validated server-side)
- Search by name/SKU/category
- Pagination support
- Low-stock flagging (stock < 5)

### Sales Module
- Create sales with multiple products and quantities in a single transaction
- Automatic stock deduction on sale confirmation
- Stock validation — prevents selling out-of-stock or insufficient-quantity items
- Automatic grand total calculation
- Full sale history stored per transaction

### Customer Module
- Full CRUD operations for customer records
- Used when creating a sale (attach a customer to a transaction)

### Dashboard
- Total Products
- Total Sales
- Low Stock Products (stock < 5)

### Engineering Practices
- Centralized global error handler
- Consistent API response structure (`success`, `message`, `data`, `meta`)
- Proper HTTP status codes throughout (via `http-status`)
- Modular, feature-based folder architecture
- Reusable utilities (`catchAsync`, `sendResponse`, `ApiError`)
- Input validation at the route level using Zod schemas

---

## 📁 Project Structure

```
src/
├── app/
│   ├── builder/
│   ├── config/
│   ├── error/
│   ├── interface/
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── validateRequest.ts
│   │   └── globalErrorHandler.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.utils.ts
│   │   │   └── auth.validation.ts
│   │   ├── customer/
│   │   ├── dashboard/
│   │   ├── product/
│   │   ├── sale/
│   │   └── user/
│   └── routes/
│       └── index.ts
├── templates/
├── utils/
│   ├── catchAsync.ts
│   ├── sendResponse.ts
│   └── sendImageToCloudinary.ts
├── app.ts
└── server.ts
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Redis (for BullMQ / caching / cron features)
- Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone <https://github.com/Ibrahim-Sikder/inventory-api> inventory-api
cd inventory-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the project root (copy `.env.example` if present) with the following keys:

```env
NODE_ENV=development
PORT=9007

DATABASE_URL=<ADD_YOUR_MONGODB_CONNECTION_STRING>
DB_NAME=ERP

BCRYPT_SALT_ROUNDS=12

JWT_ACCESS_SECRET=<ADD_YOUR_ACCESS_SECRET>
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_SECRET=<ADD_YOUR_REFRESH_SECRET>
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_NAME=<ADD_YOUR_CLOUDINARY_NAME>
CLOUDINARY_API_KEY=<ADD_YOUR_CLOUDINARY_KEY>
CLOUDINARY_SECRET=<ADD_YOUR_CLOUDINARY_SECRET>

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

CROSS_ORIGIN_CLIENT=<ADD_YOUR_FRONTEND_URL>
CROSS_ORIGIN_ADMIN=<ADD_YOUR_ADMIN_PANEL_URL_IF_ANY>
COOKIE_DOMAIN=<ADD_YOUR_DOMAIN>
```

> **Notes on the env file:**
> - `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` should use short-lived access + longer refresh (e.g. `1h` / `7d`), not `7d` / `60d` for both — a 7-day access token defeats the purpose of a short-lived token.
> - Double-check `DATABASE_URL` doesn't have a duplicated/mangled `appName` query param at the end (e.g. `appName=craftappName=craft`) — this will break the Mongo connection string.
> - Make sure each `KEY=value` pair stays on **one line**. A secret that gets wrapped onto two lines in the file will be parsed as two separate (and both invalid) variables.
> - Rotate your Mongo password, JWT secrets, and Cloudinary secret if they were ever shared/pasted anywhere outside your local machine.

### 4. Run in development

```bash
npm run dev
```

### 5. Build & run in production

```bash
npm run build
npm start
```

### 6. Lint & format

```bash
npm run lint
npm run lint:fix
npm run prettier:write
```

---

## 📡 API Overview

Base URL (local): `http://localhost:9007/api/v1`
Base URL (production): `https://erpapi.softypy.com//api/v1`

Full endpoint-by-endpoint documentation with request/response samples is in **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**.

A ready-to-import Postman collection is included: **`ERP-Backend.postman_collection.json`**.

### Modules & Base Paths

| Module | Base Path |
|---|---|
| Auth | `/api/v1/auth` |
| Users | `/api/v1/users` |
| Products | `/api/v1/products` |
| Sales | `/api/v1/sales` |
| Customers | `/api/v1/customers` |
| Dashboard | `/api/v1/dashboard` |

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 50 }
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errorMessages": []
}
```

---

## 🚀 Bonus Implementations

- [x] Modular Feature-Based Architecture
- [x] Global Error Handler
- [x] Reusable utilities (`catchAsync`, `sendResponse`, `ApiError`)
- [ ] Dynamic Role & Permission Management (database-driven)
- [ ] Generic Query Builder (search, filter, sort, pagination)

> Update this checklist to reflect what you actually implemented before submitting.

---

## 👤 Author

**Name:** Ibrahim Sikder
**Email:** ibrahimsikder5033@gmail.com
**Submitted for:** Full Stack (MERN) Developer position