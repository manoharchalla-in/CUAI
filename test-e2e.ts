import { 
  findStudentsByName, 
  findStudentByRollNumber, 
  getAllFolders, 
  getFolderBySlug,
  insertStudentRecord, 
  updateStudentRecord, 
  deleteStudentRecord, 
  getStudentsByFolder,
  findAdminByEmail
} from './src/lib/db';
import { processChatQuery } from './src/lib/rag/engine';
import bcrypt from 'bcryptjs';

async function runE2ESuite() {
  console.log('====================================================');
  console.log('       CITYAPP E2E VERIFICATION SUITE              ');
  console.log('====================================================');

  // 1. Folders Verification
  const folders = getAllFolders();
  console.log(`[TEST 1] Folders Count: ${folders.length} (Expected: 4)`);
  if (folders.length !== 4) throw new Error('Failed: Expected exactly 4 year folders');

  const folder3rd = getFolderBySlug('3rd-year');
  if (!folder3rd || folder3rd.name !== '3rd Year') throw new Error('Failed: 3rd Year folder missing');
  console.log(`[PASS] 4 Year Folders verified successfully.`);

  // 2. Disambiguation Test (Varma)
  const disambigRes = processChatQuery('Varma');
  console.log(`\n[TEST 2] Query "Varma": Found = ${disambigRes.found}, QueryType = ${disambigRes.queryType}`);
  console.log(`Disambiguation text:\n${disambigRes.answer}`);
  if (!disambigRes.isDisambiguation || disambigRes.matchedStudents.length < 2) {
    throw new Error('Failed: Expected disambiguation for "Varma"');
  }
  console.log(`[PASS] Disambiguation test passed.`);

  // 3. Exact Roll Number Lookup Test (26HT1A4301)
  const rollRes = processChatQuery('26HT1A4301');
  console.log(`\n[TEST 3] Query "26HT1A4301": Found = ${rollRes.found}, Student = ${rollRes.matchedStudents[0]?.name}`);
  if (!rollRes.found || rollRes.matchedStudents[0]?.roll_number !== '26HT1A4301') {
    throw new Error('Failed: Expected exact match for roll number 26HT1A4301');
  }
  console.log(`[PASS] Exact roll number search test passed.`);

  // 4. Zero Hallucination Test (Unknown student Ramesh)
  const unknownRes = processChatQuery('Who is Ramesh?');
  console.log(`\n[TEST 4] Query "Who is Ramesh?": Found = ${unknownRes.found}`);
  console.log(`Unknown response:\n${unknownRes.answer}`);
  if (unknownRes.found !== false || !unknownRes.answer.includes("couldn't find a student named")) {
    throw new Error('Failed: Expected zero-hallucination fallback for unknown student');
  }
  console.log(`[PASS] Zero-hallucination guardrail test passed.`);

  // 5. Dynamic Insertion & RAG Instant Retrieval Test
  console.log(`\n[TEST 5] Testing Dynamic Form Intake into 3rd Year...`);
  const testStudent = {
    id: `std_test_${Date.now()}`,
    folder_id: folder3rd.id,
    year: '3rd_year' as const,
    name: 'Vikram Aditya',
    roll_number: '23CSE999',
    branch: 'CSE',
    section: 'A',
    email: 'vikram.aditya@example.com',
    phone: '+91 99999 88888',
    college: 'ABC College',
    skills: 'Cybersecurity, Python, Linux',
    address: 'Hyderabad',
    profile_info: 'Security researcher and bug bounty hunter.',
    custom_fields_json: '{}'
  };

  insertStudentRecord(testStudent);

  // Check if in 3rd year folder
  const thirdYearRecords = getStudentsByFolder(folder3rd.id, 'Vikram Aditya');
  if (thirdYearRecords.total === 0) throw new Error('Failed: Test student not found in 3rd year folder');

  // Check chatbot retrieval
  const vikramRes = processChatQuery('Who is Vikram Aditya?');
  console.log(`Chatbot query for newly added student:\n${vikramRes.answer}`);
  if (!vikramRes.found || !vikramRes.answer.includes('23CSE999')) {
    throw new Error('Failed: Newly inserted student not retrieved by chatbot');
  }
  console.log(`[PASS] Instant RAG intake availability test passed.`);

  // 6. Update Student Skills Test
  console.log(`\n[TEST 6] Testing Edit Student and Instant RAG Update...`);
  updateStudentRecord(testStudent.id, { skills: 'Rust, Solana, Distributed Systems' });
  const updatedRes = processChatQuery("What are Vikram Aditya's skills?");
  console.log(`Updated chatbot response:\n${updatedRes.answer}`);
  if (!updatedRes.answer.includes('Rust, Solana')) {
    throw new Error('Failed: Updated skills not reflected in chatbot response');
  }
  console.log(`[PASS] Instant update sync test passed.`);

  // 7. Delete Student Test
  console.log(`\n[TEST 7] Testing Delete Student and Instant RAG Removal...`);
  deleteStudentRecord(testStudent.id);
  const deletedRes = processChatQuery('Vikram Aditya');
  console.log(`Chatbot response after deletion:\n${deletedRes.answer}`);
  if (deletedRes.found !== false) {
    throw new Error('Failed: Deleted student is still returned by chatbot');
  }
  console.log(`[PASS] Instant deletion sync test passed.`);

  // 8. Strict Auth & Super Admin Isolation Test
  console.log(`\n[TEST 8] Testing Strict Auth & Super Admin Isolation...`);
  const adminFromAdmin = findAdminByEmail('admin', 'admin');
  if (!adminFromAdmin || adminFromAdmin.role !== 'admin') {
    throw new Error('Failed: "admin" username must match campus admin account');
  }

  const superadminUnderAdmin = findAdminByEmail('999', 'admin');
  if (superadminUnderAdmin !== null) {
    throw new Error('Failed: Superadmin account 999 must not be discoverable under admin filter');
  }

  const superadminDirect = findAdminByEmail('sp@a', 'superadmin');
  if (!superadminDirect || superadminDirect.role !== 'superadmin') {
    throw new Error('Failed: sp@a must match superadmin account under superadmin filter');
  }

  const adminDirect = findAdminByEmail('campusadmin@cityapp.edu', 'admin');
  if (!adminDirect || adminDirect.role !== 'admin') {
    throw new Error('Failed: campusadmin@cityapp.edu must match campus admin');
  }
  console.log(`[PASS] Strict role isolation and Super Admin invisibility confirmed.`);

  // 9. Negative Password Verification Tests
  console.log(`\n[TEST 9] Testing Password Verifications & Negative Checks...`);
  const isCampusAdminPassCorrect = await bcrypt.compare('zxcvbnm', adminFromAdmin.password_hash);
  if (!isCampusAdminPassCorrect) throw new Error('Failed: Campus admin password verification failed');

  const isCampusAdminWrongPass = await bcrypt.compare('wrongpassword', adminFromAdmin.password_hash);
  if (isCampusAdminWrongPass) throw new Error('Failed: Wrong password must not match for campus admin');

  const isSuperAdminPassCorrect = await bcrypt.compare('mnbvcxz', superadminDirect.password_hash);
  if (!isSuperAdminPassCorrect) throw new Error('Failed: Super admin password verification failed');

  const isSuperAdminWrongPass = await bcrypt.compare('wrongpassword', superadminDirect.password_hash);
  if (isSuperAdminWrongPass) throw new Error('Failed: Wrong password must not match for super admin');
  console.log(`[PASS] Password verification security checks passed.`);

  // 10. Multi-field Query & Entity Extraction
  console.log(`\n[TEST 10] Testing Natural Language Possessive and Multi-Field Queries...`);
  const adityaSkills = processChatQuery("What are Aditya Varma's skills?");
  if (!adityaSkills.found || !adityaSkills.answer.includes('Python, C Programming')) {
    throw new Error('Failed: Possessive query for Aditya Varma skills failed');
  }

  const manoharQuery = processChatQuery("Who is Manohar Challa?");
  if (!manoharQuery.found || !manoharQuery.answer.includes('23HT1A4301')) {
    throw new Error('Failed: Full profile query for Manohar Challa failed');
  }
  console.log(`[PASS] Natural language possessive and multi-field queries passed.`);

  console.log('\n====================================================');
  console.log('       ALL 10 E2E REGRESSION TESTS PASSED (100%)    ');
  console.log('====================================================');
}

runE2ESuite().catch((err) => {
  console.error(err);
  process.exit(1);
});

