# Campus AI — System Architecture Specification

## 1. System Overview & Technology Stack
* **Framework**: Next.js 16 (App Router with Server & Client Components)
* **Frontend**: React 18, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti
* **Runtime**: Node.js v20+ / Windows PowerShell Runtime
* **Authentication**: JWT (Jose HS256) + BCrypt (cost factor 10) with role-scoped cookies (`user_auth_token`, `admin_auth_token`, `superadmin_auth_token`, `auth_token`)
* **Database & Persistence**: In-memory JSON/SQLite persistence (`data/db.json`) with auto-snapshot and 7-day retention purging
* **Cloud Storage**: Supabase Cloud Storage (`@supabase/supabase-js`) bucket `student-assets`
* **AI & LLM Grounding**: Google Gemini AI (`@google/genai` / Gemini 1.5 Flash/Pro) + Semantic Entity Extraction RAG Pipeline

---

## 2. Portals & Access Roles

| Portal | Base Route | Allowed Role | Purpose |
| :--- | :--- | :--- | :--- |
| **Master Super Admin** | `/super-admin/*` | `superadmin` | System health, maintenance lockdown, user provisioning, Supabase vault, API keys, database backups, audit logs, live telemetry |
| **Campus Admin** | `/admin/*` | `admin`, `superadmin` | Intake folders, student rosters, real-time submission stream, CSV export, diagnostics, account management |
| **Student Chatbot** | `/chat`, `/` | `user`, `admin`, `superadmin` | Natural language verified campus AI queries, student details, disambiguation, zero-hallucination RAG engine |
| **Public Intake** | `/forms/[slug]` | Public (Unauthenticated) | Dynamic multi-section student intake form with live auto-save and device telemetry (FD) |

---

## 3. Directory Structure
```
d:\CITYAPP\
├── data/
│   └── db.json                   # Main persistent database store
├── qa/                           # Quality Assurance & Test Artifacts
│   ├── ARCHITECTURE.md           # Architecture & endpoint inventory
│   ├── COVERAGE_MATRIX.md        # Test matrix mapping T001-T166
│   ├── TEST_LOG.md               # Execution log for all test suites
│   ├── REPORT.md                 # Final exhaustive QA & security report
│   ├── seed-test-data.ts         # Deterministic test database seeder
│   └── tests/                    # Automated test suites
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── admin/                # Campus Admin pages
│   │   ├── super-admin/          # Master Super Admin pages
│   │   ├── chat/                 # Student Chatbot UI
│   │   ├── forms/[slug]/         # Public Dynamic Intake Form
│   │   ├── login/                # Student Chatbot Login
│   │   ├── register/             # Student Self-Registration
│   │   ├── api/                  # Backend REST API Endpoints
│   │   │   ├── admin/            # Campus Admin APIs
│   │   │   ├── super-admin/      # Super Admin APIs
│   │   │   ├── auth/             # Authentication & Session APIs
│   │   │   ├── chat/             # RAG Chat & Session APIs
│   │   │   ├── forms/            # Intake Form submission APIs
│   │   │   ├── storage/          # Supabase Cloud Storage APIs
│   │   │   └── system/           # Health & Maintenance APIs
│   │   └── middleware.ts         # Edge RBAC & Route Protection Filter
│   ├── components/               # Modular UI Component Library
│   └── lib/                      # Core Business Logic & Engines
│       ├── auth.ts               # JWT creation, verification & cookies
│       ├── db/                   # Database operations, queries & schemas
│       ├── rag/                  # Verified RAG entity extraction & search
│       └── supabase.ts           # Supabase Cloud client & storage helpers
```

---

## 4. Complete Endpoint Inventory

