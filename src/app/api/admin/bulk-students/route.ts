import { NextResponse } from 'next/server';
import { bulkDeleteStudents, bulkUpdateStudentBranch } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { enforceRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { recordAuditLog } from '@/lib/audit';
import { globalCache } from '@/lib/cache';

export async function DELETE(req: Request) {
  const rateLimitResponse = enforceRateLimit(req, 'admin_bulk_delete', RATE_LIMIT_PRESETS.ADMIN_GENERAL);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const admin = await getCurrentUser('admin');
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: Campus Administrator privileges required' }, { status: 403 });
    }

    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No student IDs provided' }, { status: 400 });
    }

    const count = bulkDeleteStudents(ids);
    globalCache.clear();

    recordAuditLog({
      req,
      actor: { id: admin.id, username: admin.name, role: admin.role },
      action: 'STUDENTS_BULK_DELETED',
      target: `${count} students`,
      details: { idsCount: ids.length, deletedCount: count },
    });

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete students' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const rateLimitResponse = enforceRateLimit(req, 'admin_bulk_patch', RATE_LIMIT_PRESETS.ADMIN_GENERAL);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const admin = await getCurrentUser('admin');
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: Campus Administrator privileges required' }, { status: 403 });
    }

    const { ids, branch } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0 || !branch) {
      return NextResponse.json({ error: 'Invalid parameters for branch reassignment' }, { status: 400 });
    }

    const count = bulkUpdateStudentBranch(ids, branch);
    globalCache.clear();

    recordAuditLog({
      req,
      actor: { id: admin.id, username: admin.name, role: admin.role },
      action: 'STUDENTS_BRANCH_REASSIGNED',
      target: `${count} students -> ${branch}`,
      details: { idsCount: ids.length, updatedCount: count, branch },
    });

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update student branch' }, { status: 500 });
  }
}
