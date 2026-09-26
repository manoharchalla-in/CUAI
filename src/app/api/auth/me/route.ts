import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roleParam = searchParams.get('role') as 'admin' | 'superadmin' | 'user' | null;
  
  const user = await getCurrentUser(roleParam || undefined);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
