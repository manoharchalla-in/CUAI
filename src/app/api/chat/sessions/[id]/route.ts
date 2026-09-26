import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getChatSessionById, getSessionMessages, updateChatSessionTitle, deleteChatSession } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getChatSessionById(id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const messages = getSessionMessages(id);
  return NextResponse.json({ session, messages });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getChatSessionById(id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  try {
    const { title } = await req.json();
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    updateChatSessionTitle(id, title.trim());
    return NextResponse.json({ success: true, title: title.trim() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update session title' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getChatSessionById(id);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  deleteChatSession(id);
  return NextResponse.json({ success: true, message: 'Session deleted' });
}
