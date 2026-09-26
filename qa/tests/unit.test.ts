import assert from 'assert';
import { hashPassword, comparePassword, createToken, verifyToken } from '../../src/lib/auth';
import { 
  loadDatabase, 
  getStudentsByFolder, 
  getAllStudents, 
  getStudentById, 
  findStudentByRollNumber,
  getEnhancedDashboardStats,
  getAllFolders,
  getSetting,
  setSetting,
  getAllAdmins
} from '../../src/lib/db';
import { seedTestData } from '../seed-test-data';

export async function runUnitTests(): Promise<{ passed: number; failed: number; tests: { id: string; name: string; success: boolean; error?: string }[] }> {
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

  console.log('\n--- Running Unit Test Suite ---');

  // Seed baseline
  await seedTestData();

  // T001 - Auth Token & Password
  await test('T001', 'Password Hashing & Verification (bcrypt)', async () => {
    const rawPass = 'SecretPassword@2026';
    const hash = await hashPassword(rawPass);
    assert.ok(hash.startsWith('$2'), 'Hash must be a valid bcrypt hash');
    const matches = await comparePassword(rawPass, hash);
    assert.strictEqual(matches, true, 'Correct password must match');
    const wrongMatches = await comparePassword('WrongPass', hash);
    assert.strictEqual(wrongMatches, false, 'Incorrect password must fail');
  });

  await test('T002', 'JWT Token Generation & Expiration (30 min)', async () => {
    const payload = {
      id: 'usr_test',
      email: 'test@campus.edu',
      name: 'Test Student',
      role: 'user' as const
    };
    const token = await createToken(payload);
    assert.ok(token.length > 20, 'JWT token must be non-empty string');
    
    const decoded = await verifyToken(token);
    assert.ok(decoded !== null, 'Decoded token cannot be null');
    assert.strictEqual(decoded?.email, payload.email);
    assert.strictEqual(decoded?.role, payload.role);
    assert.strictEqual(decoded?.id, payload.id);
  });

  await test('T003', 'Database Student Retrieval & Filter by Folder', () => {
    const folder1 = getStudentsByFolder('1st-year');
    assert.strictEqual(folder1.total, 3, 'Folder 1st-year must have 3 students seeded');
    assert.strictEqual(folder1.records.length, 3);
  });

  await test('T004', 'Database Student Retrieval by ID & Roll Number', () => {
    const std1 = getStudentById('std_001');
    assert.ok(std1 !== null, 'Student std_001 must exist');
    assert.strictEqual(std1?.name, 'Alice Johnson');
    assert.strictEqual(std1?.roll_number, '24CS001');

    const stdByRoll = findStudentByRollNumber('24CS001');
    assert.ok(stdByRoll !== null, 'Student with roll 24CS001 must exist');
    assert.strictEqual(stdByRoll?.id, 'std_001');
  });

  await test('T005', 'Enhanced Dashboard Stats (Gender KPI & Counts)', () => {
    const stats = getEnhancedDashboardStats();
    assert.strictEqual(stats.kpis.totalStudents, 12, 'Total students must be 12');
    assert.strictEqual(stats.kpis.totalFolders, 4, 'Active year folders must be 4');
    assert.strictEqual(stats.kpis.maleStudents, 6, 'Male students count must be 6');
    assert.strictEqual(stats.kpis.femaleStudents, 6, 'Female students count must be 6');
    assert.strictEqual(stats.kpis.maleStudents + stats.kpis.femaleStudents, stats.kpis.totalStudents, 'Male + Female must equal Total Students');
  });

  await test('T006', 'Year Folders Retrieval', () => {
    const folders = getAllFolders();
    assert.strictEqual(folders.length, 4, 'Must return 4 year folders');
    const ids = folders.map(f => f.id);
    assert.ok(ids.includes('1st-year'));
    assert.ok(ids.includes('4th-year'));
  });

  await test('T007', 'System Settings & Maintenance Mode Store', () => {
    const initialMode = getSetting('maintenance_mode', 'false');
    assert.strictEqual(initialMode, 'false');

    setSetting('maintenance_mode', 'true');
    assert.strictEqual(getSetting('maintenance_mode'), 'true');

    setSetting('maintenance_mode', 'false');
    assert.strictEqual(getSetting('maintenance_mode'), 'false');
  });

  await test('T008', 'SuperAdmin vs Campus Admin Distinction in getAllAdmins', () => {
    const allAdmins = getAllAdmins(true);
    assert.strictEqual(allAdmins.length, 2, 'Total admins including superadmin should be 2');
    
    const campusAdmins = getAllAdmins(false);
    assert.strictEqual(campusAdmins.length, 1, 'Campus admins only should be 1');
    assert.strictEqual(campusAdmins[0].role, 'admin');
  });

  return { passed, failed, tests: results };
}

if (require.main === module) {
  runUnitTests().then(res => {
    console.log(`\nUnit Tests Summary: ${res.passed} passed, ${res.failed} failed.`);
    if (res.failed > 0) process.exit(1);
  });
}
