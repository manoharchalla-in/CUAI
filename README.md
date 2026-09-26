# CityApp AI — Enterprise Multi-Tenant Campus Knowledge Platform & AI RAG Assistant

A unified, high-performance SaaS platform providing intelligent student knowledge retrieval, role-gated administration, dynamic intake forms, atomic JSON/SQLite multi-field RAG search, and real-time inference telemetry.

---

## 🚀 Key Features

* **AI Chatbot & Grounded RAG Assistant**:
  * Multi-field disambiguation across 20+ student fields (Skills, Blood Group, Parents, Activities, Academic History).
  * High precision zero-hallucination vector grounding.
  * Real-time query streaming and conversation persistence.
* **Role-Gated Multi-Portal Architecture**:
  * **Chatbot Portal** (`/login`, `/chat`): Gated student & campus user access.
  * **Campus Admin Console** (`/admin/login`, `/admin/dashboard`): Student rosters, batch imports/exports, year folder management, analytics, and form diagnostics.
  * **Master Super Admin Suite** (`/super-admin/login`, `/super-admin/dashboard`): Full telemetry, database snapshots, API keys vault, security firewall, whitelabel branding, and maintenance modes.
* **Dynamic Public Intake Forms** (`/forms/[slug]`):
  * Automatic schema-driven form generation with real-time auto-saving and instant synchronization with student academic folders.
* **SaaS Design System**:
  * 100% responsive light-theme UI built on a consistent 4px-32px spacing grid, unified SaaS tokens, and accessible interactive states.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 14 (App Router, Server Components & Route Handlers)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS with custom SaaS design tokens
* **Security & Auth**: JOSE JWT cookies with HTTP-only flags, Role-Based Access Control (RBAC) middleware, and brute-force protection
* **Icons**: Lucide React
* **Charts & Telemetry**: Recharts & custom vector gauges
* **Database Engine**: Atomic JSON file store (`data/db.json`) with zero-latency local caching

---

## 📦 Requirements & Prerequisites

* Node.js >= 18.17.0
* npm >= 9.0.0

---

## ⚡ Quick Start & Development

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Set your `JWT_SECRET` and optional AI provider keys.

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🏗️ Production Build & Verification

To verify production readiness:

```bash
# Type-check the codebase
npx tsc --noEmit

# Compile production bundle
npm run build

# Launch production server
npm start
```

---

## 🔐 Security & Roles Overview

| Portal | Route | Target Audience | Access Role Required |
| :--- | :--- | :--- | :--- |
| **Student Chatbot** | `/chat` | Enrolled Students & Faculty | `user` |
| **Campus Admin** | `/admin/dashboard` | Department Officers & Admins | `admin` |
| **Super Admin** | `/super-admin/dashboard`| Root Infrastructure Admins | `superadmin` |
| **Public Intake** | `/forms/[slug]` | Applicants & Incoming Students| Public (Secured by token/slug) |

---

## 🛡️ Production Verification Checklist

* [x] **Zero TypeScript Errors**: Verified via `tsc --noEmit`.
* [x] **Production Compilation**: Verified via `npm run build` across all 67 routes and API endpoints.
* [x] **Secrets & Credentials**: Protected on server-side only; `.env` added to `.gitignore`.
* [x] **Security Middleware**: Complete JWT verification and strict RBAC redirects on all non-public routes.
* [x] **Design Tokens**: Standardized padding, borders, headers, tables, cards, and modals.
* [x] **Disaster Recovery**: Database snapshots and factory reseed endpoints operational.

---

## 📄 License
This project is proprietary and confidential. All rights reserved.
