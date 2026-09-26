import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateDatabaseSnapshot, uploadSnapshotToSupabase, listDatabaseSnapshots } from '@/lib/backup';
import { recordAuditLog } from '@/lib/audit';
import { apiSuccess, apiError, apiForbidden } from '@/lib/api-response';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser('admin');
    if (!user) {
      return apiForbidden('Administrator privileges required');
    }

    const { searchParams } = new URL(req.url);
    const download = searchParams.get('download');

    if (download === 'true') {
      const snapshot = generateDatabaseSnapshot();
      return new NextResponse(JSON.stringify(snapshot, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="database-backup-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    const backups = await listDatabaseSnapshots();
    const currentStats = generateDatabaseSnapshot().stats;

    return apiSuccess({
      stats: currentStats,
      backups,
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to list backups');
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser('admin');
    if (!user) {
      return apiForbidden('Administrator privileges required');
    }

    const snapshot = generateDatabaseSnapshot();
    const uploadResult = await uploadSnapshotToSupabase(snapshot);

    recordAuditLog({
      req,
      actor: { id: user.id, username: (user as any).username || user.name, role: user.role },
      action: 'SYSTEM_BACKUP_CREATED',
      target: uploadResult.filename || 'database_snapshot',
      details: {
        success: uploadResult.success,
        stats: snapshot.stats,
        filename: uploadResult.filename,
      },
    });

    if (!uploadResult.success) {
      return apiError(uploadResult.error || 'Failed to save snapshot to storage', 'BACKUP_FAILED', 500);
    }

    return apiSuccess({
      message: 'Database backup snapshot created and saved to cloud storage successfully.',
      filename: uploadResult.filename,
      stats: snapshot.stats,
      timestamp: snapshot.timestamp,
    });
  } catch (error: any) {
    return apiError(error.message || 'Backup failed', 'BACKUP_FAILED', 500);
  }
}
