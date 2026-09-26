import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentUser('admin');
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: Campus Administrator privileges required' }, { status: 403 });
    }

    const stats = getDashboardStats();
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}
