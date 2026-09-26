import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Permanent Supabase Project Production Credentials
export const DEFAULT_SUPABASE_URL = 'https://oqehuczoyeffyiofcomk.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZWh1Y3pveWVmZnlpb2Zjb21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMTMyNjUsImV4cCI6MjEwNTc4OTI2NX0.CaTSuQzWxrDnd3TPrYOQTD1CAQ2PC-Azzk4Ps6bJZcQ';
export const DEFAULT_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZWh1Y3pveWVmZnlpb2Zjb21rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDIxMzI2NSwiZXhwIjoyMTA1Nzg5MjY1fQ.h3en7klJzwx7_8HtFdvELunVSmmwufQmkJduigX9Hfs';
export const DEFAULT_BUCKET_NAME = 'student-assets';

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
}

export function getSupabaseServiceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_SERVICE_ROLE_KEY;
}

export function getBucketName(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET_NAME;
}

export const BUCKET_NAME = getBucketName();

let cachedClient: SupabaseClient | null = null;
let cachedAdmin: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: { persistSession: false }
    });
  }
  return cachedClient;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) return null;
  if (!cachedAdmin) {
    cachedAdmin = createClient(url, key, {
      auth: { persistSession: false }
    });
  }
  return cachedAdmin;
}

export async function ensureBucketExists(): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (!admin) return false;
  try {
    const bucket = getBucketName();
    const { data: buckets, error } = await admin.storage.listBuckets();
    if (error) {
      console.warn('Supabase listBuckets warning:', error.message);
    }
    const exists = buckets?.some(b => b.name === bucket);
    if (!exists) {
      const { error: createErr } = await admin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760, // 10 MB
      });
      if (createErr && !createErr.message?.includes('already exists')) {
        console.warn('Supabase createBucket error:', createErr.message);
      }
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase ensureBucketExists catch:', e?.message);
    return false;
  }
}

/**
 * Upload a binary buffer to Supabase Storage and return its permanent public CDN URL.
 */
export async function uploadToSupabaseStorage(
  fileBuffer: Buffer | ArrayBuffer,
  fileName: string,
  contentType: string,
  folder = 'student-photos'
): Promise<{ success: boolean; url: string; error?: string }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      success: false,
      url: '',
      error: 'Supabase is not configured. Please verify credentials.'
    };
  }

  try {
    await ensureBucketExists();
    const bucket = getBucketName();

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

    // Upload file buffer to Supabase bucket
    const { data, error } = await admin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return { success: false, url: '', error: error.message };
    }

    // Generate permanent public CDN URL
    const { data: publicUrlData } = admin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrlData.publicUrl
    };
  } catch (err: any) {
    console.error('Supabase storage upload exception:', err);
    return {
      success: false,
      url: '',
      error: err.message || 'Failed to upload to Supabase storage'
    };
  }
}

/**
 * Upload a base64 image (e.g. data:image/png;base64,...) to Supabase Storage
 * and return the permanent Supabase public URL.
 */
export async function uploadBase64ToSupabase(
  base64Data: string,
  fileNamePrefix: string,
  folder = 'student-photos'
): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    if (!base64Data || typeof base64Data !== 'string') {
      return { success: false, url: '', error: 'Empty base64 data' };
    }

    // If it's already a full HTTP/HTTPS URL (already stored in Supabase), keep it
    if (base64Data.startsWith('http://') || base64Data.startsWith('https://')) {
      return { success: true, url: base64Data };
    }

    let mimeType = 'image/jpeg';
    let base64Payload = base64Data;

    if (base64Data.includes(';base64,')) {
      const parts = base64Data.split(';base64,');
      mimeType = parts[0].replace(/^data:/, '') || 'image/jpeg';
      base64Payload = parts[1];
    } else if (base64Data.startsWith('data:')) {
      const commaIdx = base64Data.indexOf(',');
      if (commaIdx > -1) {
        base64Payload = base64Data.substring(commaIdx + 1);
      }
    }

    const buffer = Buffer.from(base64Payload, 'base64');
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';

    const safePrefix = (fileNamePrefix || 'photo').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safePrefix}_${Date.now()}.${ext}`;

    return await uploadToSupabaseStorage(buffer, fileName, mimeType, folder);
  } catch (err: any) {
    console.error('Base64 upload to Supabase failed:', err);
    return { success: false, url: '', error: err.message || 'Base64 upload failed' };
  }
}
