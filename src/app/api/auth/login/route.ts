import { NextResponse } from 'next/server';
import { findAdminByEmail, findUserByEmail, isGlobalMaintenanceActive, getMaintenanceSettings } from '@/lib/db';
import { comparePassword, createToken, setAuthCookie } from '@/lib/auth';
import { enforceRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: Request) {
  // 1. Enforce IP-based rate limiting on login endpoint
  const rateLimitResponse = enforceRateLimit(req, 'auth_login', RATE_LIMIT_PRESETS.AUTH_LOGIN);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await req.json();
    const { email, password, loginType } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const effectiveType = loginType || (
      findAdminByEmail(cleanEmail, 'superadmin') ? 'superadmin' :
      findAdminByEmail(cleanEmail, 'admin') ? 'admin' : 'user'
    );

    // 1. Check admin login
    if (effectiveType === 'admin') {
      const admin = findAdminByEmail(cleanEmail, 'admin');
      if (!admin || admin.role !== 'admin') {
        recordAuditLog({
          req,
          action: 'LOGIN_FAILED',
          target: cleanEmail,
          status: 'failure',
          details: { role: 'admin', reason: 'Invalid credentials' },
        });
        return NextResponse.json({ error: 'Invalid administrator credentials' }, { status: 401 });
      }

      if (admin.status === 'maintenance') {
        return NextResponse.json({ 
          error: 'Maintenance Mode: Your administrator account is temporarily undergoing scheduled maintenance.',
          is_maintenance: true 
        }, { status: 503 });
      }

      if (isGlobalMaintenanceActive('admin')) {
        const m = getMaintenanceSettings();
        return NextResponse.json({ 
          error: `${m.title}: ${m.message}`,
          is_maintenance: true 
        }, { status: 503 });
      }

      const isMatch = await comparePassword(password, admin.password_hash);
      if (!isMatch) {
        recordAuditLog({
          req,
          action: 'LOGIN_FAILED',
          target: cleanEmail,
          status: 'failure',
          details: { role: 'admin', reason: 'Wrong password' },
        });
        return NextResponse.json({ error: 'Invalid administrator credentials' }, { status: 401 });
      }

      const token = await createToken({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      });

      await setAuthCookie(token, 'admin');

      recordAuditLog({
        req,
        actor: { id: admin.id, username: admin.name, role: 'admin' },
        action: 'LOGIN_SUCCESS',
        target: admin.email,
        status: 'success',
      });

      return NextResponse.json({
        success: true,
        user: { id: admin.id, email: admin.email, name: admin.name, role: 'admin' },
        redirectTo: '/admin/dashboard',
      });
    }

    // 2. Check superadmin login
    if (effectiveType === 'superadmin') {
      const admin = findAdminByEmail(cleanEmail, 'superadmin');
      if (!admin || admin.role !== 'superadmin') {
        recordAuditLog({
          req,
          action: 'LOGIN_FAILED',
          target: cleanEmail,
          status: 'failure',
          details: { role: 'superadmin', reason: 'Invalid credentials' },
        });
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const isMatch = await comparePassword(password, admin.password_hash);
      if (!isMatch) {
        recordAuditLog({
          req,
          action: 'LOGIN_FAILED',
          target: cleanEmail,
          status: 'failure',
          details: { role: 'superadmin', reason: 'Wrong password' },
        });
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = await createToken({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'superadmin',
      });

      await setAuthCookie(token, 'superadmin');

      recordAuditLog({
        req,
        actor: { id: admin.id, username: admin.name, role: 'superadmin' },
        action: 'LOGIN_SUCCESS',
        target: admin.email,
        status: 'success',
      });

      return NextResponse.json({
        success: true,
        user: { id: admin.id, email: admin.email, name: admin.name, role: 'superadmin' },
        redirectTo: '/super-admin/dashboard',
      });
    }

    // 3. Regular student / user login
    const user = findUserByEmail(cleanEmail);
    if (!user) {
      recordAuditLog({
        req,
        action: 'LOGIN_FAILED',
        target: cleanEmail,
        status: 'failure',
        details: { role: 'user', reason: 'User not found' },
      });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'Your account has been suspended. Please contact admin.' }, { status: 403 });
    }

    if (user.status === 'maintenance') {
      return NextResponse.json({ 
        error: 'Account Under Maintenance: Your chatbot account is temporarily in maintenance mode. Please try again shortly.',
        is_maintenance: true 
      }, { status: 503 });
    }

    if (isGlobalMaintenanceActive('chatbot')) {
      const m = getMaintenanceSettings();
      return NextResponse.json({ 
        error: `${m.title}: ${m.message}`,
        is_maintenance: true 
      }, { status: 503 });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      recordAuditLog({
        req,
        action: 'LOGIN_FAILED',
        target: cleanEmail,
        status: 'failure',
        details: { role: 'user', reason: 'Wrong password' },
      });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
    });

    await setAuthCookie(token, 'user');

    recordAuditLog({
      req,
      actor: { id: user.id, username: user.name, role: 'user' },
      action: 'LOGIN_SUCCESS',
      target: user.email,
      status: 'success',
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: 'user' },
      redirectTo: '/chat',
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
