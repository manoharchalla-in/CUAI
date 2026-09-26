import { NextResponse } from 'next/server';
import { getAuditLogs, logAuditEvent } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const action = searchParams.get('action') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = getAuditLogs(limit, offset, search, action);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { actor, action, entity_type, entity_id, details, before_state, after_state, ip_address } = body;
    const entry = logAuditEvent(actor, action, entity_type, entity_id, details, before_state, after_state, ip_address);
    return NextResponse.json({ success: true, entry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record audit log' }, { status: 500 });
  }
}
