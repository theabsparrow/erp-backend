# ERP Backend

A robust **Enterprise Resource Planning (ERP)** REST API backend built with Node.js and Express. It powers a full-featured ERP system that handles user management, role-based access control, product & category management, sales tracking, and a business dashboard — all secured with JWT authentication.

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| 🌐 Frontend Live | [https://mini-erp-chi-ten.vercel.app](https://mini-erp-chi-ten.vercel.app) |
| 🚀 Backend Live | [https://erp-backend-ten-delta.vercel.app](https://erp-backend-ten-delta.vercel.app) |
| 💻 Frontend GitHub | [https://github.com/theabsparrow/erp-frontend.git](https://github.com/theabsparrow/erp-frontend.git) |
| 🛠️ Backend GitHub | [https://github.com/theabsparrow/erp-backend.git](https://github.com/theabsparrow/erp-backend.git) |


---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Language | TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT (Access & Refresh Token) |
| Validation | Zod |
| Image Upload | Cloudinary + Multer |
| Password Hashing | Bcrypt |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## ✨ Features

- **JWT Authentication** — Secure login with access & refresh token strategy
- **Role-Based Access Control (RBAC)** — Dynamic roles (Admin, Manager, Employee) with granular permission management
- **User Management** — Create, update, delete, and manage users with role assignment
- **Product Management** — Full CRUD for products with image upload via Cloudinary
- **Category Management** — Organize products under categories
- **Sales Management** — Record and track sales transactions
- **Dashboard** — Aggregated business stats and insights
- **Database Seeding** — Seed default roles and admin/manager/employee users via CLI commands
- **Global Error Handling** — Centralized error handler covering Zod, Mongoose cast, duplicate key, and validation errors
- **Query Builder** — Reusable utility for filtering, sorting, and pagination

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [MongoDB](https://www.mongodb.com/) (local or Atlas URI)
- A [Cloudinary](https://cloudinary.com/) account

### 1. Clone the Repository

```bash
git clone https://github.com/theabsparrow/erp-backend.git
cd erp-backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Then fill in all the values (see the [Environment Variables](#-environment-variables) section below).

### 4. Seed the Database

Seed the default roles first, then seed the default users:

```bash
pnpm seed:roles
pnpm seed:admin
```

This will create **Admin**, **Manager**, and **Employee** roles and their corresponding seed users using the credentials you set in `.env`.

### 5. Run the Development Server

```bash
pnpm dev
```

The server will start at `http://localhost:5000` (or the `PORT` you set in `.env`).

### 6. Build for Production

```bash
pnpm build
pnpm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=your_mongodb_connection_uri

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUND=8

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Frontend
FRONTEND_LINK=http://localhost:3000

# Seed Users
ADMIN_EMAIL=admin@erp.com
ADMIN_PHONE=01700000000
ADMIN_PASS=Admin@1234

MANAGER_EMAIL=manager@erp.com
MANAGER_PHONE=01700000001
MANAGER_PASS=Manager@1234

EMPLOYEE_EMAIL=employee@erp.com
EMPLOYEE_PHONE=01700000002
EMPLOYEE_PASS=Employee@1234
```

---

## 📁 Project Structure

```
src/
├── builders/        # Reusable QueryBuilder for filtering, sorting, pagination
├── config/          # App config and Cloudinary setup
├── error/           # Custom error classes and error handlers
├── interface/       # Global TypeScript interfaces
├── middlewire/      # Auth, validation, error, and notFound middlewares
├── module/          # Feature modules (auth, user, role, product, category, sale, dashboard)
├── router/          # Central route aggregator
├── utills/          # catchAsync and sendResponse helpers
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run compiled production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm prettier:fix` | Format code with Prettier |
| `pnpm seed:roles` | Seed default roles into the database |
| `pnpm seed:admin` | Seed default Admin, Manager, and Employee users |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
