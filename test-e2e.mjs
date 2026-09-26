import { 
  findStudentsByName, 
  findStudentByRollNumber, 
  getAllFolders, 
  getFolderBySlug,
  insertStudentRecord, 
  updateStudentRecord, 
  deleteStudentRecord, 
  getStudentsByFolder 
} from './src/lib/db/index.js';
import { processChatQuery } from './src/lib/rag/engine.js';

console.log('--- RUNNING CITYAPP E2E VERIFICATION TEST ---');

// 1. Folders Verification
const folders = getAllFolders();
console.log(`[1] Folders Count: ${folders.length} (Expected: 4)`);
if (folders.length !== 4) throw new Error('Failed: Expected exactly 4 year folders');

const folder3rd = getFolderBySlug('3rd-year');
if (!folder3rd || folder3rd.name !== '3rd Year') throw new Error('Failed: 3rd Year folder missing');
console.log(`✓ 4 Year Folders verified successfully.`);

// 2. Disambiguation Test (Sai)
const disambigRes = processChatQuery('Sai');
console.log(`[2] Query "Sai": Found = ${disambigRes.found}, QueryType = ${disambigRes.queryType}`);
console.log(`Disambiguation text:\n${disambigRes.answer}\n`);
if (!disambigRes.isDisambiguation || disambigRes.matchedStudents.length < 2) {
  throw new Error('Failed: Expected disambiguation for "Sai"');
}
console.log(`✓ Disambiguation test passed.`);

// 3. Exact Roll Number Lookup Test (23CSE001)
const rollRes = processChatQuery('23CSE001');
console.log(`[3] Query "23CSE001": Found = ${rollRes.found}, Student = ${rollRes.matchedStudents[0]?.name}`);
if (!rollRes.found || rollRes.matchedStudents[0]?.roll_number !== '23CSE001') {
  throw new Error('Failed: Expected exact match for roll number 23CSE001');
}
console.log(`✓ Exact roll number search test passed.`);

// 4. Zero Hallucination Test (Unknown student Ramesh)
const unknownRes = processChatQuery('Who is Ramesh?');
console.log(`[4] Query "Who is Ramesh?": Found = ${unknownRes.found}`);
console.log(`Unknown response: ${unknownRes.answer}`);
if (unknownRes.found !== false || !unknownRes.answer.includes("couldn't find a student named")) {
  throw new Error('Failed: Expected zero-hallucination fallback for unknown student');
}
console.log(`✓ Zero-hallucination guardrail test passed.`);

// 5. Dynamic Insertion & RAG Instant Retrieval Test
console.log(`[5] Testing Dynamic Form Intake into 3rd Year...`);
const testStudent = {
  id: `std_test_${Date.now()}`,
  folder_id: folder3rd.id,
  year: '3rd_year',
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
console.log(`Chatbot query for newly added student:\n${vikramRes.answer}\n`);
if (!vikramRes.found || !vikramRes.answer.includes('23CSE999')) {
  throw new Error('Failed: Newly inserted student not retrieved by chatbot');
}
console.log(`✓ Instant RAG availability test passed.`);

// 6. Update Student Skills Test
console.log(`[6] Testing Edit Student and Instant RAG Update...`);
updateStudentRecord(testStudent.id, { skills: 'Rust, Solana, Distributed Systems' });
const updatedRes = processChatQuery("What are Vikram Aditya's skills?");
console.log(`Updated chatbot response:\n${updatedRes.answer}\n`);
if (!updatedRes.answer.includes('Rust, Solana')) {
  throw new Error('Failed: Updated skills not reflected in chatbot response');
}
console.log(`✓ Instant update sync test passed.`);

// 7. Delete Student Test
console.log(`[7] Testing Delete Student and Instant RAG Removal...`);
deleteStudentRecord(testStudent.id);
const deletedRes = processChatQuery('Vikram Aditya');
console.log(`Chatbot response after deletion:\n${deletedRes.answer}\n`);
if (deletedRes.found !== false) {
  throw new Error('Failed: Deleted student is still returned by chatbot');
}
console.log(`✓ Instant deletion sync test passed.`);

console.log('--- ALL E2E VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
