import fs from 'fs';
import path from 'path';
import type { 
  Admin, 
  User, 
  YearFolder, 
  FormConfig, 
  StudentRecord, 
  ChatSession, 
  ChatMessage, 
  SearchLog, 
  AuditLogEntry, 
  NotificationItem, 
  SystemSetting, 
  FormDiagnostic 
} from './schema';
import { fetchMasterDbFromSupabase, persistMasterDbToSupabase } from './supabase-db';

export interface DatabaseData {
  admins: Admin[];
  users: User[];
  year_folders: YearFolder[];
  form_configs: FormConfig[];
  student_records: StudentRecord[];
  chat_sessions: ChatSession[];
  chat_messages: ChatMessage[];
  search_logs: SearchLog[];
  audit_logs: AuditLogEntry[];
  notifications: NotificationItem[];
  system_settings: SystemSetting[];
  form_diagnostics: FormDiagnostic[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let memoryDb: DatabaseData | null = null;
let lastDbMtime = 0;
let isSupabaseHydrated = false;
let isHydrating = false;

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // Non-fatal if filesystem is strictly read-only
  }
}

export function getEmptyDatabase(): DatabaseData {
  return {
    admins: [],
    users: [],
    year_folders: [],
    form_configs: [],
    student_records: [],
    chat_sessions: [],
    chat_messages: [],
    search_logs: [],
    audit_logs: [],
    notifications: [],
    system_settings: [],
    form_diagnostics: []
  };
}

export function resetMemoryDb(): void {
  memoryDb = null;
  lastDbMtime = 0;
  isSupabaseHydrated = false;
}

/**
 * Synchronize memory state from Supabase Cloud DB.
 */
export async function syncDatabaseWithSupabase(): Promise<DatabaseData> {
  if (isHydrating) {
    return memoryDb || getEmptyDatabase();
  }
  isHydrating = true;
  try {
    const cloudDb = await fetchMasterDbFromSupabase();
    if (cloudDb && Array.isArray(cloudDb.year_folders) && cloudDb.year_folders.length > 0) {
      memoryDb = cloudDb;
      isSupabaseHydrated = true;
      // Also cache to local disk if possible
      try {
        ensureDataDirectory();
        fs.writeFileSync(DB_FILE, JSON.stringify(cloudDb, null, 2), 'utf-8');
      } catch (err) {
        // Ignored in ephemeral/read-only environments
      }
      return memoryDb;
    }
  } catch (err) {
    console.error('[Supabase DB] Error syncing from Supabase Cloud:', err);
  } finally {
    isHydrating = false;
  }
  return memoryDb || loadDatabase();
}

/**
 * Load database with Supabase Cloud DB priority.
 */
export function loadDatabase(forceDisk = false): DatabaseData {
  // If memory DB is active, return immediately for sub-millisecond response
  if (memoryDb && !forceDisk) {
    return memoryDb;
  }

  ensureDataDirectory();

  // Try loading from local disk cache first if available
  if (fs.existsSync(DB_FILE)) {
    try {
      const stat = fs.statSync(DB_FILE);
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      if (content && content.trim().length > 0) {
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.year_folders)) {
          if (!Array.isArray(parsed.audit_logs)) parsed.audit_logs = [];
          if (!Array.isArray(parsed.notifications)) parsed.notifications = [];
          if (!Array.isArray(parsed.form_diagnostics)) parsed.form_diagnostics = [];
          if (!Array.isArray(parsed.student_records)) parsed.student_records = [];
          memoryDb = parsed;
          lastDbMtime = stat.mtimeMs;
        }
      }
    } catch (err) {
      console.warn('[DB] Warning: could not parse local db.json, will check Supabase Cloud.');
    }
  }

  // If Supabase not yet hydrated in this process lifetime, trigger async sync
  if (!isSupabaseHydrated && !isHydrating) {
    syncDatabaseWithSupabase().catch(err => {
      console.warn('[Supabase DB] Initial sync notice:', err?.message || err);
    });
  }

  if (memoryDb) return memoryDb;

  memoryDb = getEmptyDatabase();
  return memoryDb;
}

/**
 * Save database permanently to Supabase Cloud DB and local cache.
 */
export function saveDatabase(data: DatabaseData): void {
  memoryDb = data;
  ensureDataDirectory();

  // 1. Write local disk cache
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(DB_FILE, jsonString, 'utf-8');
  } catch (err) {
    console.warn('[DB] Local disk write warning (ephemeral container):', err);
  }

  // 2. Persist directly to Supabase Cloud Database asynchronously
  persistMasterDbToSupabase(data).catch(err => {
    console.error('[Supabase DB] Fatal: Failed to persist to Supabase Cloud:', err);
  });
}

/**
 * Async save version that awaits Supabase persistence confirmation.
 */
export async function saveDatabaseAsync(data: DatabaseData): Promise<boolean> {
  memoryDb = data;
  ensureDataDirectory();
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(DB_FILE, jsonString, 'utf-8');
  } catch (err) {
    // Non-fatal
  }
  return await persistMasterDbToSupabase(data);
}
