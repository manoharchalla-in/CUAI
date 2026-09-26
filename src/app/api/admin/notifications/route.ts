import { NextResponse } from 'next/server';
import { getNotifications, markNotificationRead, addNotification } from '@/lib/db';

export async function GET() {
  try {
    const data = getNotifications(20);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load notifications' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    const success = markNotificationRead(id || 'all');
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark notification read' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, message, type, link } = await req.json();
    const item = addNotification(title, message, type, link);
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add notification' }, { status: 500 });
  }
}
