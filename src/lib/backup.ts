import { loadDatabase } from './db';
import { getSupabaseAdmin } from './supabase';

export interface DatabaseSnapshot {
  version: string;
  timestamp: string;
  stats: {
    studentCount: number;
    folderCount: number;
    userCount: number;
    adminCount: number;
    formConfigCount: number;
    auditLogCount: number;
  };
  data: ReturnType<typeof loadDatabase>;
}

export const BACKUP_BUCKET = 'system-backups';

/**
 * Generate a complete JSON snapshot of the database state
 */
export function generateDatabaseSnapshot(): DatabaseSnapshot {
  const db = loadDatabase();
  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    stats: {
      studentCount: db.student_records?.length || 0,
      folderCount: db.year_folders?.length || 0,
      userCount: db.users?.length || 0,
      adminCount: db.admins?.length || 0,
      formConfigCount: db.form_configs?.length || 0,
      auditLogCount: db.audit_logs?.length || 0,
    },
    data: db,
  };
}

/**
 * Save snapshot to Supabase Cloud Storage
 */
export async function uploadSnapshotToSupabase(snapshot: DatabaseSnapshot): Promise<{
  success: boolean;
  filename: string;
  url?: string;
  error?: string;
}> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return { success: false, filename: '', error: 'Supabase admin is not configured.' };
  }

  const filename = `db-snapshot-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const jsonContent = JSON.stringify(snapshot, null, 2);
  const buffer = Buffer.from(jsonContent, 'utf-8');

  try {
    // Ensure bucket exists
    const { data: buckets } = await admin.storage.listBuckets();
    const exists = buckets?.some(b => b.name === BACKUP_BUCKET);
    if (!exists) {
      await admin.storage.createBucket(BACKUP_BUCKET, { public: false });
    }

    const { error: uploadError } = await admin.storage
      .from(BACKUP_BUCKET)
      .upload(`snapshots/${filename}`, buffer, {
        contentType: 'application/json',
        upsert: true,
      });

    if (uploadError) {
      return { success: false, filename, error: uploadError.message };
    }

    return {
      success: true,
      filename,
    };
  } catch (err: any) {
    return { success: false, filename, error: err?.message || 'Failed to upload snapshot' };
  }
}

/**
 * List all available backups from Supabase storage
 */
export async function listDatabaseSnapshots(): Promise<Array<{ name: string; createdAt: string; size: number }>> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];

  try {
    const { data, error } = await admin.storage.from(BACKUP_BUCKET).list('snapshots', {
      sortBy: { column: 'created_at', order: 'desc' },
      limit: 20,
    });
    if (error || !data) return [];
    return data.map(item => ({
      name: item.name,
      createdAt: item.created_at || new Date().toISOString(),
      size: item.metadata?.size || 0,
    }));
  } catch {
    return [];
  }
}
