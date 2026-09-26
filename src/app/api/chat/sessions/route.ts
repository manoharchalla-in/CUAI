import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserChatSessions, createChatSession, clearUserChatSessions } from '@/lib/db';

export async function GET(req: Request) {
  const user = await getCurrentUser('user');
  const userId = user ? user.id : 'user_guest_default';

  const sessions = getUserChatSessions(userId);
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const user = await getCurrentUser('user');
  const userId = user ? user.id : 'user_guest_default';

  try {
    const body = await req.json().catch(() => ({}));
    const title = body.title || 'New Chat';
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const session = createChatSession(sessionId, userId, title);
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 });
  }
}

export async function DELETE() {
  const user = await getCurrentUser('user');
  const userId = user ? user.id : 'user_guest_default';

  clearUserChatSessions(userId);
  return NextResponse.json({ success: true, message: 'All chat sessions cleared' });
}
