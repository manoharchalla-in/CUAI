import { NextResponse } from 'next/server';
import { 
  getAllStudents, 
  getStudentsByFolder, 
  getFolderById,
  findStudentByRollNumber, 
  insertStudentRecord 
} from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { uploadBase64ToSupabase } from '@/lib/supabase';
import { enforceRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { recordAuditLog } from '@/lib/audit';
import { globalCache } from '@/lib/cache';

export async function GET(req: Request) {
  const rateLimitResponse = enforceRateLimit(req, 'admin_students_get', RATE_LIMIT_PRESETS.ADMIN_GENERAL);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const admin = await getCurrentUser('admin');
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: Campus Administrator privileges required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');
    const year = searchParams.get('year') || 'all';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const offset = (page - 1) * limit;

    if (folderId && folderId !== 'all') {
      const { records, total } = getStudentsByFolder(folderId, search, limit, offset);
      return NextResponse.json({ records, total, page, limit });
    }

    const { records, total } = getAllStudents(search, year, limit, offset);
    return NextResponse.json({ records, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch student records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const rateLimitResponse = enforceRateLimit(req, 'admin_students_post', RATE_LIMIT_PRESETS.ADMIN_GENERAL);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const admin = await getCurrentUser('admin');
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: Campus Administrator privileges required' }, { status: 403 });
    }

    const data = await req.json();

    if (!data.name || !data.roll_number || !data.branch || !data.email || !data.year) {
      return NextResponse.json({ error: 'Name, Roll Number, Branch, Year, and Email are required.' }, { status: 400 });
    }
    if (!data.profile_image || !data.profile_image.trim()) {
      return NextResponse.json({ error: 'Student photograph is mandatory. Please upload a student photo.' }, { status: 400 });
    }
    const college = data.college || 'Campus Institute of Technology';

    const existing = findStudentByRollNumber(data.roll_number.trim());
    if (existing) {
      return NextResponse.json({ error: `A student with roll number ${data.roll_number} already exists.` }, { status: 409 });
    }

    let folderId = data.folder_id;
    if (!folderId) {
      const folderMap: Record<string, string> = {
        '1st_year': 'folder_1st_year',
        '2nd_year': 'folder_2nd_year',
        '3rd_year': 'folder_3rd_year',
        '4th_year': 'folder_4th_year',
      };
      folderId = folderMap[data.year] || 'folder_1st_year';
    }

    const studentId = `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Store student photo permanently in Supabase Cloud Storage
    let profileImageUrl = data.profile_image || '';
    if (profileImageUrl && profileImageUrl.startsWith('data:')) {
      try {
        const uploadResult = await uploadBase64ToSupabase(profileImageUrl, data.roll_number || studentId, 'student-photos');
        if (uploadResult.success && uploadResult.url) {
          profileImageUrl = uploadResult.url;
        }
      } catch (uploadErr) {
        console.warn('Student photo Supabase upload non-fatal warning:', uploadErr);
      }
    }

    const newStudent = insertStudentRecord({
      ...data,
      id: studentId,
      folder_id: folderId,
      year: data.year,
      name: data.name,
      roll_number: data.roll_number,
      profile_image: profileImageUrl,
      branch: data.branch,
      section: data.section || '',
      email: data.email,
      phone: data.phone || '',
      college: data.college || college,
      skills: data.skills || '',
      address: data.address || '',
      profile_info: data.profile_info || '',
      custom_fields_json: JSON.stringify(data.custom_fields || {}),
    });

    // Invalidate cached counts and folder caches
    globalCache.invalidate(`folder_${folderId}`);

    // Record audit log
    recordAuditLog({
      req,
      actor: { id: admin.id, username: admin.name, role: admin.role },
      action: 'STUDENT_RECORD_CREATED',
      target: `${data.roll_number} (${data.name})`,
      status: 'success',
      details: {
        student_id: studentId,
        folder_id: folderId,
        year: data.year,
      },
    });

    return NextResponse.json({ success: true, student: newStudent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create student' }, { status: 500 });
  }
}
