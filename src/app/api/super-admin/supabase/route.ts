import { NextResponse } from 'next/server';
import { 
  getSupabaseAdmin, 
  getSupabaseUrl, 
  getSupabaseAnonKey, 
  getSupabaseServiceKey, 
  BUCKET_NAME,
  ensureBucketExists,
  uploadToSupabaseStorage
} from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const STORAGE_LIMIT_BYTES = 1024 * 1024 * 1024; // 1 GB Free Tier Limit

export async function GET() {
  try {
    const user = await getCurrentUser('superadmin');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden: Super Administrator privileges required' }, { status: 403 });
    }

    const startTime = Date.now();
    const admin = getSupabaseAdmin();
    const projectUrl = getSupabaseUrl();
    const anonKey = getSupabaseAnonKey();
    const serviceKey = getSupabaseServiceKey();

    let isConnected = false;
    let latencyMs = 0;
    let buckets: any[] = [];
    let filesList: any[] = [];
    let totalBytesUsed = 0;
    let totalFilesCount = 0;
    let errorMessage = '';

    if (admin && projectUrl) {
      try {
        await ensureBucketExists();
        const { data: bucketData, error: bucketErr } = await admin.storage.listBuckets();
        latencyMs = Date.now() - startTime;

        if (bucketErr) {
          errorMessage = bucketErr.message;
        } else {
          isConnected = true;
          buckets = (bucketData || []).map(b => ({
            id: b.id,
            name: b.name,
            public: b.public ?? true,
            created_at: b.created_at,
            file_size_limit: b.file_size_limit || 10485760,
            allowed_mime_types: b.allowed_mime_types || []
          }));

          // Fetch files from primary buckets (up to 3 buckets)
          for (const bucket of buckets.slice(0, 3)) {
            try {
              // Root files
              const { data: rootObjects } = await admin.storage.from(bucket.name).list('', {
                limit: 50,
                sortBy: { column: 'created_at', order: 'desc' }
              });

              if (rootObjects) {
                for (const obj of rootObjects) {
                  if (obj.id) {
                    const size = obj.metadata?.size || 0;
                    totalBytesUsed += size;
                    totalFilesCount += 1;
                    
                    const { data: publicUrlData } = admin.storage.from(bucket.name).getPublicUrl(obj.name);

                    filesList.push({
                      id: obj.id || obj.name,
                      bucket: bucket.name,
                      name: obj.name,
                      path: obj.name,
                      size: size,
                      formattedSize: formatBytes(size),
                      contentType: obj.metadata?.mimetype || getMimeType(obj.name),
                      created_at: obj.created_at || obj.updated_at || new Date().toISOString(),
                      publicUrl: publicUrlData.publicUrl
                    });
                  } else {
                    // It's a subfolder - list files inside
                    const folderName = obj.name;
                    const { data: folderObjects } = await admin.storage.from(bucket.name).list(folderName, {
                      limit: 50
                    });

                    if (folderObjects) {
                      for (const subObj of folderObjects) {
                        const size = subObj.metadata?.size || 0;
                        totalBytesUsed += size;
                        totalFilesCount += 1;

                        const fullPath = `${folderName}/${subObj.name}`;
                        const { data: subUrlData } = admin.storage.from(bucket.name).getPublicUrl(fullPath);

                        filesList.push({
                          id: subObj.id || fullPath,
                          bucket: bucket.name,
                          name: subObj.name,
                          path: fullPath,
                          size: size,
                          formattedSize: formatBytes(size),
                          contentType: subObj.metadata?.mimetype || getMimeType(subObj.name),
                          created_at: subObj.created_at || subObj.updated_at || new Date().toISOString(),
                          publicUrl: subUrlData.publicUrl
                        });
                      }
                    }
                  }
                }
              }
            } catch (listErr) {
              console.warn(`Error listing files in bucket ${bucket.name}:`, listErr);
            }
          }
        }
      } catch (connErr: any) {
        errorMessage = connErr.message || 'Failed to connect to Supabase';
        latencyMs = Date.now() - startTime;
      }
    } else {
      errorMessage = 'Supabase environment variables are missing.';
    }

    // Extract Project ID from URL (e.g., https://oqehuczoyeffyiofcomk.supabase.co -> oqehuczoyeffyiofcomk)
    let projectId = 'Not Connected';
    if (projectUrl) {
      try {
        const u = new URL(projectUrl);
        projectId = u.hostname.split('.')[0] || 'Unknown';
      } catch (e) {
        projectId = projectUrl;
      }
    }

    const usedMb = (totalBytesUsed / (1024 * 1024)).toFixed(2);
    const limitMb = (STORAGE_LIMIT_BYTES / (1024 * 1024)).toFixed(0);
    const freeBytes = Math.max(0, STORAGE_LIMIT_BYTES - totalBytesUsed);
    const freeMb = (freeBytes / (1024 * 1024)).toFixed(2);
    const usedPercent = Math.min(100, Math.max(0.01, (totalBytesUsed / STORAGE_LIMIT_BYTES) * 100)).toFixed(2);

    // Categories breakdown
    const imageFiles = filesList.filter(f => f.contentType.startsWith('image/'));
    const docFiles = filesList.filter(f => f.contentType.includes('pdf') || f.contentType.includes('word') || f.contentType.includes('doc'));
    const textFiles = filesList.filter(f => f.contentType.includes('text') || f.contentType.includes('json'));
    const otherFiles = filesList.filter(f => !imageFiles.includes(f) && !docFiles.includes(f) && !textFiles.includes(f));

    return NextResponse.json({
      success: true,
      status: isConnected ? 'Online & Healthy' : 'Disconnected / Error',
      isConnected,
      latencyMs,
      projectId,
      projectUrl,
      bucketName: BUCKET_NAME,
      errorMessage,
      storage: {
        totalBytesUsed,
        usedMb: `${usedMb} MB`,
        totalLimitBytes: STORAGE_LIMIT_BYTES,
        limitMb: `${limitMb} MB (1 GB Free Tier)`,
        freeBytes,
        freeMb: `${freeMb} MB`,
        usedPercent: Number(usedPercent),
        totalFilesCount,
      },
      categories: [
        {
          name: 'Student Photos & Avatars',
          count: imageFiles.length,
          bytes: imageFiles.reduce((acc, f) => acc + f.size, 0),
          formattedSize: formatBytes(imageFiles.reduce((acc, f) => acc + f.size, 0)),
          color: '#0a66ff'
        },
        {
          name: 'Documents & Certificates',
          count: docFiles.length,
          bytes: docFiles.reduce((acc, f) => acc + f.size, 0),
          formattedSize: formatBytes(docFiles.reduce((acc, f) => acc + f.size, 0)),
          color: '#10b981'
        },
        {
          name: 'System Logs & Data',
          count: textFiles.length,
          bytes: textFiles.reduce((acc, f) => acc + f.size, 0),
          formattedSize: formatBytes(textFiles.reduce((acc, f) => acc + f.size, 0)),
          color: '#f59e0b'
        },
        {
          name: 'Other Assets',
          count: otherFiles.length,
          bytes: otherFiles.reduce((acc, f) => acc + f.size, 0),
          formattedSize: formatBytes(otherFiles.reduce((acc, f) => acc + f.size, 0)),
          color: '#6366f1'
        }
      ],
      buckets,
      files: filesList,
      apiKeys: {
        projectUrl,
        anonKey,
        serviceKey,
        bucketName: BUCKET_NAME
      }
    });
  } catch (error: any) {
    console.error('Supabase status error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const admin = getSupabaseAdmin();

    if (action === 'delete_file') {
      const { bucket, path: filePath } = body;
      if (!admin || !bucket || !filePath) {
        return NextResponse.json({ error: 'Bucket and file path are required' }, { status: 400 });
      }

      const { error } = await admin.storage.from(bucket).remove([filePath]);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: 'File deleted successfully' });
    }

    if (action === 'create_bucket') {
      const { name, isPublic } = body;
      if (!admin || !name) {
        return NextResponse.json({ error: 'Bucket name is required' }, { status: 400 });
      }

      const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const { data, error } = await admin.storage.createBucket(cleanName, {
        public: isPublic ?? true,
        fileSizeLimit: 10485760 // 10MB
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, bucket: data, message: `Bucket "${cleanName}" created successfully` });
    }

    if (action === 'update_keys') {
      const { projectUrl, anonKey, serviceKey, bucketName } = body;
      if (!projectUrl || !anonKey) {
        return NextResponse.json({ error: 'Project URL and Anon Key are required' }, { status: 400 });
      }

      // Update .env.local file
      const envPath = path.resolve(process.cwd(), '.env.local');
      let currentEnv = '';
      if (fs.existsSync(envPath)) {
        currentEnv = fs.readFileSync(envPath, 'utf8');
      }

      const lines = currentEnv.split('\n');
      const newLines: string[] = [];
      const updatedKeys = new Set<string>();

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
          newLines.push(`NEXT_PUBLIC_SUPABASE_URL=${projectUrl.trim()}`);
          updatedKeys.add('NEXT_PUBLIC_SUPABASE_URL');
        } else if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
          newLines.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey.trim()}`);
          updatedKeys.add('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        } else if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
          newLines.push(`SUPABASE_SERVICE_ROLE_KEY=${(serviceKey || anonKey).trim()}`);
          updatedKeys.add('SUPABASE_SERVICE_ROLE_KEY');
        } else if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=')) {
          newLines.push(`NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=${(bucketName || 'student-assets').trim()}`);
          updatedKeys.add('NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET');
        } else {
          newLines.push(line);
        }
      }

      if (!updatedKeys.has('NEXT_PUBLIC_SUPABASE_URL')) {
        newLines.push(`NEXT_PUBLIC_SUPABASE_URL=${projectUrl.trim()}`);
      }
      if (!updatedKeys.has('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
        newLines.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey.trim()}`);
      }
      if (!updatedKeys.has('SUPABASE_SERVICE_ROLE_KEY')) {
        newLines.push(`SUPABASE_SERVICE_ROLE_KEY=${(serviceKey || anonKey).trim()}`);
      }
      if (!updatedKeys.has('NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET')) {
        newLines.push(`NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=${(bucketName || 'student-assets').trim()}`);
      }

      fs.writeFileSync(envPath, newLines.join('\n'), 'utf8');

      // Also sync .env file
      const envRootPath = path.resolve(process.cwd(), '.env');
      fs.writeFileSync(envRootPath, newLines.join('\n'), 'utf8');

      // Update process.env immediately
      process.env.NEXT_PUBLIC_SUPABASE_URL = projectUrl.trim();
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey.trim();
      process.env.SUPABASE_SERVICE_ROLE_KEY = (serviceKey || anonKey).trim();
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET = (bucketName || 'student-assets').trim();

      return NextResponse.json({ success: true, message: 'Supabase credentials saved successfully to environment.' });
    }

    if (action === 'sync_database') {
      const { syncDatabaseWithSupabase } = await import('@/lib/db');
      const synced = await syncDatabaseWithSupabase();
      return NextResponse.json({ 
        success: true, 
        message: `Database synchronized with Supabase Cloud (${synced.student_records?.length || 0} students loaded)`,
        studentsCount: synced.student_records?.length || 0
      });
    }

    if (action === 'create_backup') {
      const { loadDatabase, persistMasterDbToSupabase } = await import('@/lib/db');
      const currentDb = loadDatabase();
      const success = await persistMasterDbToSupabase(currentDb);
      return NextResponse.json({ 
        success, 
        message: success ? 'Cloud database backup successfully created in Supabase.' : 'Failed to create cloud backup.'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Supabase POST error:', err);
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 500 });
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    case 'svg': return 'image/svg+xml';
    case 'gif': return 'image/gif';
    case 'pdf': return 'application/pdf';
    case 'doc':
    case 'docx': return 'application/msword';
    case 'txt': return 'text/plain';
    case 'json': return 'application/json';
    default: return 'application/octet-stream';
  }
}
