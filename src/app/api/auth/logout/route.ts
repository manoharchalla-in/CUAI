import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  let role: 'admin' | 'superadmin' | 'user' | 'all' | undefined;
  try {
    const body = await req.json();
    role = body?.role;
  } catch (e) {
    // No body or empty body
  }

  if (!role) {
    try {
      const url = new URL(req.url);
      role = (url.searchParams.get('role') as any) || undefined;
    } catch (e) {}
  }

  await removeAuthCookie(role);
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
