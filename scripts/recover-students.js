const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\23ht1\\.gemini\\antigravity\\brain';
const convs = fs.readdirSync(brainDir);

console.log('--- RECOVERING ALL SUBMITTED STUDENT PROFILES FROM CONVERSATION TRANSCRIPTS ---');

const recoveredStudents = new Map();

for (const c of convs) {
  const fullLog = path.join(brainDir, c, '.system_generated', 'logs', 'transcript_full.jsonl');
  const compactLog = path.join(brainDir, c, '.system_generated', 'logs', 'transcript.jsonl');
  const target = fs.existsSync(fullLog) ? fullLog : (fs.existsSync(compactLog) ? compactLog : null);
  if (target) {
    try {
      const content = fs.readFileSync(target, 'utf8');
      
      // Look for JSON objects containing roll_number and name
      const regex = /\{[^{}]*"name"\s*:\s*"[^"]+"[^{}]*"roll_number"\s*:\s*"[^"]+"[^{}]*\}/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        try {
          const parsed = JSON.parse(match[0]);
          if (parsed.roll_number && parsed.name && !parsed.name.includes('Demo') && !parsed.name.includes('Aditya Varma') && !parsed.name.includes('Sneha Patel')) {
            const roll = parsed.roll_number.toUpperCase().trim();
            if (!recoveredStudents.has(roll)) {
              recoveredStudents.set(roll, parsed);
              console.log(`Recovered Student: ${parsed.name} | Roll: ${roll}`);
            }
          }
        } catch (e) {}
      }

      // Also look for more complex JSON blocks (multiline / nested)
      const bigJsonMatches = content.match(/\{[\s\S]*?"roll_number"\s*:\s*"2[3456]HT[15]A43[A-Z0-9]+"[\s\S]*?\}/g);
      if (bigJsonMatches) {
        for (const m of bigJsonMatches) {
          try {
            const parsed = JSON.parse(m);
            if (parsed.roll_number && parsed.name) {
              const roll = parsed.roll_number.toUpperCase().trim();
              if (!recoveredStudents.has(roll)) {
                recoveredStudents.set(roll, parsed);
                console.log(`Recovered Student (Deep): ${parsed.name} | Roll: ${roll}`);
              }
            }
          } catch (e) {}
        }
      }
    } catch (e) {}
  }
}

console.log(`\nTotal Real Students Recovered: ${recoveredStudents.size}`);
for (const [roll, s] of recoveredStudents.entries()) {
  console.log(`- ${s.name} (${roll}) | Branch: ${s.branch || 'N/A'} | Folder: ${s.folder_id || s.year || 'N/A'}`);
}
