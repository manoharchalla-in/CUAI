import { NextResponse } from 'next/server';
import { getSetting, setSetting } from '@/lib/db';

export async function GET() {
  const collegeName = getSetting('college_name', '');
  const aiModel = getSetting('ai_model', 'Grounded Database RAG Engine (Zero Hallucination)');
  const ragStrictness = getSetting('rag_strictness', 'strict');
  const allowRegistration = getSetting('allow_registration', 'true');

  return NextResponse.json({
    settings: {
      collegeName,
      aiModel,
      ragStrictness,
      allowRegistration: allowRegistration === 'true',
    }
  });
}

export async function POST(req: Request) {
  try {
    const { collegeName, aiModel, ragStrictness, allowRegistration } = await req.json();

    if (collegeName !== undefined) setSetting('college_name', collegeName);
    if (aiModel !== undefined) setSetting('ai_model', aiModel);
    if (ragStrictness !== undefined) setSetting('rag_strictness', ragStrictness);
    if (allowRegistration !== undefined) setSetting('allow_registration', String(allowRegistration));

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
