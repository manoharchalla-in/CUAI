import assert from 'assert';
import { seedTestData } from '../seed-test-data';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

function extractCookie(res: Response, cookieName: string): string {
  if (typeof (res.headers as any).getSetCookie === 'function') {
    const cookies = (res.headers as any).getSetCookie();
    for (const c of cookies) {
      const match = c.match(new RegExp(`${cookieName}=([^;]+)`));
      if (match) return `${cookieName}=${match[1]}`;
    }
  }
  const raw = res.headers.get('set-cookie') || '';
  const match = raw.match(new RegExp(`${cookieName}=([^;]+)`));
  if (match) return `${cookieName}=${match[1]}`;
  return raw.split(';')[0];
}

export async function runApiTests(): Promise<{ passed: number; failed: number; tests: { id: string; name: string; success: boolean; error?: string }[] }> {
  const results: { id: string; name: string; success: boolean; error?: string }[] = [];
  let passed = 0;
  let failed = 0;

  async function test(id: string, name: string, fn: () => Promise<void> | void) {
    try {
      await fn();
      results.push({ id, name, success: true });
      passed++;
      console.log(`  ✓ [${id}] ${name}`);
    } catch (err: any) {
      results.push({ id, name, success: false, error: err.message });
      failed++;
      console.error(`  ✗ [${id}] ${name} - FAILED: ${err.message}`);
    }
  }

  console.log('\n--- Running API Test Suite ---');
  await seedTestData();

  let adminCookie = '';
  let superadminCookie = '';
  let userCookie = '';

  // Auth Tests
  await test('T010', 'POST /api/auth/login - SuperAdmin Login', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'superadmin@com', password: 'zxcvbnm', loginType: 'superadmin' })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200, `Login status should be 200, got ${res.status}`);
    assert.strictEqual(data.user.role, 'superadmin');
    superadminCookie = extractCookie(res, 'superadmin_auth_token');
    assert.ok(superadminCookie.startsWith('superadmin_auth_token='), 'Cookie must be extracted properly');
  });

  await test('T011', 'POST /api/auth/login - Campus Admin Login', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@com', password: 'mnbvcxz', loginType: 'admin' })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200, `Login status should be 200, got ${res.status}`);
    assert.strictEqual(data.user.role, 'admin');
    adminCookie = extractCookie(res, 'admin_auth_token');
    assert.ok(adminCookie.startsWith('admin_auth_token='), 'Cookie must be extracted properly');
  });

  await test('T012', 'POST /api/auth/login - Student User Login', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'm@com', password: 'User@123', loginType: 'user' })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200, `Login status should be 200, got ${res.status}`);
    assert.strictEqual(data.user.role, 'user');
    userCookie = extractCookie(res, 'user_auth_token');
    assert.ok(userCookie.startsWith('user_auth_token='), 'Cookie must be extracted properly');
  });

  await test('T013', 'POST /api/auth/login - Invalid Password Rejection (401)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@com', password: 'WrongPassword', loginType: 'admin' })
    });
    assert.strictEqual(res.status, 401, 'Invalid credentials should return 401');
  });

  await test('T014', 'GET /api/auth/me - Profile Verification', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: adminCookie }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.user.email, 'admin@campus.edu');
    assert.strictEqual(data.user.role, 'admin');
  });

  // Admin Dashboard API
  await test('T020', 'GET /api/admin/stats - Dashboard KPIs', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Cookie: adminCookie }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.stats !== undefined);
    assert.strictEqual(data.stats.totalStudents, 12);
  });

  await test('T021', 'GET /api/admin/students - List Students with Pagination', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/students?limit=5&offset=0`, {
      headers: { Cookie: adminCookie }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.records.length, 5);
    assert.strictEqual(data.total, 12);
  });

  await test('T022', 'GET /api/admin/students - Search by Name & Roll Number', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/students?search=Alice`, {
      headers: { Cookie: adminCookie }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.records.some((r: any) => r.name === 'Alice Johnson'));
  });

  // Folder API
  await test('T025', 'GET /api/admin/folders - List Year Folders', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/folders`, {
      headers: { Cookie: adminCookie }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.folders.length, 4);
  });

  // SuperAdmin Supabase Storage API
  await test('T030', 'GET /api/super-admin/supabase - Storage Stats & Connection', async () => {
    const res = await fetch(`${BASE_URL}/api/super-admin/supabase`, {
      headers: { Cookie: superadminCookie }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.storage !== undefined);
    assert.ok(typeof data.storage.totalBytesUsed === 'number');
  });

  // Maintenance Mode API
  await test('T035', 'POST /api/super-admin/maintenance - Toggle State', async () => {
    const enableRes = await fetch(`${BASE_URL}/api/super-admin/maintenance`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: superadminCookie 
      },
      body: JSON.stringify({ enabled: true, message: 'QA Maintenance In Progress' })
    });
    assert.strictEqual(enableRes.status, 200);

    // Disable after verification
    const disableRes = await fetch(`${BASE_URL}/api/super-admin/maintenance`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: superadminCookie 
      },
      body: JSON.stringify({ enabled: false })
    });
    assert.strictEqual(disableRes.status, 200);
  });

  // Chat API
  await test('T040', 'POST /api/chat/message - Student Assistant Query', async () => {
    const res = await fetch(`${BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: userCookie 
      },
      body: JSON.stringify({
        content: 'Who is the top student in 4th Year?',
        sessionId: 'test_session_qa_01'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.assistantMessage && data.assistantMessage.content.length > 0);
  });

  return { passed, failed, tests: results };
}

if (require.main === module) {
  runApiTests().then(res => {
    console.log(`\nAPI Tests Summary: ${res.passed} passed, ${res.failed} failed.`);
    if (res.failed > 0) process.exit(1);
  });
}
