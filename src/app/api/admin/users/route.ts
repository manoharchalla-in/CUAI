import { NextResponse } from 'next/server';
import { getAllUsers, getAllAdmins, insertUser, insertAdmin, findUserByEmail, findAdminByEmail } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeSuperAdmin = searchParams.get('includeSuperAdmin') === 'true';
    const users = getAllUsers();
    const admins = getAllAdmins(includeSuperAdmin);
    return NextResponse.json({ users, admins });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (findUserByEmail(cleanEmail) || findAdminByEmail(cleanEmail)) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const password_hash = await hashPassword(password);

    if (role === 'admin' || role === 'superadmin') {
      const adminId = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newAdmin = insertAdmin({
        id: adminId,
        email: cleanEmail,
        password_hash,
        name: name.trim(),
        role: role === 'superadmin' ? 'superadmin' : 'admin'
      });
      return NextResponse.json({ success: true, user: { ...newAdmin, password_hash: '***' } });
    } else {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newUser = insertUser({
        id: userId,
        email: cleanEmail,
        password_hash,
        name: name.trim(),
        role: 'user',
        status: 'active',
      });
      return NextResponse.json({ success: true, user: { ...newUser, password_hash: '***' } });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
