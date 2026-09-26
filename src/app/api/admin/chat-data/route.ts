import { NextResponse } from 'next/server';
import { getSearchLogs, getAllChatSessions } from '@/lib/db';

export async function GET() {
  try {
    const logs = getSearchLogs(200);
    const sessions = getAllChatSessions(100);
    return NextResponse.json({ logs, sessions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chat data' }, { status: 500 });
  }
}
