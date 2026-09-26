import { NextResponse } from 'next/server';
import { getSetting, setSetting, logAuditEvent } from '@/lib/db';

export async function GET() {
  try {
    const settings = {
      college_name: getSetting('college_name', 'City Engineering College'),
      chatbot_title: getSetting('chatbot_title', 'Campus AI'),
      college_logo: getSetting('college_logo', '/logo.png'),
      theme_color: getSetting('theme_color', '#0a0a0a'),
      tagline: getSetting('tagline', 'Verified RAG Engine'),
      assistant_badge: getSetting('assistant_badge', 'Student Assistant'),
      footer_text: getSetting('footer_text', '© 2026 City Engineering College. All rights reserved.'),
      welcome_message: getSetting('welcome_message', 'Hello! Welcome to City Engineering College. You can ask me about semester timetables, fee dues, exam dates, or departmental contacts.'),
      fuzzy_match_threshold: getSetting('fuzzy_match_threshold', '0.72'),
      max_disambiguation_options: getSetting('max_disambiguation_options', '5'),
      rate_limit_chat_per_min: getSetting('rate_limit_chat_per_min', '30'),
      rate_limit_intake_per_hour: getSetting('rate_limit_intake_per_hour', '10'),
    };
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string' || typeof value === 'number') {
        setSetting(key, String(value));
      }
    }
    logAuditEvent("Admin", "UPDATE_SYSTEM_SETTINGS", "system_settings", "global", "Updated system branding and RAG thresholds");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
