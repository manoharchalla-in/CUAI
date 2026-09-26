import { NextResponse } from 'next/server';
import { getEnhancedDashboardStats, loadDatabase } from '@/lib/db';

export async function GET() {
  try {
    const data = getEnhancedDashboardStats();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 });
  }
}
