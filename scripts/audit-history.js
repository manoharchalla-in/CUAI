const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- AUDITING ENTIRE REPOSITORY & GIT HISTORY FOR REAL / FILLED APPLICATIONS ---');

const hashes = execSync('git log --format="%H"', { encoding: 'utf8' }).trim().split('\n');
console.log(`Auditing ${hashes.length} git commits...`);

const allFoundStudents = new Map();

for (const h of hashes) {
  const commitInfo = execSync(`git log -1 --format="%H %ad %s" ${h}`, { encoding: 'utf8' }).trim();
  try {
    const showDb = execSync(`git show ${h}:data/db.json`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const parsed = JSON.parse(showDb);
    if (parsed.student_records && parsed.student_records.length > 0) {
      console.log(`\nCommit: ${commitInfo}`);
      console.log(`Found ${parsed.student_records.length} students:`);
      for (const s of parsed.student_records) {
        console.log(`  - ${s.name} | Roll: ${s.roll_number} | Year: ${s.year} | Email: ${s.email} | ID: ${s.id}`);
        if (!allFoundStudents.has(s.roll_number || s.id)) {
          allFoundStudents.set(s.roll_number || s.id, { ...s, sourceCommit: h });
        }
      }
    }
  } catch (e) {
    //
  }
}

console.log(`\n--- TOTAL UNIQUE STUDENT RECORDS FOUND ACROSS ALL GIT COMMITS: ${allFoundStudents.size} ---`);
for (const [key, s] of allFoundStudents.entries()) {
  console.log(`Roll: ${s.roll_number} | Name: ${s.name} | Year: ${s.year}`);
}
