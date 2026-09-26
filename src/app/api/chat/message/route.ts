import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { 
  getChatSessionById, 
  createChatSession, 
  insertChatMessage, 
  updateChatSessionTitle,
  isGlobalMaintenanceActive,
  isUserUnderMaintenance,
  getMaintenanceSettings 
} from '@/lib/db';
import { processChatQuery } from '@/lib/rag/engine';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser('user');
    const userId = user ? user.id : 'user_guest_default';
    const isSuperAdmin = user?.role === 'superadmin';

    // 1. Check Global or Per-User Maintenance Mode
    if (!isSuperAdmin) {
      if (isGlobalMaintenanceActive('chatbot') || (user && isUserUnderMaintenance(user.id))) {
        const m = getMaintenanceSettings();
        return NextResponse.json({
          error: `${m.title}: ${m.message} (Estimated restoration: ${m.estimatedEnd || 'Shortly'})`,
          is_maintenance: true
        }, { status: 503 });
      }
    }

    const { sessionId, content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    let activeSessionId = sessionId;

    // If no session provided or session not found, create new
    if (!activeSessionId) {
      activeSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      createChatSession(activeSessionId, userId, content.trim().substring(0, 30));
    } else {
      const existingSession = getChatSessionById(activeSessionId);
      if (!existingSession) {
        createChatSession(activeSessionId, userId, content.trim().substring(0, 30));
      } else if (existingSession.title === 'New Chat') {
        const autoTitle = content.trim().length > 28 ? `${content.trim().substring(0, 25)}...` : content.trim();
        updateChatSessionTitle(activeSessionId, autoTitle);
      }
    }

    // 1. Insert User Message
    const userMsgId = `msg_${Date.now()}_u_${Math.random().toString(36).substring(2, 6)}`;
    const userMessage = insertChatMessage(userMsgId, activeSessionId, 'user', content.trim());

    // 2. Execute RAG Retrieval & Response Processing
    const ragResult = processChatQuery(content.trim(), userId);

    // 3. Insert Assistant Message
    const assistantMsgId = `msg_${Date.now()}_a_${Math.random().toString(36).substring(2, 6)}`;
    const assistantMessage = insertChatMessage(
      assistantMsgId,
      activeSessionId,
      'assistant',
      ragResult.answer,
      JSON.stringify({
        found: ragResult.found,
        queryType: ragResult.queryType,
        isDisambiguation: ragResult.isDisambiguation || false,
        matchedStudents: ragResult.matchedStudents.map(s => ({
          id: s.id,
          name: s.name,
          roll_number: s.roll_number,
          year: s.year,
          branch: s.branch,
          profile_image: s.profile_image || null,
        }))
      })
    );

    return NextResponse.json({
      sessionId: activeSessionId,
      userMessage,
      assistantMessage,
      ragResult
    });
  } catch (error: any) {
    console.error('Chat message API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
