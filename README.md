# GearUp 🏋️ — Backend API

**"Rent Sports & Outdoor Gear Instantly"**

A backend REST API for a sports and outdoor equipment rental platform. Customers browse gear and place rental orders, providers manage inventory and fulfill orders, and admins oversee the whole platform.

---

## 🔗 Live Links

| Item | Link |
|---|---|
| **Live API** | https://gear-up-backend-drab.vercel.app |
| **API Documentation (Postman)** | *https://documenter.getpostman.com/view/52459423/2sBY4LS2iJ* |

> ⚠️ Render's free tier spins down after inactivity. The first request after idle may take 30-60 seconds to respond — this is expected.

---

## 🔑 Admin Credentials

```
Email: admin@gmail.com
Password: admin123

```

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API framework |
| TypeScript (ESM) | Type safety |
| PostgreSQL (Neon) | Database |
| Prisma ORM 7 | Database access layer (multi-file schema) |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Stripe | Payment processing |
| Render | Deployment |

---

## 👥 Roles & Permissions

| Role | Key Permissions |
|---|---|
| **Customer** | Browse gear, place rental orders, pay via Stripe, track order status, leave reviews |
| **Provider** | Add/edit/delete gear, view incoming orders, update order status |
| **Admin** | View/suspend users, manage categories, view all gear and orders platform-wide |

Users choose their role (`CUSTOMER` or `PROVIDER`) at registration. Admin accounts are created only via the seed script.

---

## 📁 Project Structure

```
gear-up-backend/
├── prisma/
│   ├── migrations/
│   ├── schema/              # multi-file Prisma schema
│   │   ├── schema.prisma    # generator + datasource
│   │   ├── enums.prisma
│   │   ├── user.prisma
│   │   ├── category.prisma
│   │   ├── gear.prisma
│   │   ├── rental.prisma
│   │   ├── payment.prisma
│   │   └── review.prisma
│   └── seed.ts
├── src/
│   ├── config/               # env config loader
│   ├── generated/prisma/     # Prisma client (generated, gitignored)
│   ├── lib/                  # prisma client, stripe client
│   ├── middlewares/          # auth, roleGuard, error handling
│   ├── modules/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── gear/
│   │   ├── rental/
│   │   ├── payment/
│   │   ├── review/
│   │   └── admin/
│   ├── routes/index.ts       # central route aggregator
│   ├── app.ts
│   └── server.ts
├── prisma.config.ts
└── package.json
```

Each module follows the same 4-file pattern: `*.interface.ts`, `*.service.ts`, `*.controller.ts`, `*.routes.ts`.

---

## ⚙️ Local Setup

**1. Clone and install**
```bash
git clone https://github.com/<your-username>/gear-up-backend.git
cd gear-up-backend
npm install
```

**2. Environment variables**

Copy `.env.example` to `.env` and fill in your own values:
```
PORT=5000
DATABASE_URL=<Neon pooled connection string>
DIRECT_URL=<Neon direct connection string>
JWT_ACCESS_SECRET=<a long random string>
JWT_ACCESS_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
STRIPE_SECRET_KEY=<your Stripe test secret key>
CLIENT_SUCCESS_URL=http://localhost:5000/api/payments/success
CLIENT_CANCEL_URL=http://localhost:5000/api/payments/cancel
```

**3. Database setup**
```bash
npx prisma migrate dev --name init
npm run seed
```

**4. Run the dev server**
```bash
npm run dev
```
Server starts at `http://localhost:5000`.

---

## 📡 API Overview

Base URL (local): `http://localhost:5000/api`
Base URL (production): `https://gear-up-backend-5b6a.onrender.com/api`

| Module | Base Path | Notes |
|---|---|---|
| Auth | `/auth` | register, login, me |
| Category | `/categories` | public read, admin write |
| Gear | `/gear` | public read, provider write (`/gear/provider/mine` for own listings) |
| Rentals | `/rentals` | customer booking, provider order management (`/rentals/provider/orders`) |
| Payments | `/payments` | Stripe checkout session, confirmation, history |
| Reviews | `/reviews` | customer-only, requires a returned rental |
| Admin | `/admin` | users, gear, rentals oversight |

Full endpoint list with example requests: see the Postman collection linked above.

---

## ✅ Standards Followed

- **Consistent responses** — every response follows `{ success, message, data }`; every error follows `{ success, message, errorDetails }`.
- **Input validation** — manual server-side validation on every write endpoint, with descriptive 400 error messages.
- **Role-based access** — `auth` middleware verifies identity, `roleGuard` middleware restricts by role (`CUSTOMER` / `PROVIDER` / `ADMIN`).
- **Ownership checks** — providers can only modify their own gear/orders; customers can only view their own orders/payments.
- **Payment integration** — real Stripe Checkout Sessions (test mode), with payment status tracked in the database (`PENDING` → `COMPLETED`/`FAILED`), and the linked rental order's status updates automatically on successful payment.

---

## 🚀 Deployment

Deployed on **Render** as a Node web service.

- **Build command:** `npm install && npx prisma migrate deploy && npm run build`
- **Start command:** `npm run start`
- Environment variables configured in Render's dashboard (see list above).

---

## 🧪 Testing

All endpoints were manually tested via Postman across all three roles (Customer, Provider, Admin), covering:
- Successful CRUD operations
- Role-based access rejections (403)
- Ownership violations (403)
- Missing/invalid input (400)
- Not-found resources (404)
- Full Stripe payment flow using test card `4242 4242 4242 4242`

See the linked Postman collection for the full request set with example bodies.