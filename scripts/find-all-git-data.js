const { execSync } = require('child_process');
const fs = require('fs');

console.log('--- EXHAUSTIVE SEARCH OF ALL GIT BLOBS, DANGLING OBJECTS & LOST FOUND ---');

// 1. Check all git dangling objects
try {
  const lostObjects = execSync('git fsck --lost-found', { encoding: 'utf8' });
  console.log('Lost/Dangling Objects:\n' + lostObjects);
} catch (e) {
  console.log('fsck note:', e.message);
}

// 2. Find every object in git repository
const allObjects = execSync('git rev-list --all --objects', { encoding: 'utf8' }).trim().split('\n');
console.log(`Searching through ${allObjects.length} git objects...`);

const foundJsonData = [];

for (const line of allObjects) {
  const [hash, pathName] = line.split(' ');
  try {
    const type = execSync(`git cat-file -t ${hash}`, { encoding: 'utf8' }).trim();
    if (type === 'blob') {
      const content = execSync(`git cat-file -p ${hash}`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
      if (content.includes('student_records') || content.includes('roll_number')) {
        try {
          const json = JSON.parse(content);
          if (json.student_records && Array.isArray(json.student_records) && json.student_records.length > 0) {
            foundJsonData.push({ hash, path: pathName, count: json.student_records.length, records: json.student_records });
          }
        } catch (err) {}
      }
    }
  } catch (err) {}
}

console.log(`\nFound ${foundJsonData.length} distinct database JSON states in git history:`);
for (const item of foundJsonData) {
  console.log(`\n=== Blob: ${item.hash} (Path: ${item.path || 'unnamed'}) | Records: ${item.count} ===`);
  for (const s of item.records) {
    console.log(`   - Name: ${s.name} | Roll: ${s.roll_number} | Year: ${s.year} | Email: ${s.email} | Mobile: ${s.phone || s.permanent_phone || 'N/A'}`);
  }
}
