import { NextResponse } from 'next/server';
import { loadDatabase } from '@/lib/db';
import { getSupabaseAdmin } from '@/lib/supabase';

const START_TIME = Date.now();

export async function GET(req: Request) {
  const startTime = performance.now();
  const checks: Record<string, { status: 'healthy' | 'degraded' | 'unhealthy'; latencyMs: number; details?: any }> = {};

  // 1. Local / Cache Database Check
  const dbStart = performance.now();
  let dbStatus: 'healthy' | 'unhealthy' = 'healthy';
  let dbError: string | undefined;
  try {
    const db = loadDatabase();
    if (!db || !Array.isArray(db.student_records)) {
      dbStatus = 'unhealthy';
      dbError = 'Database structure invalid';
    }
  } catch (err: any) {
    dbStatus = 'unhealthy';
    dbError = err?.message || 'Database access failed';
  }
  checks.database = {
    status: dbStatus,
    latencyMs: Math.round(performance.now() - dbStart),
    ...(dbError ? { details: dbError } : {}),
  };

  // 2. Supabase Cloud Storage & PostgreSQL Connectivity Check
  const supabaseStart = performance.now();
  let supabaseStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  let supabaseDetails: any = null;

  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      supabaseStatus = 'degraded';
      supabaseDetails = 'Supabase admin client not initialized';
    } else {
      const { data: buckets, error } = await admin.storage.listBuckets();
      if (error) {
        supabaseStatus = 'degraded';
        supabaseDetails = error.message;
      } else {
        supabaseDetails = { bucketsCount: buckets?.length || 0 };
      }
    }
  } catch (err: any) {
    supabaseStatus = 'degraded';
    supabaseDetails = err?.message || 'Supabase ping failed';
  }

  checks.supabase = {
    status: supabaseStatus,
    latencyMs: Math.round(performance.now() - supabaseStart),
    details: supabaseDetails,
  };

  // 3. Memory & System Diagnostics
  const memoryUsage = process.memoryUsage();
  const memoryInfo = {
    rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
    heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
  };

  // Determine overall health status
  const isHealthy = Object.values(checks).every(c => c.status === 'healthy');
  const isDegraded = Object.values(checks).some(c => c.status === 'degraded');
  const overallStatus = isHealthy ? 'healthy' : isDegraded ? 'degraded' : 'unhealthy';
  const totalDuration = Math.round(performance.now() - startTime);

  const payload = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
    checks,
    memory: memoryInfo,
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'development',
    responseTimeMs: totalDuration,
  };

  return NextResponse.json(payload, {
    status: overallStatus === 'unhealthy' ? 503 : 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Status': overallStatus,
    },
  });
}
