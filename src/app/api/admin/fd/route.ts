import { NextResponse } from 'next/server';
import { getAllFormDiagnostics, deleteFormDiagnostic, upsertFormDiagnostic } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const folder = searchParams.get('folder') || '';
    const status = searchParams.get('status') || '';
    const device = searchParams.get('device') || '';
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const result = getAllFormDiagnostics({
      search,
      folder,
      status,
      device,
      limit,
      offset
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Error fetching form diagnostics:', error);
    return NextResponse.json({ error: 'Failed to fetch form diagnostics telemetry' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      sessionId, 
      folderSlug, 
      formData, 
      status,
      firstFieldTime, 
      firstFieldName, 
      lastFieldTime, 
      lastFieldName, 
      timeline, 
      telemetry 
    } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Extract client IP and network information
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    let ip = forwarded ? forwarded.split(',')[0].trim() : (realIp || '127.0.0.1');
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      ip = telemetry?.client_ip || ip;
    }

    const userAgent = req.headers.get('user-agent') || telemetry?.user_agent || 'Unknown Browser';
    
    // Determine OS & Browser from user agent if not provided
    let os = telemetry?.os || 'Windows 11';
    let browser = telemetry?.browser || 'Chrome';
    let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = telemetry?.device_type || 'Desktop';

    if (userAgent.includes('iPhone')) {
      deviceType = 'Mobile';
      os = 'iOS';
      browser = 'Mobile Safari';
    } else if (userAgent.includes('Android')) {
      deviceType = 'Mobile';
      os = 'Android';
      browser = 'Chrome Mobile';
    } else if (userAgent.includes('Macintosh')) {
      deviceType = 'Desktop';
      os = 'macOS';
      browser = userAgent.includes('Chrome') ? 'Chrome' : 'Safari';
    } else if (userAgent.includes('Windows')) {
      deviceType = 'Desktop';
      os = 'Windows';
      browser = userAgent.includes('Edg') ? 'Edge' : 'Chrome';
    }

    const now = new Date().toISOString();
    const firstTime = firstFieldTime || now;
    const lastTime = lastFieldTime || now;
    const durationSeconds = Math.max(0, Math.round((new Date(lastTime).getTime() - new Date(firstTime).getTime()) / 1000));

    const studentName = formData?.name ? `${formData.name} (Live Stream)` : 'Anonymous Visitor (In Progress)';
    const rollNumber = formData?.roll_number || 'Pending Draft';
    const email = formData?.email || '';
    const branch = formData?.branch || 'CSE';

    const saved = upsertFormDiagnostic({
      id: sessionId,
      folder_slug: folderSlug || '1st-year',
      student_name: studentName,
      roll_number: rollNumber,
      email: email,
      branch: branch,
      status: status || 'draft',
      ip_address: ip,
      city: telemetry?.city || 'Hyderabad',
      region: telemetry?.region || 'Telangana',
      country: telemetry?.country || 'India',
      country_code: telemetry?.country_code || 'IN',
      latitude: telemetry?.latitude || 17.3850,
      longitude: telemetry?.longitude || 78.4867,
      isp: telemetry?.isp || 'ACT Fibernet / Campus Wi-Fi',
      timezone: telemetry?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      user_agent: userAgent,
      browser: browser,
      browser_version: telemetry?.browser_version || '128.0',
      os: os,
      os_version: telemetry?.os_version || '11',
      device_type: deviceType,
      device_model: telemetry?.device_model || (deviceType === 'Desktop' ? 'Personal Computer' : 'Mobile Phone'),
      screen_resolution: telemetry?.screen_resolution || '1920x1080',
      color_depth: telemetry?.color_depth || '24-bit',
      hardware_concurrency: telemetry?.hardware_concurrency || 8,
      device_memory: telemetry?.device_memory || '8 GB',
      touch_support: telemetry?.touch_support ?? false,
      language: telemetry?.language || 'en-US',
      first_field_name: firstFieldName || 'name',
      first_field_time: firstTime,
      last_field_name: lastFieldName || 'branch',
      last_field_time: lastTime,
      total_duration_seconds: durationSeconds,
      field_change_count: Array.isArray(timeline) ? timeline.length : 1,
      form_snapshot_json: JSON.stringify(formData || {}),
      timeline_json: JSON.stringify(timeline || []),
    });

    return NextResponse.json({
      success: true,
      sessionId: saved.id,
      lastSaved: saved.updated_at
    });
  } catch (error: any) {
    console.error('Error saving form diagnostic telemetry:', error);
    return NextResponse.json({ error: 'Failed to record telemetry stream' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Diagnostic ID is required' }, { status: 400 });
    }

    const deleted = deleteFormDiagnostic(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Diagnostic entry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Telemetry entry removed successfully'
    });
  } catch (error: any) {
    console.error('Error deleting form diagnostic:', error);
    return NextResponse.json({ error: 'Failed to delete telemetry entry' }, { status: 500 });
  }
}
