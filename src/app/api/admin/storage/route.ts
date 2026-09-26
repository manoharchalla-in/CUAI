import { NextResponse } from 'next/server';
import { getStorageBreakdown, optimizeDatabaseStorage, logAuditEvent } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getStorageBreakdown();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error('Storage breakdown error:', error);
    return NextResponse.json({ error: 'Failed to compute storage telemetry' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json().catch(() => ({ action: 'optimize' }));
    
    if (action === 'optimize') {
      const data = optimizeDatabaseStorage();
      logAuditEvent('Admin', 'DATABASE_OPTIMIZATION', 'storage', 'system', 'Database vacuumed and index defragmented successfully.');
      return NextResponse.json({ success: true, message: 'Database optimized & storage defragmented successfully', ...data });
    }

    return NextResponse.json({ error: 'Invalid storage action' }, { status: 400 });
  } catch (error: any) {
    console.error('Storage action error:', error);
    return NextResponse.json({ error: 'Failed to process storage action' }, { status: 500 });
  }
}
