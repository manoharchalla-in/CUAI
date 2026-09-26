import { NextResponse } from 'next/server';
import { findUserByEmail, findAdminByEmail, insertUser } from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    if (findUserByEmail(cleanEmail) || findAdminByEmail(cleanEmail)) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser = insertUser({
      id: userId,
      email: cleanEmail,
      password_hash,
      name: name.trim(),
      role: 'user',
      status: 'active',
    });

    const token = await createToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: 'user',
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: 'user' },
      redirectTo: '/chat',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
