-- ==============================================================================
-- COMPLETE SUPABASE POSTGRESQL TABLES & DATA SEEDING SCRIPT
-- Paste and Run this in: Supabase Dashboard -> SQL Editor -> Run (Ctrl + Enter)
-- Project: https://supabase.com/dashboard/project/oqehuczoyeffyiofcomk/sql
-- ==============================================================================

-- 1. DROP EXISTING CONFLICTING TABLES IF ANY (Clean Slate)
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.form_diagnostics CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.student_records CASCADE;
DROP TABLE IF EXISTS public.form_configs CASCADE;
DROP TABLE IF EXISTS public.year_folders CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. CREATE TABLES
CREATE TABLE public.year_folders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    year_label TEXT NOT NULL,
    description TEXT,
    is_form_active INTEGER DEFAULT 1,
    form_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.form_configs (
    id TEXT PRIMARY KEY,
    folder_id TEXT NOT NULL REFERENCES public.year_folders(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,
    field_name TEXT NOT NULL,
    field_label TEXT NOT NULL,
    field_type TEXT NOT NULL,
    is_required INTEGER DEFAULT 0,
    options_json TEXT DEFAULT '[]',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.student_records (
    id TEXT PRIMARY KEY,
    folder_id TEXT NOT NULL REFERENCES public.year_folders(id) ON DELETE CASCADE,
    year TEXT NOT NULL,
    name TEXT NOT NULL,
    roll_number TEXT NOT NULL UNIQUE,
    profile_image TEXT,
    gender TEXT,
    branch TEXT NOT NULL,
    section TEXT,
    college TEXT NOT NULL,
    admission_type TEXT,
    dob TEXT,
    blood_group TEXT,
    aadhaar_no TEXT,
    father_name TEXT,
    father_occupation TEXT,
    mother_name TEXT,
    mother_occupation TEXT,
    reservation_category TEXT,
    mode_of_transport TEXT,
    accommodation_type TEXT,
    permanent_address TEXT,
    present_address TEXT,
    permanent_pincode TEXT,
    present_pincode TEXT,
    permanent_phone TEXT,
    present_phone TEXT,
    phone TEXT,
    email TEXT NOT NULL,
    ssc_marks TEXT,
    ssc_hall_ticket_no TEXT,
    intermediate_marks TEXT,
    intermediate_hall_ticket_no TEXT,
    previous_course TEXT,
    previous_max_marks TEXT,
    previous_marks_obtained TEXT,
    previous_sno TEXT,
    achievements TEXT,
    extracurricular TEXT,
    hobbies TEXT,
    sports TEXT,
    skills TEXT,
    address TEXT,
    profile_info TEXT,
    custom_fields_json TEXT DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.admins (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    admin_id TEXT,
    admin_email TEXT,
    details TEXT,
    ip_address TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.form_diagnostics (
    id TEXT PRIMARY KEY,
    folder_id TEXT,
    student_name TEXT,
    roll_number TEXT,
    status TEXT,
    message TEXT,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and Grant Public PostgREST Access
ALTER TABLE public.year_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Full Access Folders" ON public.year_folders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access FormConfigs" ON public.form_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Students" ON public.student_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access Diagnostics" ON public.form_diagnostics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access ChatSessions" ON public.chat_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access ChatMessages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_student_records_folder ON public.student_records(folder_id);
CREATE INDEX IF NOT EXISTS idx_student_records_roll ON public.student_records(roll_number);
CREATE INDEX IF NOT EXISTS idx_student_records_email ON public.student_records(email);
CREATE INDEX IF NOT EXISTS idx_form_configs_folder ON public.form_configs(folder_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- 3. SEED ALL DATA

-- Seed Year Folders
INSERT INTO public.year_folders (id, name, slug, year_label, description, is_form_active, form_token, created_at, updated_at) VALUES ('folder_1st_year', '1st Year', '1st-year', '26HT1A43 2026-2030', 'First Year (26HT1A43 Batch 2026-2030)', 1, 'token_1st-year_secret', '2026-09-25T13:50:41.312Z', '2026-09-25T13:53:19.352Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.year_folders (id, name, slug, year_label, description, is_form_active, form_token, created_at, updated_at) VALUES ('folder_2nd_year', '2nd Year', '2nd-year', '25HT1A43 2025-2029', 'Second Year (25HT1A43 Batch 2025-2029)', 1, 'token_2nd-year_secret', '2026-09-25T13:50:41.313Z', '2026-09-25T13:53:19.352Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.year_folders (id, name, slug, year_label, description, is_form_active, form_token, created_at, updated_at) VALUES ('folder_3rd_year', '3rd Year', '3rd-year', '24HT1A43 2024-2028', 'Third Year (24HT1A43 Batch 2024-2028)', 1, 'token_3rd-year_secret', '2026-09-25T13:50:41.313Z', '2026-09-25T13:53:19.352Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.year_folders (id, name, slug, year_label, description, is_form_active, form_token, created_at, updated_at) VALUES ('folder_4th_year', '4th Year', '4th-year', '23HT1A43 2023-2027', 'Fourth Year (23HT1A43 Batch 2023-2027)', 1, 'token_4th-year_secret', '2026-09-25T13:50:41.313Z', '2026-09-25T13:53:19.352Z') ON CONFLICT (id) DO NOTHING;

-- Seed Admins
INSERT INTO public.admins (id, email, password_hash, name, role, created_at) VALUES ('admin_super_01', 'superadmin@com', '$2a$10$XTYwqjitfempsAog8r/ZVOSzrl1HAkcgWZfZOgxai2VqK6Ns/SAwm', 'Master Super Admin', 'superadmin', '2026-09-25T13:50:41.576Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.admins (id, email, password_hash, name, role, created_at) VALUES ('admin_campus_01', 'admin@com', '$2a$10$wwAE4LUpdNRAeHXxfqRSw.pZeGq80XmWtf9wxXrBBZ6D.3SKAJbYy', 'Campus Administrator', 'admin', '2026-09-25T13:50:41.576Z') ON CONFLICT (id) DO NOTHING;

-- Seed Users
INSERT INTO public.users (id, email, password_hash, name, role, status, created_at) VALUES ('usr_000', 'm@com', '$2a$10$YRdzK2fBQvyOWMT7hMTa8.pRGf0WjBpJDyX1mUxRjz7nZIqPI4DgK', 'Student User', 'user', 'active', '2026-09-25T13:50:41.774Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.users (id, email, password_hash, name, role, status, created_at) VALUES ('usr_001', 'm@1', '$2a$10$YRdzK2fBQvyOWMT7hMTa8.pRGf0WjBpJDyX1mUxRjz7nZIqPI4DgK', 'Student User (Quick)', 'user', 'active', '2026-09-25T13:50:41.774Z') ON CONFLICT (id) DO NOTHING;

-- Seed Form Configs
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_name', 'folder_1st_year', 'Student Details', 'name', 'Name of the Student', 'text', 1, '[]', 1, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_roll_number', 'folder_1st_year', 'Student Details', 'roll_number', 'Regd. No.', 'text', 1, '[]', 2, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_branch', 'folder_1st_year', 'Student Details', 'branch', 'Branch / Department', 'text', 1, '[]', 3, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_section', 'folder_1st_year', 'Student Details', 'section', 'Section', 'text', 0, '[]', 4, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_college', 'folder_1st_year', 'Student Details', 'college', 'College / Institute', 'text', 1, '[]', 5, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_admission_type', 'folder_1st_year', 'Student Details', 'admission_type', 'Type of Admission', 'select', 0, '["Convener (EAMCET / ECET)","Management Quota","NRI Quota","Lateral Entry","Spot Admission"]', 6, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_dob', 'folder_1st_year', 'Student Details', 'dob', 'Date of Birth (dd/mm/yyyy)', 'text', 0, '[]', 7, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_blood_group', 'folder_1st_year', 'Student Details', 'blood_group', 'Blood Group', 'select', 0, '["A+","A-","B+","B-","O+","O-","AB+","AB-"]', 8, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_aadhaar_no', 'folder_1st_year', 'Student Details', 'aadhaar_no', 'Aadhaar No.', 'text', 0, '[]', 9, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_father_name', 'folder_1st_year', 'Student Details', 'father_name', 'Father''s Name', 'text', 0, '[]', 10, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_father_occupation', 'folder_1st_year', 'Student Details', 'father_occupation', 'Father''s Occupation', 'text', 0, '[]', 11, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_mother_name', 'folder_1st_year', 'Student Details', 'mother_name', 'Mother''s Name', 'text', 0, '[]', 12, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_mother_occupation', 'folder_1st_year', 'Student Details', 'mother_occupation', 'Mother''s Occupation', 'text', 0, '[]', 13, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_reservation_category', 'folder_1st_year', 'Student Details', 'reservation_category', 'Reservation Category', 'select', 0, '["OC / General","EWS","BC-A","BC-B","BC-C","BC-D","BC-E","SC","ST","Minority"]', 14, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_mode_of_transport', 'folder_1st_year', 'Student Details', 'mode_of_transport', 'Mode of Transport', 'select', 0, '["College Bus","Self Transport (Two Wheeler)","Self Transport (Car)","Public Bus / Train","Bicycle","Walk"]', 15, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_accommodation_type', 'folder_1st_year', 'Student Details', 'accommodation_type', 'Type of Accommodation', 'select', 0, '["Day Scholar (Living with Parents)","College Hostel","Private Hostel / PG","Living with Guardian / Relatives"]', 16, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_permanent_address', 'folder_1st_year', 'Address Details', 'permanent_address', 'Permanent Address', 'textarea', 0, '[]', 17, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_present_address', 'folder_1st_year', 'Address Details', 'present_address', 'Present Address', 'textarea', 0, '[]', 18, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_permanent_pincode', 'folder_1st_year', 'Address Details', 'permanent_pincode', 'Permanent PIN Code', 'text', 0, '[]', 19, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_present_pincode', 'folder_1st_year', 'Address Details', 'present_pincode', 'Present PIN Code', 'text', 0, '[]', 20, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_permanent_phone', 'folder_1st_year', 'Address Details', 'permanent_phone', 'Permanent Phone No.', 'tel', 0, '[]', 21, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_present_phone', 'folder_1st_year', 'Address Details', 'present_phone', 'Present Phone No.', 'tel', 0, '[]', 22, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_email', 'folder_1st_year', 'Contact', 'email', 'E-mail ID', 'email', 1, '[]', 23, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_ssc_marks', 'folder_1st_year', 'Previous Academic Record', 'ssc_marks', 'SSC Marks', 'text', 0, '[]', 24, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_ssc_hall_ticket_no', 'folder_1st_year', 'Previous Academic Record', 'ssc_hall_ticket_no', 'SSC Hall Ticket No.', 'text', 0, '[]', 25, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_intermediate_marks', 'folder_1st_year', 'Previous Academic Record', 'intermediate_marks', 'Intermediate Marks', 'text', 0, '[]', 26, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_intermediate_hall_ticket_no', 'folder_1st_year', 'Previous Academic Record', 'intermediate_hall_ticket_no', 'Intermediate Hall Ticket Number', 'text', 0, '[]', 27, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_achievements', 'folder_1st_year', 'Other Information', 'achievements', 'Any Other Achievements', 'textarea', 0, '[]', 28, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_extracurricular', 'folder_1st_year', 'Other Information', 'extracurricular', 'Extra-curricular Activities', 'textarea', 0, '[]', 29, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_hobbies', 'folder_1st_year', 'Other Information', 'hobbies', 'Hobbies', 'text', 0, '[]', 30, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_sports', 'folder_1st_year', 'Other Information', 'sports', 'Sports Interested', 'text', 0, '[]', 31, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_1st-year_skills', 'folder_1st_year', 'Other Information', 'skills', 'Technical Skills (comma separated)', 'text', 0, '[]', 32, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_name', 'folder_2nd_year', 'Student Details', 'name', 'Name of the Student', 'text', 1, '[]', 1, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_roll_number', 'folder_2nd_year', 'Student Details', 'roll_number', 'Regd. No.', 'text', 1, '[]', 2, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_branch', 'folder_2nd_year', 'Student Details', 'branch', 'Branch / Department', 'text', 1, '[]', 3, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_section', 'folder_2nd_year', 'Student Details', 'section', 'Section', 'text', 0, '[]', 4, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_college', 'folder_2nd_year', 'Student Details', 'college', 'College / Institute', 'text', 1, '[]', 5, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_admission_type', 'folder_2nd_year', 'Student Details', 'admission_type', 'Type of Admission', 'select', 0, '["Convener (EAMCET / ECET)","Management Quota","NRI Quota","Lateral Entry","Spot Admission"]', 6, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_dob', 'folder_2nd_year', 'Student Details', 'dob', 'Date of Birth (dd/mm/yyyy)', 'text', 0, '[]', 7, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_blood_group', 'folder_2nd_year', 'Student Details', 'blood_group', 'Blood Group', 'select', 0, '["A+","A-","B+","B-","O+","O-","AB+","AB-"]', 8, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_aadhaar_no', 'folder_2nd_year', 'Student Details', 'aadhaar_no', 'Aadhaar No.', 'text', 0, '[]', 9, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_father_name', 'folder_2nd_year', 'Student Details', 'father_name', 'Father''s Name', 'text', 0, '[]', 10, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_father_occupation', 'folder_2nd_year', 'Student Details', 'father_occupation', 'Father''s Occupation', 'text', 0, '[]', 11, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_mother_name', 'folder_2nd_year', 'Student Details', 'mother_name', 'Mother''s Name', 'text', 0, '[]', 12, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_mother_occupation', 'folder_2nd_year', 'Student Details', 'mother_occupation', 'Mother''s Occupation', 'text', 0, '[]', 13, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_reservation_category', 'folder_2nd_year', 'Student Details', 'reservation_category', 'Reservation Category', 'select', 0, '["OC / General","EWS","BC-A","BC-B","BC-C","BC-D","BC-E","SC","ST","Minority"]', 14, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_mode_of_transport', 'folder_2nd_year', 'Student Details', 'mode_of_transport', 'Mode of Transport', 'select', 0, '["College Bus","Self Transport (Two Wheeler)","Self Transport (Car)","Public Bus / Train","Bicycle","Walk"]', 15, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_accommodation_type', 'folder_2nd_year', 'Student Details', 'accommodation_type', 'Type of Accommodation', 'select', 0, '["Day Scholar (Living with Parents)","College Hostel","Private Hostel / PG","Living with Guardian / Relatives"]', 16, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_permanent_address', 'folder_2nd_year', 'Address Details', 'permanent_address', 'Permanent Address', 'textarea', 0, '[]', 17, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_present_address', 'folder_2nd_year', 'Address Details', 'present_address', 'Present Address', 'textarea', 0, '[]', 18, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_permanent_pincode', 'folder_2nd_year', 'Address Details', 'permanent_pincode', 'Permanent PIN Code', 'text', 0, '[]', 19, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_present_pincode', 'folder_2nd_year', 'Address Details', 'present_pincode', 'Present PIN Code', 'text', 0, '[]', 20, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_permanent_phone', 'folder_2nd_year', 'Address Details', 'permanent_phone', 'Permanent Phone No.', 'tel', 0, '[]', 21, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_present_phone', 'folder_2nd_year', 'Address Details', 'present_phone', 'Present Phone No.', 'tel', 0, '[]', 22, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_email', 'folder_2nd_year', 'Contact', 'email', 'E-mail ID', 'email', 1, '[]', 23, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_ssc_marks', 'folder_2nd_year', 'Previous Academic Record', 'ssc_marks', 'SSC Marks', 'text', 0, '[]', 24, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_ssc_hall_ticket_no', 'folder_2nd_year', 'Previous Academic Record', 'ssc_hall_ticket_no', 'SSC Hall Ticket No.', 'text', 0, '[]', 25, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_intermediate_marks', 'folder_2nd_year', 'Previous Academic Record', 'intermediate_marks', 'Intermediate Marks', 'text', 0, '[]', 26, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_intermediate_hall_ticket_no', 'folder_2nd_year', 'Previous Academic Record', 'intermediate_hall_ticket_no', 'Intermediate Hall Ticket Number', 'text', 0, '[]', 27, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_achievements', 'folder_2nd_year', 'Other Information', 'achievements', 'Any Other Achievements', 'textarea', 0, '[]', 28, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_extracurricular', 'folder_2nd_year', 'Other Information', 'extracurricular', 'Extra-curricular Activities', 'textarea', 0, '[]', 29, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_hobbies', 'folder_2nd_year', 'Other Information', 'hobbies', 'Hobbies', 'text', 0, '[]', 30, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_sports', 'folder_2nd_year', 'Other Information', 'sports', 'Sports Interested', 'text', 0, '[]', 31, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_2nd-year_skills', 'folder_2nd_year', 'Other Information', 'skills', 'Technical Skills (comma separated)', 'text', 0, '[]', 32, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_name', 'folder_3rd_year', 'Student Details', 'name', 'Name of the Student', 'text', 1, '[]', 1, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_roll_number', 'folder_3rd_year', 'Student Details', 'roll_number', 'Regd. No.', 'text', 1, '[]', 2, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_branch', 'folder_3rd_year', 'Student Details', 'branch', 'Branch / Department', 'text', 1, '[]', 3, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_section', 'folder_3rd_year', 'Student Details', 'section', 'Section', 'text', 0, '[]', 4, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_college', 'folder_3rd_year', 'Student Details', 'college', 'College / Institute', 'text', 1, '[]', 5, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_admission_type', 'folder_3rd_year', 'Student Details', 'admission_type', 'Type of Admission', 'select', 0, '["Convener (EAMCET / ECET)","Management Quota","NRI Quota","Lateral Entry","Spot Admission"]', 6, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_dob', 'folder_3rd_year', 'Student Details', 'dob', 'Date of Birth (dd/mm/yyyy)', 'text', 0, '[]', 7, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_blood_group', 'folder_3rd_year', 'Student Details', 'blood_group', 'Blood Group', 'select', 0, '["A+","A-","B+","B-","O+","O-","AB+","AB-"]', 8, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_aadhaar_no', 'folder_3rd_year', 'Student Details', 'aadhaar_no', 'Aadhaar No.', 'text', 0, '[]', 9, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_father_name', 'folder_3rd_year', 'Student Details', 'father_name', 'Father''s Name', 'text', 0, '[]', 10, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_father_occupation', 'folder_3rd_year', 'Student Details', 'father_occupation', 'Father''s Occupation', 'text', 0, '[]', 11, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_mother_name', 'folder_3rd_year', 'Student Details', 'mother_name', 'Mother''s Name', 'text', 0, '[]', 12, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_mother_occupation', 'folder_3rd_year', 'Student Details', 'mother_occupation', 'Mother''s Occupation', 'text', 0, '[]', 13, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_reservation_category', 'folder_3rd_year', 'Student Details', 'reservation_category', 'Reservation Category', 'select', 0, '["OC / General","EWS","BC-A","BC-B","BC-C","BC-D","BC-E","SC","ST","Minority"]', 14, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_mode_of_transport', 'folder_3rd_year', 'Student Details', 'mode_of_transport', 'Mode of Transport', 'select', 0, '["College Bus","Self Transport (Two Wheeler)","Self Transport (Car)","Public Bus / Train","Bicycle","Walk"]', 15, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_accommodation_type', 'folder_3rd_year', 'Student Details', 'accommodation_type', 'Type of Accommodation', 'select', 0, '["Day Scholar (Living with Parents)","College Hostel","Private Hostel / PG","Living with Guardian / Relatives"]', 16, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_permanent_address', 'folder_3rd_year', 'Address Details', 'permanent_address', 'Permanent Address', 'textarea', 0, '[]', 17, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_present_address', 'folder_3rd_year', 'Address Details', 'present_address', 'Present Address', 'textarea', 0, '[]', 18, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_permanent_pincode', 'folder_3rd_year', 'Address Details', 'permanent_pincode', 'Permanent PIN Code', 'text', 0, '[]', 19, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_present_pincode', 'folder_3rd_year', 'Address Details', 'present_pincode', 'Present PIN Code', 'text', 0, '[]', 20, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_permanent_phone', 'folder_3rd_year', 'Address Details', 'permanent_phone', 'Permanent Phone No.', 'tel', 0, '[]', 21, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_present_phone', 'folder_3rd_year', 'Address Details', 'present_phone', 'Present Phone No.', 'tel', 0, '[]', 22, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_email', 'folder_3rd_year', 'Contact', 'email', 'E-mail ID', 'email', 1, '[]', 23, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_ssc_marks', 'folder_3rd_year', 'Previous Academic Record', 'ssc_marks', 'SSC Marks', 'text', 0, '[]', 24, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_ssc_hall_ticket_no', 'folder_3rd_year', 'Previous Academic Record', 'ssc_hall_ticket_no', 'SSC Hall Ticket No.', 'text', 0, '[]', 25, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_intermediate_marks', 'folder_3rd_year', 'Previous Academic Record', 'intermediate_marks', 'Intermediate Marks', 'text', 0, '[]', 26, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_intermediate_hall_ticket_no', 'folder_3rd_year', 'Previous Academic Record', 'intermediate_hall_ticket_no', 'Intermediate Hall Ticket Number', 'text', 0, '[]', 27, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_achievements', 'folder_3rd_year', 'Other Information', 'achievements', 'Any Other Achievements', 'textarea', 0, '[]', 28, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_extracurricular', 'folder_3rd_year', 'Other Information', 'extracurricular', 'Extra-curricular Activities', 'textarea', 0, '[]', 29, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_hobbies', 'folder_3rd_year', 'Other Information', 'hobbies', 'Hobbies', 'text', 0, '[]', 30, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_sports', 'folder_3rd_year', 'Other Information', 'sports', 'Sports Interested', 'text', 0, '[]', 31, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_3rd-year_skills', 'folder_3rd_year', 'Other Information', 'skills', 'Technical Skills (comma separated)', 'text', 0, '[]', 32, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_name', 'folder_4th_year', 'Student Details', 'name', 'Name of the Student', 'text', 1, '[]', 1, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_roll_number', 'folder_4th_year', 'Student Details', 'roll_number', 'Regd. No.', 'text', 1, '[]', 2, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_branch', 'folder_4th_year', 'Student Details', 'branch', 'Branch / Department', 'text', 1, '[]', 3, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_section', 'folder_4th_year', 'Student Details', 'section', 'Section', 'text', 0, '[]', 4, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_college', 'folder_4th_year', 'Student Details', 'college', 'College / Institute', 'text', 1, '[]', 5, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_admission_type', 'folder_4th_year', 'Student Details', 'admission_type', 'Type of Admission', 'select', 0, '["Convener (EAMCET / ECET)","Management Quota","NRI Quota","Lateral Entry","Spot Admission"]', 6, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_dob', 'folder_4th_year', 'Student Details', 'dob', 'Date of Birth (dd/mm/yyyy)', 'text', 0, '[]', 7, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_blood_group', 'folder_4th_year', 'Student Details', 'blood_group', 'Blood Group', 'select', 0, '["A+","A-","B+","B-","O+","O-","AB+","AB-"]', 8, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_aadhaar_no', 'folder_4th_year', 'Student Details', 'aadhaar_no', 'Aadhaar No.', 'text', 0, '[]', 9, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_father_name', 'folder_4th_year', 'Student Details', 'father_name', 'Father''s Name', 'text', 0, '[]', 10, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_father_occupation', 'folder_4th_year', 'Student Details', 'father_occupation', 'Father''s Occupation', 'text', 0, '[]', 11, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_mother_name', 'folder_4th_year', 'Student Details', 'mother_name', 'Mother''s Name', 'text', 0, '[]', 12, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_mother_occupation', 'folder_4th_year', 'Student Details', 'mother_occupation', 'Mother''s Occupation', 'text', 0, '[]', 13, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_reservation_category', 'folder_4th_year', 'Student Details', 'reservation_category', 'Reservation Category', 'select', 0, '["OC / General","EWS","BC-A","BC-B","BC-C","BC-D","BC-E","SC","ST","Minority"]', 14, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_mode_of_transport', 'folder_4th_year', 'Student Details', 'mode_of_transport', 'Mode of Transport', 'select', 0, '["College Bus","Self Transport (Two Wheeler)","Self Transport (Car)","Public Bus / Train","Bicycle","Walk"]', 15, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_accommodation_type', 'folder_4th_year', 'Student Details', 'accommodation_type', 'Type of Accommodation', 'select', 0, '["Day Scholar (Living with Parents)","College Hostel","Private Hostel / PG","Living with Guardian / Relatives"]', 16, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_permanent_address', 'folder_4th_year', 'Address Details', 'permanent_address', 'Permanent Address', 'textarea', 0, '[]', 17, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_present_address', 'folder_4th_year', 'Address Details', 'present_address', 'Present Address', 'textarea', 0, '[]', 18, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_permanent_pincode', 'folder_4th_year', 'Address Details', 'permanent_pincode', 'Permanent PIN Code', 'text', 0, '[]', 19, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_present_pincode', 'folder_4th_year', 'Address Details', 'present_pincode', 'Present PIN Code', 'text', 0, '[]', 20, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_permanent_phone', 'folder_4th_year', 'Address Details', 'permanent_phone', 'Permanent Phone No.', 'tel', 0, '[]', 21, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_present_phone', 'folder_4th_year', 'Address Details', 'present_phone', 'Present Phone No.', 'tel', 0, '[]', 22, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_email', 'folder_4th_year', 'Contact', 'email', 'E-mail ID', 'email', 1, '[]', 23, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_ssc_marks', 'folder_4th_year', 'Previous Academic Record', 'ssc_marks', 'SSC Marks', 'text', 0, '[]', 24, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_ssc_hall_ticket_no', 'folder_4th_year', 'Previous Academic Record', 'ssc_hall_ticket_no', 'SSC Hall Ticket No.', 'text', 0, '[]', 25, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_intermediate_marks', 'folder_4th_year', 'Previous Academic Record', 'intermediate_marks', 'Intermediate Marks', 'text', 0, '[]', 26, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_intermediate_hall_ticket_no', 'folder_4th_year', 'Previous Academic Record', 'intermediate_hall_ticket_no', 'Intermediate Hall Ticket Number', 'text', 0, '[]', 27, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_achievements', 'folder_4th_year', 'Other Information', 'achievements', 'Any Other Achievements', 'textarea', 0, '[]', 28, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_extracurricular', 'folder_4th_year', 'Other Information', 'extracurricular', 'Extra-curricular Activities', 'textarea', 0, '[]', 29, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_hobbies', 'folder_4th_year', 'Other Information', 'hobbies', 'Hobbies', 'text', 0, '[]', 30, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_sports', 'folder_4th_year', 'Other Information', 'sports', 'Sports Interested', 'text', 0, '[]', 31, NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.form_configs (id, folder_id, section_name, field_name, field_label, field_type, is_required, options_json, display_order, created_at) VALUES ('fc_4th-year_skills', 'folder_4th_year', 'Other Information', 'skills', 'Technical Skills (comma separated)', 'text', 0, '[]', 32, NOW()) ON CONFLICT (id) DO NOTHING;

-- Seed Student Records
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_1st_01', 'folder_1st_year', '1st_year', 'Aditya Varma', '26HT1A4301', '/uploads/aditya_varma.jpg', '', 'Computer Science & Engineering (AI & ML)', 'A', 'City University Campus, Hyderabad',
  'Convener (EAMCET / ECET)', '12/06/2007', 'O+', '918273645011', 'Satish Varma', 'Civil Engineer', 'Kavitha Varma',
  'Lecturer', 'OC / General', 'College Bus', 'Day Scholar (Living with Parents)', 'Flat 302, Green Meadows, Gachibowli, Hyderabad',
  'Flat 302, Green Meadows, Gachibowli, Hyderabad', '500032', '500032', '+91 98480 12341', '+91 98480 12341', '+91 98480 12341',
  '26ht1a4301@cityapp.edu', '582 / 600 (97%)', '22SSC10401', '978 / 1000', 'TS20261102',
  '', '', '', '', 'State Level Math Olympiad Gold Medalist',
  'Coding Club Member, Debating Society', 'Chess, Robotics, Solving Puzzles', 'Badminton', 'Python, C Programming, Web Fundamentals, Data Structures', '', 'First year AI & ML undergraduate passionate about algorithmic problem solving and mathematical modeling.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_1st_02', 'folder_1st_year', '1st_year', 'Sneha Patel', '26HT1A4302', NULL, '', 'Computer Science & Engineering (Data Science)', 'A', 'City University Campus, Hyderabad',
  'Convener (EAMCET / ECET)', '24/09/2007', 'A+', '829304152637', 'Rajesh Patel', 'Chartered Accountant', 'Sunita Patel',
  'Bank Manager', 'OC / General', 'Self Transport (Two Wheeler)', 'Day Scholar (Living with Parents)', 'H.No 4-12/1, Madhapur, Hyderabad',
  'H.No 4-12/1, Madhapur, Hyderabad', '500081', '500081', '+91 98480 12342', '+91 98480 12342', '+91 98480 12342',
  '26ht1a4302@cityapp.edu', '588 / 600 (98%)', '22SSC10402', '982 / 1000', 'TS20261108',
  '', '', '', '', 'District Science Fair 1st Prize Winner',
  'Design Team Volunteer', 'Reading, UI/UX Design, Photography', 'Table Tennis', 'Python, SQL Basics, HTML/CSS, Statistical Analysis', '', 'Enthusiastic Data Science student focusing on statistical analysis and dashboard designs.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_1st_03', 'folder_1st_year', '1st_year', 'Sai Karthik', '26HT1A4303', NULL, '', 'Information Technology', 'B', 'City University Campus, Hyderabad',
  'Management Quota', '05/03/2007', 'B+', '738495061728', 'Venkatesh Rao', 'Businessman', 'Padmaja Rao',
  'Homemaker', 'BC-B', 'College Bus', 'College Hostel', 'Flat 101, Sai Residency, Warangal',
  'City University Boys Hostel, Room 204, Hyderabad', '506001', '500075', '+91 98480 12343', '+91 98480 12343', '+91 98480 12343',
  '26ht1a4303@cityapp.edu', '560 / 600 (93.3%)', '22SSC10403', '945 / 1000', 'TS20261115',
  '', '', '', '', 'State Level Cricket Tournament Runner-up',
  'Sports Committee Coordinator', 'Gaming, Cricket, Blogging', 'Cricket, Football', 'Java, HTML/CSS, Git, Problem Solving', '', 'Passionate IT student with interests in web development and sports activities.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_2nd_01', 'folder_2nd_year', '2nd_year', 'Pooja Reddy', '25HT1A4301', NULL, '', 'Computer Science & Engineering', 'A', 'City University Campus, Hyderabad',
  'Convener (EAMCET / ECET)', '18/11/2006', 'O+', '647589012345', 'Mallikarjun Reddy', 'Software Consultant', 'Anuradha Reddy',
  'School Principal', 'OC / General', 'College Bus', 'Day Scholar (Living with Parents)', 'Plot 55, Road No 12, Banjara Hills, Hyderabad',
  'Plot 55, Road No 12, Banjara Hills, Hyderabad', '500034', '500034', '+91 98480 23451', '+91 98480 23451', '+91 98480 23451',
  '25ht1a4301@cityapp.edu', '590 / 600 (98.3%)', '21SSC20501', '986 / 1000', 'TS20252201',
  '', '', '', '', 'Hackathon 2025 Top 5 Finalist, Academic Merit Scholar',
  'ACM Student Chapter Core Member, Technical Paper Presenter', 'Technical Writing, Classical Dance, Podcasting', 'Badminton', 'Java, Spring Boot, React, MySQL, Data Structures & Algorithms', '', 'Second year CSE student dedicated to backend architectures, distributed computing, and competitive coding.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_2nd_02', 'folder_2nd_year', '2nd_year', 'Rahul Sharma', '25HT1A4302', NULL, '', 'Electronics & Communication Engineering', 'A', 'City University Campus, Hyderabad',
  'Convener (EAMCET / ECET)', '02/08/2006', 'AB+', '536475890123', 'Dinesh Sharma', 'Senior Advocate', 'Meena Sharma',
  'Professor', 'OC / General', 'Self Transport (Car)', 'Day Scholar (Living with Parents)', 'Villa 18, Palm Meadows, Kompally, Hyderabad',
  'Villa 18, Palm Meadows, Kompally, Hyderabad', '500100', '500100', '+91 98480 23452', '+91 98480 23452', '+91 98480 23452',
  '25ht1a4302@cityapp.edu', '575 / 600 (95.8%)', '21SSC20502', '965 / 1000', 'TS20252207',
  '', '', '', '', 'National Robotics Challenge 2nd Place',
  'Robotics Club Lead, IEEE Student Member', 'Drones, Embedded Hardware, Guitar', 'Basketball', 'Embedded C, Verilog, IoT Sensors, Arduino, PCB Design, Python', '', 'Passionate hardware-software co-design enthusiast with hands-on robotics prototyping background.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_2nd_03', 'folder_2nd_year', '2nd_year', 'Divya Sri', '25HT1A4303', NULL, '', 'Computer Science & Engineering (AI & ML)', 'B', 'City University Campus, Hyderabad',
  'Lateral Entry', '14/01/2005', 'B+', '425364758901', 'Chandrasekhar Rao', 'Government Officer', 'Sujatha Rao',
  'Teacher', 'BC-D', 'Public Bus / Train', 'Private Hostel / PG', 'D.No 7-3-21, Trunk Road, Khammam',
  'Sri Sai PG for Women, Kukatpally, Hyderabad', '507001', '500072', '+91 98480 23453', '+91 98480 23453', '+91 98480 23453',
  '25ht1a4303@cityapp.edu', '570 / 600 (95%)', '21SSC20503', '955 / 1000', 'TS20252214',
  '', '', '', '', 'Smart India Hackathon College Level Winner',
  'Women in Tech Student Ambassador', 'Competitive Coding, Blogging, Digital Painting', 'Volleyball', 'Python, PyTorch, Scikit-learn, OpenCV, Full-stack Web Dev', '', 'AI & Machine Learning student focusing on Computer Vision and neural network optimization.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_3rd_01', 'folder_3rd_year', '3rd_year', 'Kiran Kumar', '24HT1A4301', NULL, '', 'Computer Science & Engineering', 'A', 'City University Campus, Hyderabad',
  'Convener (EAMCET / ECET)', '09/05/2005', 'A+', '314253647589', 'Narayana Murthy', 'Mechanical Engineer', 'Bhavani Devi',
  'Homemaker', 'OC / General', 'College Bus', 'Day Scholar (Living with Parents)', 'H.No 12-5-44, Vijaynagar Colony, Hyderabad',
  'H.No 12-5-44, Vijaynagar Colony, Hyderabad', '500057', '500057', '+91 98480 34561', '+91 98480 34561', '+91 98480 34561',
  '24ht1a4301@cityapp.edu', '578 / 600 (96.3%)', '20SSC30601', '972 / 1000', 'TS20243301',
  '', '', '', '', 'Published Cloud Computing Research Paper in IEEE Conference',
  'Open Source Maintainer, Cloud Native Club President', 'System Architecture, Hiking, Open Source', 'Swimming', 'Golang, Kubernetes, Docker, TypeScript, Next.js, Distributed Databases', '', 'Third year systems specialist with strong backend engineering and DevOps credentials.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_3rd_02', 'folder_3rd_year', '3rd_year', 'Ananya Sen', '24HT1A4302', NULL, '', 'Computer Science & Engineering (Cybersecurity)', 'A', 'City University Campus, Hyderabad',
  'Convener (EAMCET / ECET)', '30/10/2005', 'O-', '203142536475', 'Debashis Sen', 'Senior Scientist (DRDO)', 'Sharmila Sen',
  'Senior Research Analyst', 'OC / General', 'College Bus', 'Day Scholar (Living with Parents)', 'Quarter D-14, DRDO Township, Kanchanbagh, Hyderabad',
  'Quarter D-14, DRDO Township, Kanchanbagh, Hyderabad', '500058', '500058', '+91 98480 34562', '+91 98480 34562', '+91 98480 34562',
  '24ht1a4302@cityapp.edu', '592 / 600 (98.6%)', '20SSC30602', '988 / 1000', 'TS20243309',
  '', '', '', '', 'Capture The Flag (CTF) National Top 10, CEH Certified',
  'Cyber Security Club Lead, Student Council Member', 'Vulnerability Research, Violin, Cryptic Puzzles', 'Archery, Badminton', 'Network Security, Ethical Hacking, Wireshark, Cryptography, Linux Kernel, C++', '', 'Cybersecurity specialist focusing on zero-trust architectures and penetration testing.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_3rd_03', 'folder_3rd_year', '3rd_year', 'Varun Teja', '24HT1A4303', NULL, '', 'Artificial Intelligence & Data Science', 'B', 'City University Campus, Hyderabad',
  'Management Quota', '17/07/2005', 'B+', '192031425364', 'Anji Reddy', 'Real Estate Developer', 'Radhika Reddy',
  'Homemaker', 'OC / General', 'Self Transport (Car)', 'Day Scholar (Living with Parents)', 'Plot 88, Financial District, Nanakramguda, Hyderabad',
  'Plot 88, Financial District, Nanakramguda, Hyderabad', '500032', '500032', '+91 98480 34563', '+91 98480 34563', '+91 98480 34563',
  '24ht1a4303@cityapp.edu', '565 / 600 (94.1%)', '20SSC30603', '950 / 1000', 'TS20243316',
  '', '', '', '', 'Built and open-sourced an AI RAG Assistant with 500+ GitHub Stars',
  'AI Innovation Hub Founder, Hackathon Mentor', 'Prompt Engineering, Podcasting, Driving', 'Tennis', 'Deep Learning, LLM Fine-Tuning, LangChain, FastAPI, Redis, Vector Databases', '', 'Applied AI engineer specializing in Retrieval-Augmented Generation, vector embeddings, and agentic workflows.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_4th_01', 'folder_4th_year', '4th_year', 'Suresh Raina G', '23HT1A4301', NULL, '', 'Computer Science & Engineering', 'A', 'City University Campus, Hyderabad',
  'Convener (EAMCET / ECET)', '11/02/2004', 'O+', '081920314253', 'Gopal Krishna', 'Senior General Manager (BHEL)', 'Lalitha Kumari',
  'Lecturer', 'OC / General', 'College Bus', 'Day Scholar (Living with Parents)', 'Flat 404, BHEL Enclave, Miyapur, Hyderabad',
  'Flat 404, BHEL Enclave, Miyapur, Hyderabad', '500049', '500049', '+91 98480 45671', '+91 98480 45671', '+91 98480 45671',
  '23ht1a4301@cityapp.edu', '585 / 600 (97.5%)', '19SSC40701', '980 / 1000', 'TS20234401',
  '', '', '', '', 'Placed at Tier-1 MNC (Google Summer of Code Alumni)',
  'Placement Cell Student Coordinator, Tech Fest Lead Organizer', 'System Programming, Chess, Distance Cycling', 'Cricket, Chess', 'Distributed Systems, C++, Rust, High Performance Computing, AWS Certified Solutions Architect', '', 'Senior graduating CSE engineer with extensive internship and distributed systems experience.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_4th_02', 'folder_4th_year', '4th_year', 'Meghana Rao', '23HT1A4302', NULL, '', 'Information Technology', 'A', 'City University Campus, Hyderabad',
  'Convener (EAMCET / ECET)', '28/04/2004', 'A-', '970819203142', 'Prasad Rao', 'Senior Executive (TCS)', 'Geetha Rao',
  'Senior Architect', 'OC / General', 'College Bus', 'Day Scholar (Living with Parents)', 'Plot 102, HUDA Colony, Chandanagar, Hyderabad',
  'Plot 102, HUDA Colony, Chandanagar, Hyderabad', '500050', '500050', '+91 98480 45672', '+91 98480 45672', '+91 98480 45672',
  '23ht1a4302@cityapp.edu', '594 / 600 (99%)', '19SSC40702', '990 / 1000', 'TS20234408',
  '', '', '', '', 'University Gold Medalist in Academics (CGPA: 9.85)',
  'Editor-in-Chief College Magazine, IEEE Student Chair', 'UI Design, Creative Writing, Mentoring Juniors', 'Badminton', 'React, Node.js, GraphQL, PostgreSQL, Microservices, UI Design Systems, Cypress', '', 'Senior IT student and University Gold Medalist specializing in modern web architecture.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.student_records (
  id, folder_id, year, name, roll_number, profile_image, gender, branch, section, college,
  admission_type, dob, blood_group, aadhaar_no, father_name, father_occupation, mother_name,
  mother_occupation, reservation_category, mode_of_transport, accommodation_type, permanent_address,
  present_address, permanent_pincode, present_pincode, permanent_phone, present_phone, phone,
  email, ssc_marks, ssc_hall_ticket_no, intermediate_marks, intermediate_hall_ticket_no,
  previous_course, previous_max_marks, previous_marks_obtained, previous_sno, achievements,
  extracurricular, hobbies, sports, skills, address, profile_info, custom_fields_json,
  created_at, updated_at
) VALUES (
  'stu_4th_03', 'folder_4th_year', '4th_year', 'Naveen Kumar', '23HT1A4303', NULL, '', 'Computer Science & Engineering (Data Science)', 'B', 'City University Campus, Hyderabad',
  'Convener (EAMCET / ECET)', '03/12/2003', 'B+', '869708192031', 'Ramachandra Murthy', 'Agriculture Officer', 'Satyavathi',
  'Homemaker', 'BC-D', 'College Bus', 'College Hostel', 'H.No 3-88, Main Road, Nizamabad',
  'City University Senior Boys Hostel, Room 410, Hyderabad', '503001', '500075', '+91 98480 45673', '+91 98480 45673', '+91 98480 45673',
  '23ht1a4303@cityapp.edu', '576 / 600 (96%)', '19SSC40703', '960 / 1000', 'TS20234414',
  '', '', '', '', 'Data Science Intern at Microsoft, Published 2 Research Papers',
  'Data Science Society Core Member', 'Data Visualization, Chess, Marathon Running', 'Table Tennis, Athletics', 'Big Data, Spark, Hadoop, SQL, Python, Machine Learning Pipelines, Tableau', '', 'Graduating Data Science specialist with practical experience in large-scale distributed data processing.', '{}',
  '2026-09-23T10:00:00.000Z', '2026-09-23T10:00:00.000Z'
) ON CONFLICT (id) DO NOTHING;
