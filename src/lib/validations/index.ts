import { z } from 'zod';

// ==========================================
// AUTHENTICATION SCHEMAS
// ==========================================

export const loginSchema = z.object({
  username: z.string().min(1, 'Username or Email is required').max(100).trim(),
  password: z.string().min(1, 'Password is required').max(100),
  role: z.enum(['admin', 'super_admin', 'student', 'user']).optional().default('admin'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ==========================================
// STUDENT SCHEMAS
// ==========================================

export const studentSchema = z.object({
  name: z.string().min(1, 'Student name is required').max(150).trim(),
  roll_number: z.string().min(1, 'Roll number is required').max(50).trim(),
  year: z.enum(['1st_year', '2nd_year', '3rd_year', '4th_year', 'alumni']),
  branch: z.string().min(1, 'Branch / Department is required').max(100).trim(),
  section: z.string().max(20).optional().default(''),
  email: z.string().email('Invalid email address').max(150).trim().toLowerCase(),
  phone: z.string().max(25).optional().default(''),
  college: z.string().max(200).optional().default('Campus Institute of Technology'),
  folder_id: z.string().optional(),
  profile_image: z.string().min(1, 'Student photograph is required'),
  skills: z.string().max(1000).optional().default(''),
  gender: z.string().max(20).optional().default(''),
  dob: z.string().max(30).optional().default(''),
  blood_group: z.string().max(10).optional().default(''),
  father_name: z.string().max(150).optional().default(''),
  mother_name: z.string().max(150).optional().default(''),
  parent_phone: z.string().max(25).optional().default(''),
  address: z.string().max(500).optional().default(''),
  status: z.enum(['active', 'pending', 'verified', 'archived', 'rejected']).optional().default('active'),
  // Marks / Academic details
  tenth_percentage: z.string().max(20).optional().default(''),
  twelfth_percentage: z.string().max(20).optional().default(''),
  sem1_sgpa: z.string().max(20).optional().default(''),
  sem2_sgpa: z.string().max(20).optional().default(''),
  sem3_sgpa: z.string().max(20).optional().default(''),
  sem4_sgpa: z.string().max(20).optional().default(''),
  sem5_sgpa: z.string().max(20).optional().default(''),
  sem6_sgpa: z.string().max(20).optional().default(''),
  sem7_sgpa: z.string().max(20).optional().default(''),
  sem8_sgpa: z.string().max(20).optional().default(''),
  cgpa: z.string().max(20).optional().default(''),
  history_of_arrears: z.string().max(10).optional().default('0'),
  standing_arrears: z.string().max(10).optional().default('0'),
  extra_data: z.record(z.string(), z.any()).optional().default({}),
});

export type StudentInput = z.infer<typeof studentSchema>;

export const bulkStudentImportSchema = z.object({
  folder_id: z.string().min(1, 'Folder ID is required'),
  students: z.array(studentSchema.partial().extend({
    name: z.string().min(1, 'Name is required'),
    roll_number: z.string().min(1, 'Roll number is required'),
  })).min(1, 'At least 1 student is required for bulk import'),
});

// ==========================================
// FOLDER SCHEMAS
// ==========================================

export const folderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(100).trim(),
  year: z.string().min(1, 'Academic year is required').max(50).trim(),
  slug: z.string().min(1, 'Folder slug is required').max(100).trim(),
  description: z.string().max(500).optional().default(''),
  color: z.string().max(50).optional().default('blue'),
  icon: z.string().max(50).optional().default('Folder'),
  college: z.string().max(200).optional().default('Campus Institute of Technology'),
});

// ==========================================
// SYSTEM & MAINTENANCE SCHEMAS
// ==========================================

export const maintenanceConfigSchema = z.object({
  enabled: z.boolean(),
  title: z.string().max(150).optional().default('Scheduled Maintenance'),
  message: z.string().max(1000).optional().default('System is temporarily offline for scheduled upgrades.'),
  estimatedDuration: z.string().max(50).optional().default('30 minutes'),
  scope: z.enum(['all', 'admin', 'student', 'super_admin']).optional().default('all'),
  allowedIps: z.array(z.string()).optional().default([]),
});

export type MaintenanceConfigInput = z.infer<typeof maintenanceConfigSchema>;

// ==========================================
// VALIDATION HELPER
// ==========================================

export function validatePayload<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  firstError?: string;
} {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  const firstError = result.error.issues[0]?.message || 'Validation error';
  return { success: false, errors, firstError };
}
