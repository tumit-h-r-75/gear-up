# 🏋️ GearUp — Backend API

**"Rent Sports & Outdoor Gear Instantly"**

GearUp is a robust, production-ready RESTful backend API powering a multi-tier sports and outdoor equipment rental platform. It supports a full ecommerce workflow across three user roles: **Customers** (browse & rent), **Providers** (manage inventory & fulfillment), and **Admins** (platform oversight).

---

## 🔗 Quick Links

* 🚀 **Live API:** [https://gear-up-backend-drab.vercel.app](https://gear-up-backend-drab.vercel.app)
* 📚 **API Documentation:** [Postman Collection Workspace](https://documenter.getpostman.com/view/52459423/2sBY4LS2iJ)


---

## 🔑 Demo Admin Credentials

> **Email:** `admin@gmail.com`  
> **Password:** `admin123`

---

## 🧰 Tech Stack & Architecture

| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | Core REST API framework |
| **TypeScript (ESM)** | Strict end-to-end type safety |
| **PostgreSQL (Neon)** | Serverless database |
| **Prisma ORM 7** | Multi-file schema database layer |
| **JWT & bcryptjs** | Authentication & secure password hashing |
| **Stripe Node SDK** | Payment processing & checkout flow |
| **Render** | Cloud hosting & deployment |

---

## 👥 Roles & Permissions Matrix

| Role | Operational Scope |
|---|---|
| 🛒 **Customer** | Browse catalog, create rental orders, process Stripe payments, track orders, leave gear reviews. |
| 📦 **Provider** | List & manage owned gear inventory, track incoming rental requests, update fulfillment status. |
| 🛡️ **Admin** | Manage users/status, oversee categories, system-wide visibility over all listings, rentals, and payments. |

*Note: User roles (`CUSTOMER` or `PROVIDER`) are selected at registration. Admin accounts are provisioned securely via database seeding.*

---

## 📁 Project Structure

The project uses a feature-based modular design. Each domain module strictly adheres to a clean separation of concerns using a **4-file architectural pattern**: `*.interface.ts`, `*.service.ts`, `*.controller.ts`, and `*.routes.ts`.

```text
gear-up-backend/
├── prisma/
│   ├── migrations/
│   ├── schema/              # Multi-file Prisma schema structure
│   │   ├── schema.prisma    # Generator & Datasource
│   │   ├── enums.prisma
│   │   ├── user.prisma
│   │   ├── category.prisma
│   │   ├── gear.prisma
│   │   ├── rental.prisma
│   │   ├── payment.prisma
│   │   └── review.prisma
│   └── seed.ts              # System seed script (Admins & initial categories)
├── src/
│   ├── config/              # Centralized environment configs
│   ├── lib/                 # Shared instances (Prisma, Stripe clients)
│   ├── middlewares/         # Auth, role guard, error handling
│   ├── modules/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── gear/
│   │   ├── rental/
│   │   ├── payment/
│   │   ├── review/
│   │   └── admin/
│   ├── routes/              # Centralized route aggregator
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server bootstrap
├── prisma.config.ts
└── package.json

```

---

## ⚙️ Local Development Setup

### Prerequisites

* **Node.js** `>= 18.x`
* **PostgreSQL** instance (or a free [Neon](https://neon.tech) database)
* **Stripe Account** (for test mode API keys)

### Installation Steps

1. **Clone the Repository**
```bash
git clone [https://github.com/](https://github.com/)<your-username>/gear-up-backend.git
cd gear-up-backend
npm install

```


2. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<host>/<db>"

JWT_ACCESS_SECRET="your_long_random_jwt_secret_key"
JWT_ACCESS_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY="sk_test_..."
CLIENT_SUCCESS_URL="http://localhost:5000/api/payments/success"
CLIENT_CANCEL_URL="http://localhost:5000/api/payments/cancel"

```


3. **Run Database Migrations & Seed Data**
```bash
npx prisma migrate dev --name init
npm run seed

```


4. **Start the Development Server**
```bash
npm run dev

```


The API will be available at `http://localhost:5000/api`.

---

## 📡 API Reference Overview

**Base URLs:**

* Local: `http://localhost:5000/api`
* Production: `https://gear-up-backend-drab.vercel.app/api`

| Module | Route Endpoint | Access | Functionality |
| --- | --- | --- | --- |
| **Auth** | `/auth` | Public | Registration, Login, User profile (`/me`) |
| **Category** | `/categories` | Public / Admin | Browse categories; Admin write/update |
| **Gear** | `/gear` | Public / Provider | Browse gear; Providers manage listings (`/gear/provider/mine`) |
| **Rentals** | `/rentals` | Customer / Provider | Book rentals; Providers manage incoming requests (`/rentals/provider/orders`) |
| **Payments** | `/payments` | Customer | Stripe checkout sessions, confirmation callbacks, payment history |
| **Reviews** | `/reviews` | Customer | Post-rental ratings & feedback (Requires completed rental) |
| **Admin** | `/admin` | Admin Only | User suspension, platform-wide rentals & gear auditing |

*For complete endpoint documentation, sample payload bodies, and headers, view the [Postman Collection](https://documenter.getpostman.com/view/52459423/2sBY4LS2iJ).*

---

## 🛡️ Security & Engineering Standards

* **Standardized Payload Interface:** All HTTP responses are predictably formatted:
* Success: `{ success: true, message: string, data: T }`
* Error: `{ success: false, message: string, errorDetails: unknown }`


* **Input Validation:** Strict runtime payload validation across all write actions with standard `400 Bad Request` messages.
* **Granular Access Control:** JWT-backed middleware verifies identity (`auth`) alongside custom RBAC (`roleGuard`) to strictly enforce role limits (`CUSTOMER`, `PROVIDER`, `ADMIN`).
* **Strict Ownership Authorization:** Middleware guarantees providers can only mutate gear or orders attached to their workspace, and customers can only query their own transactional records.
* **Automated Payment Lifecycle:** Integrated Stripe Checkout Session lifecycle where database payment states (`PENDING` → `COMPLETED`/`FAILED`) cascade to automatically update tied rental bookings.

---

## 🚀 Deployment

The server is built for deployment on **Render** (or any Node.js container environment).

* **Build Command:** `npm install && npx prisma migrate deploy && npm run build`
* **Start Command:** `npm run start`

---

## 🧪 Testing & Quality Assurance

All paths have been validated using Postman across all 3 user roles, covering:

* Core domain CRUD flows
* Authorization breaches (Role mismatch `403 Forbidden`)
* Resource access violations (Un-owned data edits `403 Forbidden`)
* Validation boundary limits (`400 Bad Request`)
* Non-existent endpoint/resource targeting (`404 Not Found`)
* End-to-end payment lifecycle utilizing Stripe Test Cards (`4242 ... 4242`)
