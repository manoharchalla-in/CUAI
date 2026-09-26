import { NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/lib/db/store';
import { initializeDatabase } from '@/lib/db/init';
import { logAuditEvent } from '@/lib/db';

export async function GET() {
  try {
    const db = loadDatabase();
    return NextResponse.json({
      success: true,
      exportedAt: new Date().toISOString(),
      version: "2.0.0",
      data: db
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to export database' }, { status: 500 });
  }
}

export async function POST() {
  try {
    initializeDatabase();
    logAuditEvent("SuperAdmin", "FACTORY_RESET_DATABASE", "database", "data/db.json", "Reseeded database to clean state");
    return NextResponse.json({ success: true, message: "Database reseeded successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to reset database' }, { status: 500 });
  }
}
