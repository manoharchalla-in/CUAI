import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'cityapp_super_secret_jwt_key_9876543210_abcdef'
);

const SESSION_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'user';
  lastActivity?: number;
  iat?: number;
  exp?: number;
}

async function verifyCookieToken(tokenValue?: string, expectedRole?: 'superadmin' | 'admin' | 'user'): Promise<DecodedToken | null> {
  if (!tokenValue) return null;
  try {
    const { payload } = await jwtVerify(tokenValue, JWT_SECRET);
    if (!payload || !payload.id || !payload.role) return null;

    const role = payload.role as 'superadmin' | 'admin' | 'user';
    if (expectedRole && role !== expectedRole) return null;

    // Server-side inactivity timeout
    const lastActivity = typeof payload.lastActivity === 'number' 
      ? payload.lastActivity 
      : (typeof payload.iat === 'number' ? payload.iat * 1000 : 0);
    
    if (Date.now() - lastActivity > SESSION_INACTIVITY_TIMEOUT_MS) {
      return null;
    }

    return payload as unknown as DecodedToken;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static and system assets
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|css|js|map|json|txt|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Canonicalize legacy `/superadmin` to `/super-admin`
  if (pathname === '/superadmin' || pathname.startsWith('/superadmin/')) {
    const target = pathname.replace('/superadmin', '/super-admin');
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 3. Open Public APIs & Intake Forms
  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/forms') ||
    pathname.startsWith('/forms') ||
    pathname === '/unauthorized' ||
    pathname === '/register'
  ) {
    return NextResponse.next();
  }

  // 4. Read role-scoped tokens
  const superAdminToken = request.cookies.get('superadmin_auth_token')?.value;
  const adminToken = request.cookies.get('admin_auth_token')?.value;
  const userToken = request.cookies.get('user_auth_token')?.value;

  const hasSwitchParam = request.nextUrl.searchParams.has('switch') || request.nextUrl.searchParams.has('reason');

  // 5. Dedicated Login Pages
  if (pathname === '/super-admin/login') {
    if (!hasSwitchParam) {
      const validSuperAdmin = await verifyCookieToken(superAdminToken, 'superadmin');
      if (validSuperAdmin) {
        return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    if (!hasSwitchParam) {
      const validAdmin = await verifyCookieToken(adminToken, 'admin');
      if (validAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  if (pathname === '/login' || pathname === '/chat/login') {
    if (!hasSwitchParam) {
      const validUser = await verifyCookieToken(userToken, 'user');
      if (validUser) {
        return NextResponse.redirect(new URL('/chat', request.url));
      }
    }
    return NextResponse.next();
  }

  // 6. Root Path ('/') authoritative resolution
  if (pathname === '/') {
    const validSuperAdmin = await verifyCookieToken(superAdminToken, 'superadmin');
    if (validSuperAdmin) {
      return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
    }

    const validAdmin = await verifyCookieToken(adminToken, 'admin');
    if (validAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    const validUser = await verifyCookieToken(userToken, 'user');
    if (validUser) {
      return NextResponse.redirect(new URL('/chat', request.url));
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 7. SUPER ADMIN Protection (`/super-admin/*` and `/api/super-admin/*`)
  if (pathname.startsWith('/super-admin') || pathname.startsWith('/api/super-admin')) {
    const validSuperAdmin = await verifyCookieToken(superAdminToken, 'superadmin');
    if (!validSuperAdmin) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Forbidden: Super Administrator authentication required' },
          { status: 403 }
        );
      }
      const loginUrl = new URL('/super-admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 8. CAMPUS ADMIN & ADMIN APIs Protection (`/admin/*` and `/api/admin/*`)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Shared Admin & Super Admin APIs
    if (pathname.startsWith('/api/admin')) {
      const validSuperAdmin = await verifyCookieToken(superAdminToken, 'superadmin');
      const validAdmin = await verifyCookieToken(adminToken, 'admin');
      if (!validSuperAdmin && !validAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: Administrator authentication required' },
          { status: 403 }
        );
      }
      return NextResponse.next();
    }

    // Dedicated Campus Admin Page Views
    const validAdmin = await verifyCookieToken(adminToken, 'admin');
    if (!validAdmin) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 9. STUDENT CHATBOT Protection (`/chat/*` and `/api/chat/*`)
  if (pathname.startsWith('/chat') || pathname.startsWith('/api/chat')) {
    const validUser = await verifyCookieToken(userToken, 'user');
    if (!validUser) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized: Student authentication required' },
          { status: 401 }
        );
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
