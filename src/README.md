# Multi-Tenant Call Center Ticketing System (Backend API)

A production-grade, multi-tenant ticketing and call-tracking system backend built to power real-time call center dashboards. This system isolates customer profiles, voice call event data, and support tickets cleanly by client tenants.

## 🚀 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL (v14+)
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt password hashing

---

## 📁 Project Structure

```text
backend/
├── src/
│   ├── config/           # Database configuration pool (pg)
│   ├── controllers/      # Business logic (Auth, Tickets, Calls, Customers)
│   ├── middleware/       # JWT Authentication & Multi-tenant boundary checks
│   ├── routes/           # Express API endpoints
│   ├── types/            # Strict TypeScript Interfaces matching DB structures
│   ├── schema.sql        # Core raw PostgreSQL relational schema definitions
│   ├── initDb.ts         # Database migration script execution utility
│   └── index.ts          # Express Server application entry point
├── package.json
└── tsconfig.json

Setup Instructions
1. Prerequisites
Ensure you have Node.js and PostgreSQL installed and running locally on your machine.

2. Database Environment Setup
Log into your local PostgreSQL instance using an editor or terminal tool and create a fresh, empty target database:
SQL
CREATE DATABASE dugu_ticketing_system;

3. Clone and Install Dependencies
Navigate into your backend folder and install the required modules:
Bash
cd backend
npm install

4. Configure Environment Variables
Create a .env file inside the root of the backend/ directory and populate it with your local credentials:

Code snippet
PORT=5000
NODE_ENV=development
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password
DB_HOST=localhost
DB_NAME=dugu_ticketing_system
DB_PORT=5432
JWT_SECRET=your_secure_jwt_random_secret_string

5. Initialize the Database Schema
Instead of running manual scripts via visual tools, execute the built-in migration automation runner to generate all custom role enums, constraints, performance indexes, and multi-tenant tables:
Bash
npm run db:init

6. Boot the Development Server
Run the local application server with automated live-reloads enabled via ts-node-dev:
Bash
npm run dev
The console will verify connection details:
Dugu listening safely on port 5000
✅ Database connected successfully!

