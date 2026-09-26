import { NextResponse } from 'next/server';
import { 
  getFolderBySlug, 
  getFormConfigsByFolder, 
  findStudentByRollNumber, 
  insertStudentRecord,
  upsertFormDiagnostic,
  isGlobalMaintenanceActive,
  getMaintenanceSettings 
} from '@/lib/db';
import { uploadBase64ToSupabase } from '@/lib/supabase';
import { enforceRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { recordAuditLog } from '@/lib/audit';
import { globalCache } from '@/lib/cache';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (isGlobalMaintenanceActive('forms')) {
    const m = getMaintenanceSettings();
    return NextResponse.json({ 
      error: `${m.title}: ${m.message}`,
      is_maintenance: true,
      maintenance: m
    }, { status: 503 });
  }

  const { slug } = await params;
  const cacheKey = `form_config_${slug}`;

  const cachedData = globalCache.get(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  const folder = getFolderBySlug(slug);
  if (!folder) {
    return NextResponse.json({ error: 'Form not found for this year' }, { status: 404 });
  }

  const fields = getFormConfigsByFolder(folder.id);

  const responsePayload = {
    folder: {
      id: folder.id,
      name: folder.name,
      slug: folder.slug,
      year_label: folder.year_label,
      description: folder.description,
      is_form_active: folder.is_form_active,
    },
    fields
  };

  // Cache form definition for 60 seconds
  globalCache.set(cacheKey, responsePayload, 60);

  return NextResponse.json(responsePayload);
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  // 1. Apply rate limit on public form submission
  const rateLimitResponse = enforceRateLimit(req, 'form_submit', RATE_LIMIT_PRESETS.FORM_SUBMISSION);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    if (isGlobalMaintenanceActive('forms')) {
      const m = getMaintenanceSettings();
      return NextResponse.json({ 
        error: `${m.title}: ${m.message}`,
        is_maintenance: true,
        maintenance: m
      }, { status: 503 });
    }

    const { slug } = await params;
    const folder = getFolderBySlug(slug);
    if (!folder) {
      return NextResponse.json({ error: 'Form not found for this year' }, { status: 404 });
    }

    if (!folder.is_form_active) {
      return NextResponse.json({ error: 'This registration form is currently closed by the administrator.' }, { status: 403 });
    }

    const data = await req.json();

    // Basic validation
    if (!data.name || !data.name.trim()) {
      return NextResponse.json({ error: 'Name of the Student is required' }, { status: 400 });
    }
    if (!data.roll_number || !data.roll_number.trim()) {
      return NextResponse.json({ error: 'Regd. No. is required' }, { status: 400 });
    }
    if (!data.email || !data.email.trim()) {
      return NextResponse.json({ error: 'Email Address is required' }, { status: 400 });
    }
    if (!data.profile_image || !data.profile_image.trim()) {
      return NextResponse.json({ error: 'Student photograph is mandatory. Please upload a passport-size photo.' }, { status: 400 });
    }

    // Check duplicate roll number
    const existing = findStudentByRollNumber(data.roll_number.trim());
    if (existing) {
      return NextResponse.json({ 
        error: `A student with Regd. No. "${data.roll_number}" is already registered (${existing.name} in ${existing.year.replace('_', ' ')}).` 
      }, { status: 409 });
    }

    // Determine exact year key for this folder
    const yearKey = folder.slug.replace('-', '_') as '1st_year' | '2nd_year' | '3rd_year' | '4th_year';
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

    const newRecord = insertStudentRecord({
      id: studentId,
      folder_id: folder.id,
      year: yearKey,
      name: data.name,
      roll_number: data.roll_number,
      profile_image: profileImageUrl,
      admission_type: data.admission_type || '',
      dob: data.dob || '',
      blood_group: data.blood_group || '',
      aadhaar_no: data.aadhaar_no || '',
      father_name: data.father_name || '',
      father_occupation: data.father_occupation || '',
      mother_name: data.mother_name || '',
      mother_occupation: data.mother_occupation || '',
      reservation_category: data.reservation_category || '',
      mode_of_transport: data.mode_of_transport || '',
      accommodation_type: data.accommodation_type || '',
      branch: data.branch || 'CSE',
      section: data.section || '',
      college: data.college || '',
      permanent_address: data.permanent_address || '',
      present_address: data.present_address || '',
      permanent_pincode: data.permanent_pincode || '',
      present_pincode: data.present_pincode || '',
      permanent_phone: data.permanent_phone || '',
      present_phone: data.present_phone || '',
      phone: data.permanent_phone || data.present_phone || data.phone || '',
      email: data.email,
      ssc_marks: data.ssc_marks || data.previous_marks_obtained || '',
      ssc_hall_ticket_no: data.ssc_hall_ticket_no || data.previous_sno || '',
      intermediate_marks: data.intermediate_marks || data.previous_marks_obtained || '',
      intermediate_hall_ticket_no: data.intermediate_hall_ticket_no || data.previous_sno || '',
      previous_course: data.previous_course || '',
      previous_max_marks: data.previous_max_marks || '',
      previous_marks_obtained: data.previous_marks_obtained || '',
      previous_sno: data.previous_sno || '',
      achievements: data.achievements || '',
      extracurricular: data.extracurricular || '',
      hobbies: data.hobbies || '',
      sports: data.sports || '',
      skills: data.skills || '',
      address: data.present_address || data.permanent_address || data.address || '',
      profile_info: data.profile_info || '',
      custom_fields_json: JSON.stringify(data.custom_fields || {}),
    });

    // Handle Form Diagnostics & Telemetry Recording
    try {
      const now = new Date().toISOString();
      const forwarded = req.headers.get('x-forwarded-for');
      const realIp = req.headers.get('x-real-ip');
      let ip = forwarded ? forwarded.split(',')[0].trim() : (realIp || '127.0.0.1');
      if (ip === '::1' || ip === '127.0.0.1') {
        ip = data._telemetry?.client_ip || ip;
      }
      const userAgent = req.headers.get('user-agent') || data._telemetry?.user_agent || 'Unknown Browser';

      const firstTime = data._first_field_time || now;
      const lastTime = data._last_field_time || now;
      const submitTime = now;
      const durationSeconds = Math.max(1, Math.round((new Date(submitTime).getTime() - new Date(firstTime).getTime()) / 1000));

      const diagnosticId = data._session_id || `fd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      upsertFormDiagnostic({
        id: diagnosticId,
        folder_slug: folder.slug,
        student_id: studentId,
        student_name: data.name,
        roll_number: data.roll_number,
        email: data.email,
        branch: data.branch || 'CSE',
        status: 'submitted',
        ip_address: ip,
        city: data._telemetry?.city || 'Hyderabad',
        region: data._telemetry?.region || 'Telangana',
        country: data._telemetry?.country || 'India',
        country_code: data._telemetry?.country_code || 'IN',
        latitude: data._telemetry?.latitude || 17.3850,
        longitude: data._telemetry?.longitude || 78.4867,
        isp: data._telemetry?.isp || 'ACT Fibernet / Campus Wi-Fi',
        timezone: data._telemetry?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        user_agent: userAgent,
        browser: data._telemetry?.browser || 'Chrome',
        browser_version: data._telemetry?.browser_version || '128.0',
        os: data._telemetry?.os || 'Windows 11',
        os_version: data._telemetry?.os_version || '11',
        device_type: data._telemetry?.device_type || 'Desktop',
        device_model: data._telemetry?.device_model || 'Personal Computer',
        screen_resolution: data._telemetry?.screen_resolution || '1920x1080',
        color_depth: data._telemetry?.color_depth || '24-bit',
        hardware_concurrency: data._telemetry?.hardware_concurrency || 8,
        device_memory: data._telemetry?.device_memory || '8 GB',
        touch_support: data._telemetry?.touch_support ?? false,
        language: data._telemetry?.language || 'en-US',
        first_field_name: data._first_field_name || 'name',
        first_field_time: firstTime,
        last_field_name: data._last_field_name || 'skills',
        last_field_time: lastTime,
        submit_time: submitTime,
        total_duration_seconds: durationSeconds,
        field_change_count: Array.isArray(data._timeline) ? data._timeline.length : 25,
        form_snapshot_json: JSON.stringify(data),
        timeline_json: JSON.stringify(data._timeline || []),
      });

      // Record audit log for public form registration
      recordAuditLog({
        req,
        action: 'STUDENT_FORM_REGISTERED',
        target: `${data.roll_number} (${data.name})`,
        status: 'success',
        details: {
          folder_slug: folder.slug,
          student_id: studentId,
          ip,
        },
      });
    } catch (telemetryErr) {
      console.warn('Telemetry recording notice:', telemetryErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Student record registered successfully',
      student: newRecord
    });
  } catch (error: any) {
    console.error('Form submission error:', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
