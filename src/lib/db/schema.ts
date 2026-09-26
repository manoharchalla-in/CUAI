export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'superadmin' | 'admin';
  status?: 'active' | 'maintenance' | 'suspended';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'user';
  status: 'active' | 'suspended' | 'maintenance';
  created_at: string;
}

export interface YearFolder {
  id: string;
  name: string;
  slug: string; // '1st-year', '2nd-year', '3rd-year', '4th-year'
  year_label: string; // '1st Year', '2nd Year', '3rd Year', '4th Year'
  description: string;
  is_form_active: number; // 0 or 1
  form_token: string;
  created_at: string;
  student_count?: number;
}

export interface FormConfig {
  id: string;
  folder_id: string;
  section_name?: string; // 'Student Details' | 'Address Details' | 'Contact' | 'Previous Academic Record' | 'Other Information'
  field_name: string;
  field_label: string;
  field_type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'date';
  is_required: number; // 0 or 1
  options_json?: string; // JSON array of options for select
  display_order: number;
}

export interface StudentRecord {
  id: string;
  folder_id: string;
  year: '1st_year' | '2nd_year' | '3rd_year' | '4th_year';
  
  // 1. Student Details
  name: string; // Name of the Student
  roll_number: string; // Regd. No.
  gender?: string; // Gender ('Male' | 'Female' | 'Other')
  profile_image?: string; // Profile photo URL or base64 data
  admission_type?: string; // Type of Admission (Convener, Management, etc.)
  dob?: string; // Date of Birth (dd/mm/yyyy)
  blood_group?: string; // Blood Group (A+, B+, O+, etc.)
  aadhaar_no?: string; // Aadhaar No.
  father_name?: string; // Father's Name
  father_occupation?: string; // Father's Occupation
  mother_name?: string; // Mother's Name
  mother_occupation?: string; // Mother's Occupation
  reservation_category?: string; // Reservation Category (OC, BC, SC, ST, etc.)
  mode_of_transport?: string; // Mode of Transport (College Bus, Self, etc.)
  accommodation_type?: string; // Type of Accommodation (Hosteller, Day Scholar)
  branch: string; // Branch / Department
  section?: string; // Section
  college: string; // College Name

  // 2. Address Details
  permanent_address?: string;
  present_address?: string;
  permanent_pincode?: string;
  present_pincode?: string;
  permanent_phone?: string;
  present_phone?: string;
  phone?: string; // Primary Phone
  address?: string; // General address fallback

  // 3. Contact
  email: string; // E-mail ID

  // 4. Previous Academic Record
  previous_course?: string; // Course of Study (10th, Inter, Diploma)
  ssc_marks?: string; // SSC Marks
  ssc_hall_ticket_no?: string; // SSC Hall Ticket No.
  intermediate_marks?: string; // Intermediate Marks
  intermediate_hall_ticket_no?: string; // Intermediate Hall Ticket Number
  previous_max_marks?: string; // Max. Marks (legacy fallback)
  previous_marks_obtained?: string; // Grade / Marks Obtained (legacy fallback)
  previous_sno?: string; // S.No. / Hall Ticket No. (legacy fallback)

  // 5. Other Information
  achievements?: string; // Any Other Achievements
  extracurricular?: string; // Extra-curricular Activities
  hobbies?: string; // Hobbies
  sports?: string; // Sports Interested
  skills?: string; // Technical Skills
  profile_info?: string; // Profile Bio

  custom_fields_json?: string; // JSON object for extra dynamic form fields
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata_json?: string;
  created_at: string;
}

export interface SearchLog {
  id: string;
  user_id?: string;
  query: string;
  found_count: number;
  matched_student_ids?: string;
  query_type: string;
  latency_ms?: number;
  confidence_score?: number;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  before_state?: string;
  after_state?: string;
  ip_address: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface FormDiagnostic {
  id: string;
  folder_slug: string; // '1st-year', '2nd-year', etc.
  student_id?: string;
  student_name: string;
  roll_number: string;
  email: string;
  branch: string;
  status: 'submitted' | 'draft' | 'abandoned';
  
  // IP & Location details
  ip_address: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  timezone: string;
  
  // Device & Browser details
  user_agent: string;
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  device_type: 'Desktop' | 'Mobile' | 'Tablet';
  device_model?: string;
  screen_resolution: string;
  color_depth?: string;
  hardware_concurrency?: number;
  device_memory?: string;
  touch_support?: boolean;
  language: string;
  
  // Timing metrics
  first_field_name?: string;
  first_field_time: string; // ISO string when user first typed
  last_field_name?: string;
  last_field_time: string;  // ISO string when user last typed
  submit_time?: string;     // ISO string when form was submitted
  total_duration_seconds: number; // calculated duration in seconds
  field_change_count: number;
  
  // Detailed audit / keystroke trail JSON
  form_snapshot_json?: string;
  timeline_json?: string; // array of { field: string, timestamp: string, elapsed_sec?: number }
  
  created_at: string;
  updated_at: string;
}
