import { NextResponse } from 'next/server';
import { getSetting, setSetting, logAuditEvent } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const branding = {
      college_name: getSetting('college_name', 'City Engineering College'),
      chatbot_title: getSetting('chatbot_title', 'Campus AI'),
      college_logo: getSetting('college_logo', '/logo.png'),
      theme_color: getSetting('theme_color', '#0a0a0a'),
      tagline: getSetting('tagline', 'Verified RAG Engine'),
      assistant_badge: getSetting('assistant_badge', 'Student Assistant'),
      footer_text: getSetting('footer_text', '© 2026 City Engineering College. All rights reserved.'),
      welcome_message: getSetting('welcome_message', 'Hello! Welcome to City Engineering College AI Assistant. You can ask me about student records, faculty rosters, syllabus, exam timetables, or campus details.'),
    };
    return NextResponse.json(branding);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch branding' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser('admin');
    if (!user || (user.role !== 'superadmin' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Super Admin required' }, { status: 403 });
    }

    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string' || typeof value === 'number') {
        setSetting(key, String(value));
      }
    }

    logAuditEvent(
      user.name || user.email || 'Admin',
      'UPDATE_BRANDING',
      'system_branding',
      'global',
      `Updated institutional branding and chatbot UI parameters (Title: ${body.chatbot_title || body.college_name})`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update branding' }, { status: 500 });
  }
}
