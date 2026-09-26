# Campus AI — QA Coverage Matrix (T001 - T166)

| Test ID | Category | Target Component / API / Function | Verification Focus |
| :--- | :--- | :--- | :--- |
| **T001** | Build & Config | `package.json`, dependencies | Clean install from scratch |
| **T002** | Build & Config | ESLint / Code hygiene | Zero fatal lint errors |
| **T003** | Build & Config | TypeScript Compiler (`tsc --noEmit`) | Type safety across all models |
| **T004** | Build & Config | Production Build (`next build`) | Clean production bundle |
| **T005** | Build & Config | Environment variables (`.env.local`) | Graceful missing env handling |
| **T006** | Build & Config | `npm audit` | Vulnerability scanning |
| **T007** | Build & Config | Git & codebase secret scan | No plain secrets committed |
| **T008** | Build & Config | Client bundle | No backend secrets leaked to client |
| **T009** | Build & Config | Production Runtime | No dev routes/stack traces exposed |
| **T010** | Build & Config | Database seeder (`data/db.json`) | Idempotent initial seed |
| **T011** | Authentication | `/api/auth/login` | Valid login returns role-scoped JWT |
| **T012** | Authentication | `/api/auth/login` | Wrong password returns generic 401 |
| **T013** | Authentication | `/api/auth/login` | Non-existent email returns generic 401 |
| **T014** | Authentication | `/api/auth/login` | Missing/empty fields return 400 Bad Request |
| **T015** | Authentication | Auth & DB validation | Email format validation consistency |
| **T016** | Authentication | `src/lib/auth.ts` | BCrypt password hash ($2a, factor 10) |
| **T017** | Authentication | `src/lib/auth.ts` | BCrypt salt uniqueness & verification |
| **T018** | Authentication | `src/lib/auth.ts` | JWT HS256 algorithm enforcement |
| **T019** | Authentication | `src/lib/auth.ts` | JWT claims structure (sub, role, iat, exp) |
| **T020** | Authentication | `src/middleware.ts` | Expired token returns 401 redirect |
| **T021** | Authentication | `src/middleware.ts` | Tampered signature/payload rejection |
| **T022** | Authentication | `src/lib/auth.ts` | "alg: none" & confusion rejection |
| **T023** | Authentication | `src/lib/auth.ts` | Suspended user token rejection |
| **T024** | Authentication | Token refresh & rotation | Token lifecycle |
| **T025** | Authentication | `/api/auth/logout` | Server-side cookie clearance |
| **T026** | Authentication | `src/lib/auth.ts` | HttpOnly, SameSite cookie security |
| **T027** | Authentication | Rate limiting | Brute force login prevention |
| **T028** | Authentication | Multi-session cookies | Concurrent browser sessions isolation |
| **T029** | Authentication | Zero-login chat | Anonymous context sandbox |
| **T030** | Authentication | Password reset/update | Secure password updates |
| **T031** | Authorization | All API Endpoints | Complete RBAC allow/deny matrix |
| **T032** | Authorization | `/super-admin/*`, `/admin/*` | Student cannot access admin portals |
| **T033** | Authorization | `/super-admin/*` | Campus admin cannot access super admin |
| **T034** | Authorization | `/api/chat/*`, `/api/admin/*` | Horizontal IDOR prevention |
| **T035** | Authorization | Folders & Institutes | Multi-scope access enforcement |
| **T036** | Authorization | User update endpoints | Mass assignment immunity |
| **T037** | Authorization | User deletion | Self-lockout & last admin protection |
| **T038** | Authorization | User cascade | Orphan session & message cleanup |
| **T039** | Authorization | HTTP Verbs | Method tampering rejection |
| **T040** | Authorization | UI + Server RBAC | Server-side security enforcement |
| **T041** | Authorization | Admin user tabs | Exact DB tab count synchronization |
| **T042** | Authorization | `src/lib/db/index.ts` | Audit logging on privileged actions |
| **T043** | Super Admin | `/super-admin/dashboard` | Metric cards match database values |
| **T044** | Super Admin | `/super-admin/maintenance` | Maintenance toggle, scope, & exemption |
| **T045** | Super Admin | `/super-admin/storage` | Database table size breakdown |
| **T046** | Super Admin | `/super-admin/institutes` | Folder & institute management |
| **T047** | Super Admin | `/super-admin/students` | Global student roster search & pagination |
| **T048** | Super Admin | `/super-admin/telemetry` | Live telemetry & metrics |
| **T049** | Super Admin | `/super-admin/users` | Add Admin Account flow |
| **T050** | Super Admin | `/super-admin/users` | Add Chatbot User flow |
| **T051** | Super Admin | `/super-admin/users` | Edit user status & password re-hashing |
| **T052** | Super Admin | `/super-admin/users` | Delete user with confirmation |
| **T053** | Super Admin | `/super-admin/users` | Special characters & SQL metacharacters |
| **T054** | Super Admin | `/super-admin/users` | User list refetch & date format |
| **T055** | Super Admin | `/super-admin/chat-sessions`| Chat sessions inspection & privacy |
| **T056** | Super Admin | `/super-admin/jobs` | Background processing jobs queue |
| **T057** | Super Admin | `/super-admin/api-keys` | AI models, temperature, prompt configs |
| **T058** | Super Admin | `/super-admin/branding` | Whitelabel branding & logo validation |
| **T059** | Super Admin | `/super-admin/logins` | Active session & token revocation |
| **T060** | Super Admin | `/super-admin/database` | Database snapshot backup & restore |
| **T061** | Super Admin | `/super-admin/security` | Rate limiting & IP firewall rules |
| **T062** | Super Admin | SuperAdminHeader | Session state & root active indicator |
| **T063** | Campus Admin | `/admin/dashboard` | Gender counts (Male/Female/Total) fix |
| **T064** | Campus Admin | `/admin/dashboard` | 4 Year academic folders card |
| **T065** | Campus Admin | `/admin/dashboard` | Recent form submission stream order |
| **T066** | Campus Admin | `/admin/dashboard` | Real-time intake sync without duplicate |
| **T067** | Campus Admin | `/admin/dashboard` | Auto-sync status indicator |
| **T068** | Campus Admin | `/admin/dashboard` | Rapid refresh debouncing |
| **T069** | Campus Admin | `/admin/folders` | Folder form builder & activation |
| **T070** | Campus Admin | `/forms/[slug]` | Intake form submission validations |
| **T071** | Campus Admin | `/admin/students` | Student filtering, sorting, & search |
| **T072** | Campus Admin | `/api/admin/students` | Duplicate roll number blocking |
| **T073** | Campus Admin | `/api/admin/export` | CSV export & formula-injection defense |
| **T074** | Campus Admin | `/admin/users` | Campus user management |
| **T075** | Campus Admin | `/admin/storage` | Uploaded assets & quotas |
| **T076** | Campus Admin | `/admin/settings` | Settings persistence |
| **T077** | Campus Admin | `/admin/system` | Live service health status |
| **T078** | Campus Admin | Navigation | Student chatbot deep link |
| **T079** | Chatbot RAG | `/chat` | Initial empty state rendering |
| **T080** | Chatbot RAG | `/api/chat/sessions` | New chat session creation |
| **T081** | Chatbot RAG | `/api/chat/message` | Markdown formatted chat answer |
| **T082** | Chatbot RAG | `src/lib/rag/engine.ts` | 25 Golden Q&A accuracy evaluation |
| **T083** | Chatbot RAG | `src/lib/rag/engine.ts` | Non-existent student zero-hallucination |
| **T084** | Chatbot RAG | `src/lib/rag/engine.ts` | Out-of-scope question guardrails |
| **T085** | Chatbot RAG | `src/lib/rag/engine.ts` | PII privacy & peer-student isolation |
| **T086** | Chatbot RAG | `src/lib/rag/engine.ts` | Prompt injection defense |
| **T087** | Chatbot RAG | `src/lib/rag/engine.ts` | Retrieval-time isolation filtering |
| **T088** | Chatbot RAG | `src/lib/rag/engine.ts` | Long input & multilingual robustness |
| **T089** | Chatbot RAG | `src/app/chat/page.tsx` | Concurrent message ordering |
| **T090** | Chatbot RAG | `src/app/chat/page.tsx` | Network interruption resilience |
| **T091** | Chatbot RAG | `src/app/chat/page.tsx` | Multi-turn contextual continuity |
| **T092** | Chatbot RAG | `src/components/chat/Sidebar`| Conversation history search |
| **T093** | Chatbot RAG | `/api/chat/sessions/[id]` | Rename and delete chat session |
| **T094** | Chatbot RAG | `DELETE /api/chat/sessions` | Clear Data user session purge |
| **T095** | Chatbot RAG | ChatSettingsModal | Theme & appearance persistence |
| **T096** | Chatbot RAG | `src/app/chat/page.tsx` | Refresh session synchronization |
| **T097** | Chatbot RAG | `src/lib/rag/engine.ts` | Grounded source citations |
| **T098** | Chatbot RAG | Intake & RAG sync | Instant fresh data availability |
| **T099** | LLM & API Keys | Google Gemini Provider | Live Gemini LLM execution |
| **T100** | LLM & API Keys | LLM Engine | Missing key graceful degradation |
| **T101** | LLM & API Keys | LLM Engine | Invalid key error handling |
| **T102** | LLM & API Keys | LLM Engine | Rate limit backoff & retry |
| **T103** | LLM & API Keys | LLM Engine | Burst request queueing |
| **T104** | LLM & API Keys | LLM Engine | Network timeout defense |
| **T105** | LLM & API Keys | LLM Engine | Malformed response parsing |
| **T106** | LLM & API Keys | Super Admin AI Config | Live key rotation without restart |
| **T107** | LLM & API Keys | Credentials Vault | Secret masking (`sk-****abcd`) |
| **T108** | LLM & API Keys | Client Bundle & Logs | Zero plain secrets exposure |
| **T109** | LLM & API Keys | AI Config | Gemini 1.5 Flash vs Pro switching |
| **T110** | LLM & API Keys | AI Config | Token usage & cost accounting |
| **T111** | LLM & API Keys | Embedding Pipeline | Vector chunking robustness |
| **T112** | LLM & API Keys | LLM Engine | Fallback provider redundancy |
| **T113** | OWASP Security | All endpoints | SQL injection parameterized safety |
| **T114** | OWASP Security | All endpoints | NoSQL operator injection defense |
| **T115** | OWASP Security | Form & Chat inputs | Stored XSS sanitization |
| **T116** | OWASP Security | Search & URLs | Reflected DOM XSS defense |
| **T117** | OWASP Security | State-changing routes | SameSite cookie CSRF protection |
| **T118** | OWASP Security | Next.js API Routes | Strict CORS origin verification |
| **T119** | OWASP Security | Headers | Security headers & frame protection |
| **T120** | OWASP Security | `/api/storage/upload` | File upload MIME & size validation |
| **T121** | OWASP Security | Branding & Imports | SSRF protection on URLs |
| **T122** | OWASP Security | `/api/admin/export` | Path traversal LFI defense |
| **T123** | OWASP Security | Public Endpoints | IP-based request rate limiting |
| **T124** | OWASP Security | Error boundaries | Generic production error messages |
| **T125** | OWASP Security | GET user APIs | Password hash redaction (`***`) |
| **T126** | OWASP Security | Defaults | Default credential & path security |
| **T127** | Real-Time | Dashboard auto-sync | Polling & telemetry intervals |
| **T128** | Real-Time | Telemetry stream | Authorized live telemetry channels |
| **T129** | Real-Time | FD Diagnostics | Live telemetry latency measurement |
| **T130** | Real-Time | Network resilience | Automatic reconnection with backoff |
| **T131** | Real-Time | Background tab | Timer management on visibility change |
| **T132** | Real-Time | Console UI | Long-running memory leak verification |
| **T133** | Real-Time | Dual Admin | Concurrent modification consistency |
| **T134** | Real-Time | Intake Form | 50 parallel submissions stress test |
| **T135** | Real-Time | Chat Streaming | Streaming response token throughput |
| **T136** | Real-Time | Intake Indexing | Live student ingestion latency |
| **T137** | Data Integrity | `src/lib/db/schema.ts` | Schema PKs, FKs, & constraints |
| **T138** | Data Integrity | Date utilities | ISO 8601 UTC storage & IST display |
| **T139** | Data Integrity | `src/lib/db/index.ts` | Multi-step database atomicity |
| **T140** | Data Integrity | Student deletion | Referential integrity on cascade |
| **T141** | Data Integrity | Analytics & Dashboard | Aggregated count vs record equality |
| **T142** | Data Integrity | Backup & Restore | Byte & row-level snapshot fidelity |
| **T143** | Data Integrity | Race conditions | Concurrent registration uniqueness |
| **T144** | Data Integrity | 7-day retention purge | Automated stale data cleanup |
| **T145** | Performance | Web Core Vitals | Page render performance & metrics |
| **T146** | Performance | API endpoints | Ramp load throughput & latency |
| **T147** | Performance | Chatbot RAG | Concurrent chat message load |
| **T148** | Performance | Large Dataset | 10,000+ student record query speed |
| **T149** | Performance | List queries | Batch lookup optimization |
| **T150** | Performance | Soak Testing | Long-running memory & CPU stability |
| **T151** | UI/UX & A11y | All Portals | Zero 404 broken sidebar navigation links |
| **T152** | UI/UX & A11y | All Buttons | Active handlers on all UI controls |
| **T153** | UI/UX & A11y | Data Views | Loading, empty, and error state UX |
| **T154** | UI/UX & A11y | Forms | Inline error messages & validation |
| **T155** | UI/UX & A11y | Viewport responsive | Mobile (375px) to Desktop (1440px) |
| **T156** | UI/UX & A11y | Accessibility | WCAG contrast & keyboard navigation |
| **T157** | UI/UX & A11y | Browser Matrix | Chromium, WebKit, Firefox compatibility |
| **T158** | UI/UX & A11y | Deep Linking | State preservation on browser refresh |
| **T159** | E2E Journeys | Super Admin Journey | Create Admin & Chatbot User & sync |
| **T160** | E2E Journeys | Campus Admin Journey | Intake submission -> stream -> export |
| **T161** | E2E Journeys | Student RAG Journey | Ask own data vs peer data isolation |
| **T162** | E2E Journeys | Key Rotation Journey | Live rotate Gemini key & verify chat |
| **T163** | E2E Journeys | Maintenance Journey | Toggle maintenance -> verify lock -> restore |
| **T164** | E2E Journeys | Disaster Recovery | Snapshot -> delete data -> restore |
| **T165** | E2E Journeys | Student Lifecycle | Intake -> verify RAG -> delete -> purge |
| **T166** | E2E Journeys | Triple Multi-Session | Student + Admin + SuperAdmin 3-tab auth |