| Method | Endpoint Path | Auth Required | Allowed Roles | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | No | Public | Authenticates credentials and sets role-scoped session cookie |
| `POST` | `/api/auth/logout` | No | Any | Clears role-scoped session cookies |
| `GET` | `/api/auth/me` | Yes | Any | Returns authenticated user profile |
| `GET` | `/api/system/maintenance` | No | Any | System maintenance status and lockdown scope check |
| `GET` | `/api/chat/sessions` | Yes | `user`, `admin`, `superadmin` | Lists chat sessions for the active user |
| `POST` | `/api/chat/sessions` | Yes | `user`, `admin`, `superadmin` | Creates a new chat session |
| `DELETE`| `/api/chat/sessions` | Yes | `user`, `admin`, `superadmin` | Clears all chat sessions for active user (Clear Data) |
| `GET` | `/api/chat/sessions/[id]` | Yes | `user`, `admin`, `superadmin` | Fetches conversation messages for a session |
| `PATCH`| `/api/chat/sessions/[id]` | Yes | `user`, `admin`, `superadmin` | Renames conversation title |
| `DELETE`| `/api/chat/sessions/[id]` | Yes | `user`, `admin`, `superadmin` | Deletes specific conversation session |
| `POST` | `/api/chat/message` | Yes | `user`, `admin`, `superadmin` | Executes RAG query pipeline and records messages |
| `GET` | `/api/forms/[slug]` | No | Public | Fetches form schema and fields for a specific year folder |
| `POST` | `/api/forms/[slug]` | No | Public | Submits student intake registration and telemetry |
| `POST` | `/api/storage/upload` | No | Any | Uploads file to Supabase Cloud Storage bucket |
| `GET` | `/api/admin/stats` | Yes | `admin`, `superadmin` | Returns aggregated overview stats |
| `GET` | `/api/admin/analytics` | Yes | `admin`, `superadmin` | Returns KPIs (Total, Male, Female, Growth) |
| `GET` | `/api/admin/students` | Yes | `admin`, `superadmin` | Lists/searches student roster with pagination |
| `POST` | `/api/admin/students` | Yes | `admin`, `superadmin` | Manually inserts a new student record |
| `PATCH`| `/api/admin/students/[id]`| Yes | `admin`, `superadmin` | Updates an existing student record |
| `DELETE`| `/api/admin/students/[id]`| Yes | `admin`, `superadmin` | Deletes student record and purges index |
| `GET` | `/api/admin/folders` | Yes | `admin`, `superadmin` | Lists all 4 academic year folders |
| `POST` | `/api/admin/folders` | Yes | `admin`, `superadmin` | Creates or configures a year folder |
| `GET` | `/api/admin/export` | Yes | `admin`, `superadmin` | Generates secure CSV student roster export |
| `GET` | `/api/admin/users` | Yes | `admin`, `superadmin` | Lists campus accounts (with superadmin filter) |
| `POST` | `/api/admin/users` | Yes | `admin`, `superadmin` | Creates user or admin account |
| `GET` | `/api/super-admin/supabase` | Yes | `superadmin` | Fetches live Supabase storage metrics & buckets |
| `POST` | `/api/super-admin/supabase` | Yes | `superadmin` | Manages Supabase buckets, keys, and file deletion |
| `GET` | `/api/super-admin/maintenance`| Yes | `superadmin` | Global & per-account maintenance configuration |
| `POST` | `/api/super-admin/maintenance`| Yes | `superadmin` | Updates global maintenance lock or account status |
| `GET` | `/api/super-admin/database` | Yes | `superadmin` | Generates / downloads database backup snapshots |
| `POST` | `/api/super-admin/database` | Yes | `superadmin` | Restores database snapshot from backup |

---

## 5. Database Schema & Entities
* **`admins`**: `id`, `email`, `password_hash`, `name`, `role` (`superadmin` \| `admin`), `status`, `created_at`
* **`users`**: `id`, `email`, `password_hash`, `name`, `role` (`user`), `status`, `created_at`
* **`year_folders`**: `id`, `name`, `slug`, `year_label`, `description`, `is_form_active`, `form_token`, `created_at`
* **`student_records`**: `id`, `folder_id`, `year`, `name`, `roll_number`, `gender`, `email`, `phone`, `college`, `branch`, `section`, `admission_type`, `dob`, `blood_group`, `aadhaar_no`, `father_name`, `mother_name`, `permanent_address`, `present_address`, `skills`, `achievements`, `extracurricular`, `hobbies`, `sports`, `profile_image`, `custom_fields_json`, `created_at`, `updated_at`
* **`chat_sessions`**: `id`, `user_id`, `title`, `created_at`, `updated_at`
* **`chat_messages`**: `id`, `session_id`, `sender` (`user` \| `assistant`), `content`, `metadata_json`, `created_at`
* **`form_diagnostics`**: `id`, `folder_slug`, `student_id`, `student_name`, `roll_number`, `email`, `status`, `ip_address`, `browser`, `os`, `device_type`, `first_field_time`, `submit_time`, `total_duration_seconds`, `created_at`
* **`audit_logs`**: `id`, `actor`, `action`, `entity_type`, `entity_id`, `details`, `ip_address`, `created_at`
* **`system_settings`**: `key`, `value`, `updated_at`

---

## 6. Environment Variables
* `GEMINI_API_KEY`: Google Gemini LLM API authorization key
* `NEXT_PUBLIC_AI_PROVIDER`: Default LLM engine (`Gemini`)
* `JWT_SECRET`: Secret key for HS256 token signing
* `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (`https://oqehuczoyeffyiofcomk.supabase.co`)
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public client anon key
* `SUPABASE_SERVICE_ROLE_KEY`: Privileged backend secret key for storage & buckets
* `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`: Default bucket name (`student-assets`)
