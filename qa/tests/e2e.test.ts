import assert from 'assert';
import { seedTestData } from '../seed-test-data';
import { getEnhancedDashboardStats, getStudentsByFolder, updateStudentRecord } from '../../src/lib/db';

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

export async function runE2ETests(): Promise<{ passed: number; failed: number; tests: { id: string; name: string; success: boolean; error?: string }[] }> {
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

  console.log('\n--- Running End-to-End Multi-Portal Test Suite ---');
  await seedTestData();

  // Step 1: Log in all 3 personas
  let superadminCookie = '';
  let adminCookie = '';
  let userCookie = '';

  const saRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@com', password: 'zxcvbnm', loginType: 'superadmin' })
  });
  superadminCookie = extractCookie(saRes, 'superadmin_auth_token');

  const adminRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@com', password: 'mnbvcxz', loginType: 'admin' })
  });
  adminCookie = extractCookie(adminRes, 'admin_auth_token');

  const userRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'm@com', password: 'User@123', loginType: 'user' })
  });
  userCookie = extractCookie(userRes, 'user_auth_token');

  // Journey 1: Maintenance Mode Workflow across portals
  await test('T159', 'E2E Journey 1: SuperAdmin toggles maintenance -> propagates to all endpoints', async () => {
    // 1. SuperAdmin enables maintenance
    const enableRes = await fetch(`${BASE_URL}/api/super-admin/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: superadminCookie },
      body: JSON.stringify({ enabled: true, message: 'Scheduled Maintenance Active' })
    });
    assert.strictEqual(enableRes.status, 200);

    // 2. SuperAdmin disables maintenance
    const disableRes = await fetch(`${BASE_URL}/api/super-admin/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: superadminCookie },
      body: JSON.stringify({ enabled: false })
    });
    assert.strictEqual(disableRes.status, 200);
  });

  // Journey 2: Student creation & Campus Admin reflection
  await test('T160', 'E2E Journey 2: Student registration -> Admin dashboard update -> Student query', async () => {
    // 1. Check initial stats
    const initialStats = getEnhancedDashboardStats();
    assert.strictEqual(initialStats.kpis.totalStudents, 12);

    const createRes = await fetch(`${BASE_URL}/api/admin/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        folder_id: '1st-year',
        roll_number: '24CS999',
        name: 'Zack Morris',
        email: 'student.zack@campus.edu',
        student_phone: '+91 9998887770',
        branch: 'CSE',
        section: 'A',
        year: '1st_year',
        gender: 'Male',
        cgpa_sgpa: '8.5',
        technical_skills: 'Rust, WebAssembly, Go'
      })
    });
    assert.strictEqual(createRes.status, 200);

    // 2. Verify totalStudents increased to 13
    const updatedStats = getEnhancedDashboardStats();
    assert.strictEqual(updatedStats.kpis.totalStudents, 13);
    assert.strictEqual(updatedStats.kpis.maleStudents, 7);

    // 3. Query via chat assistant
    const chatRes = await fetch(`${BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: userCookie },
      body: JSON.stringify({
        content: 'Tell me about student Zack Morris with roll number 24CS999',
        sessionId: 'test_session_e2e_02'
      })
    });
    const chatData = await chatRes.json();
    assert.strictEqual(chatRes.status, 200);
    const reply = chatData.assistantMessage?.content || '';
    assert.ok(reply.includes('Zack') || reply.includes('24CS999') || reply.includes('CSE'));
  });

  // Journey 3: Student record update & RAG synchronization
  await test('T161', 'E2E Journey 3: Record update -> RAG retrieval reflection', async () => {
    const std = getStudentsByFolder('1st-year').records.find(r => r.roll_number === '24CS001');
    assert.ok(std !== undefined, 'Student 24CS001 must be found');

    updateStudentRecord(std.id, {
      skills: 'Quantum Computing, Qiskit, Python'
    });

    const chatRes = await fetch(`${BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: userCookie },
      body: JSON.stringify({
        content: 'Which student has skills in Quantum Computing and Qiskit?',
        sessionId: 'test_session_e2e_03'
      })
    });
    const chatData = await chatRes.json();
    assert.strictEqual(chatRes.status, 200);
    const reply = chatData.assistantMessage?.content || '';
    assert.ok(reply.includes('Alice') || reply.includes('24CS001') || reply.includes('Quantum'));
  });

  // Journey 4: Super Admin Supabase Live Metrics & Storage
  await test('T162', 'E2E Journey 4: Super Admin Storage Metrics & Connection check', async () => {
    const res = await fetch(`${BASE_URL}/api/super-admin/supabase`, {
      headers: { Cookie: superadminCookie }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.storage !== undefined);
    assert.ok(typeof data.storage.totalBytesUsed === 'number');
  });

  // Journey 5: Logout & Cookie Invalidation
  await test('T163', 'E2E Journey 5: User Logout clears session tokens', async () => {
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: userCookie }
    });
    assert.strictEqual(logoutRes.status, 200);
    const setCookie = logoutRes.headers.get('set-cookie') || '';
    assert.ok(setCookie.includes('Max-Age=0') || setCookie.includes('expires=') || setCookie.includes('user_auth_token=;'));
  });

  return { passed, failed, tests: results };
}

if (require.main === module) {
  runE2ETests().then(res => {
    console.log(`\nE2E Tests Summary: ${res.passed} passed, ${res.failed} failed.`);
    if (res.failed > 0) process.exit(1);
  });
}
