import { 
  findStudentsByName, 
  findStudentByRollNumber, 
  searchStudentsMultiField, 
  getAllStudents,
  logSearchQuery,
  type StudentRecord 
} from '../db';
import { formatYearLabel } from '../utils';

export interface RAGResponse {
  answer: string;
  found: boolean;
  matchedStudents: StudentRecord[];
  isDisambiguation?: boolean;
  queryType: 'exact_student' | 'disambiguation' | 'not_found' | 'list_query' | 'general';
}

/**
 * Clean and extract key entities from user questions
 */
function extractEntities(query: string) {
  const cleanQuery = query.trim();

  // 1. Check for roll numbers / registration numbers (e.g. 23CSE001, 24ECE042, 26HT1A4301, 23CSE999)
  const rollMatch = cleanQuery.match(/\b([0-9]{2}[A-Za-z0-9]{6,12}|[0-9]{2}[A-Za-z]{2,5}[0-9]{2,4})\b/i);
  const rollNumber = rollMatch ? rollMatch[1] : null;

  // 2. Strip common query filler words to extract potential student names
  let extractedName = cleanQuery
    .replace(/^who\s+is\s+/i, '')
    .replace(/^tell\s+me\s+about\s+/i, '')
    .replace(/^give\s+me\s+/i, '')
    .replace(/^give\s+/i, '')
    .replace(/^what\s+is\s+/i, '')
    .replace(/^what\s+are\s+/i, '')
    .replace(/^which\s+year\s+is\s+/i, '')
    .replace(/^what\s+branch\s+is\s+/i, '')
    .replace(/^where\s+does\s+/i, '')
    .replace(/['’]s\b/gi, '')
    .replace(/\b(details|student\s+details|student|info|information|skills|skill|blood\s*group|blood|phone|address|marks|parents|father|mother|hobbies|hobby|sports|sport|branch|college|admission|studying|live|in)\b/gi, '')
    .replace(/[?!.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return { rollNumber, extractedName, originalQuery: cleanQuery };
}

/**
 * Formats a single student record as a clean, structured profile adhering to all 20+ fields
 */
export function formatStudentRecord(student: StudentRecord, specificField?: string): string {
  const yearLabel = formatYearLabel(student.year);

  // Field-specific query responses
  if (specificField === 'skills') {
    return `**${student.name}**'s technical skills are:\n\n` +
      `* **Skills**: ${student.skills || 'Not specified'}\n` +
      `* **Branch**: ${student.branch} (${yearLabel})`;
  }

  if (specificField === 'blood_group') {
    return `**${student.name}**'s blood group is **${student.blood_group || 'Not specified'}** (Regd. No: ${student.roll_number}).`;
  }

  if (specificField === 'parents' || specificField === 'father' || specificField === 'mother') {
    return `Parent details for **${student.name}** (${student.roll_number}):\n\n` +
      (student.father_name ? `* **Father's Name**: ${student.father_name}${student.father_occupation ? ` (${student.father_occupation})` : ''}\n` : '') +
      (student.mother_name ? `* **Mother's Name**: ${student.mother_name}${student.mother_occupation ? ` (${student.mother_occupation})` : ''}\n` : '');
  }

  if (specificField === 'address') {
    return `Address details for **${student.name}** (${student.roll_number}):\n\n` +
      (student.permanent_address ? `* **Permanent Address**: ${student.permanent_address}${student.permanent_pincode ? ` - ${student.permanent_pincode}` : ''}\n` : '') +
      (student.present_address ? `* **Present Address**: ${student.present_address}${student.present_pincode ? ` - ${student.present_pincode}` : ''}\n` : '') +
      (student.permanent_phone ? `* **Phone No**: ${student.permanent_phone}\n` : '');
  }

  if (specificField === 'hobbies' || specificField === 'sports' || specificField === 'extracurricular') {
    return `Activities & Interests for **${student.name}**:\n\n` +
      (student.hobbies ? `* **Hobbies**: ${student.hobbies}\n` : '') +
      (student.sports ? `* **Sports Interested**: ${student.sports}\n` : '') +
      (student.extracurricular ? `* **Extra-curricular Activities**: ${student.extracurricular}\n` : '') +
      (student.achievements ? `* **Achievements**: ${student.achievements}\n` : '');
  }

  if (specificField === 'academic_record') {
    return `Academic History for **${student.name}**:\n\n` +
      (student.ssc_marks || student.previous_marks_obtained ? `* **SSC Marks**: ${student.ssc_marks || student.previous_marks_obtained}\n` : '') +
      (student.ssc_hall_ticket_no || student.previous_sno ? `* **SSC Hall Ticket No.**: ${student.ssc_hall_ticket_no || student.previous_sno}\n` : '') +
      (student.intermediate_marks || student.previous_marks_obtained ? `* **Intermediate Marks**: ${student.intermediate_marks || student.previous_marks_obtained}\n` : '') +
      (student.intermediate_hall_ticket_no || student.previous_sno ? `* **Intermediate Hall Ticket Number**: ${student.intermediate_hall_ticket_no || student.previous_sno}\n` : '') +
      (student.previous_course ? `* **Course of Study**: ${student.previous_course}\n` : '');
  }

  if (specificField === 'year') {
    return `**${student.name}** is currently studying in **${yearLabel}** (${student.branch} branch).`;
  }

  if (specificField === 'branch') {
    return `**${student.name}** is in the **${student.branch}** branch (${yearLabel}).`;
  }

  if (specificField === 'college') {
    return `**${student.name}** studies at **${student.college}** (${yearLabel}, ${student.branch}).`;
  }

  // Full Standard Profile
  let profile = `### 🎓 Student Details\n` +
    `* **Name of the Student**: ${student.name}\n` +
    `* **Regd. No.**: ${student.roll_number}\n` +
    `* **Year / Branch**: ${yearLabel} — ${student.branch} ${student.section ? `(Section ${student.section})` : ''}\n` +
    (student.admission_type ? `* **Type of Admission**: ${student.admission_type}\n` : '') +
    (student.dob ? `* **Date of Birth**: ${student.dob}\n` : '') +
    (student.blood_group ? `* **Blood Group**: ${student.blood_group}\n` : '') +
    (student.aadhaar_no ? `* **Aadhaar No.**: ${student.aadhaar_no}\n` : '') +
    (student.reservation_category ? `* **Reservation Category**: ${student.reservation_category}\n` : '') +
    (student.mode_of_transport ? `* **Mode of Transport**: ${student.mode_of_transport}\n` : '') +
    (student.accommodation_type ? `* **Type of Accommodation**: ${student.accommodation_type}\n` : '') +
    (student.father_name ? `* **Father's Name**: ${student.father_name}${student.father_occupation ? ` (${student.father_occupation})` : ''}\n` : '') +
    (student.mother_name ? `* **Mother's Name**: ${student.mother_name}${student.mother_occupation ? ` (${student.mother_occupation})` : ''}\n` : '');

  profile += `\n### 📍 Address & Contact\n` +
    `* **E-mail ID**: ${student.email}\n` +
    (student.permanent_phone || student.phone ? `* **Phone No.**: ${student.permanent_phone || student.phone}\n` : '') +
    (student.present_phone ? `* **Present Phone No.**: ${student.present_phone}\n` : '') +
    (student.permanent_address ? `* **Permanent Address**: ${student.permanent_address}${student.permanent_pincode ? ` (${student.permanent_pincode})` : ''}\n` : '') +
    (student.present_address ? `* **Present Address**: ${student.present_address}${student.present_pincode ? ` (${student.present_pincode})` : ''}\n` : '');

  if (student.ssc_marks || student.intermediate_marks || student.ssc_hall_ticket_no || student.intermediate_hall_ticket_no || student.previous_marks_obtained) {
    profile += `\n### 📚 Academic History (SSC & Intermediate)\n` +
      (student.ssc_marks || student.previous_marks_obtained ? `* **SSC Marks**: ${student.ssc_marks || student.previous_marks_obtained}\n` : '') +
      (student.ssc_hall_ticket_no || student.previous_sno ? `* **SSC Hall Ticket No.**: ${student.ssc_hall_ticket_no || student.previous_sno}\n` : '') +
      (student.intermediate_marks || student.previous_marks_obtained ? `* **Intermediate Marks**: ${student.intermediate_marks || student.previous_marks_obtained}\n` : '') +
      (student.intermediate_hall_ticket_no || student.previous_sno ? `* **Intermediate Hall Ticket Number**: ${student.intermediate_hall_ticket_no || student.previous_sno}\n` : '');
  }

  if (student.skills || student.achievements || student.extracurricular || student.hobbies || student.sports) {
    profile += `\n### 🌟 Other Information & Interests\n` +
      (student.skills ? `* **Technical Skills**: ${student.skills}\n` : '') +
      (student.achievements ? `* **Achievements**: ${student.achievements}\n` : '') +
      (student.extracurricular ? `* **Extra-curricular Activities**: ${student.extracurricular}\n` : '') +
      (student.hobbies ? `* **Hobbies**: ${student.hobbies}\n` : '') +
      (student.sports ? `* **Sports Interested**: ${student.sports}\n` : '');
  }

  return profile;
}

/**
 * Main RAG retrieval & response generator
 */
export function processChatQuery(query: string, userId?: string): RAGResponse {
  const q = query.trim();
  const lowerQ = q.toLowerCase();

  // 1. Direct Roll Number / Regd No Lookup
  const { rollNumber, extractedName } = extractEntities(q);
  if (rollNumber) {
    const student = findStudentByRollNumber(rollNumber);
    if (student) {
      logSearchQuery(
        `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        q,
        1,
        [student.id],
        'roll_lookup'
      );
      return {
        answer: formatStudentRecord(student),
        found: true,
        matchedStudents: [student],
        queryType: 'exact_student'
      };
    }
  }

  // 2. Specific field detection in query
  let specificField: string | undefined = undefined;
  if (lowerQ.includes('skill')) specificField = 'skills';
  else if (lowerQ.includes('blood group') || lowerQ.includes('blood')) specificField = 'blood_group';
  else if (lowerQ.includes('father') || lowerQ.includes('mother') || lowerQ.includes('parent')) specificField = 'parents';
  else if (lowerQ.includes('address') || lowerQ.includes('where does') || lowerQ.includes('location') || lowerQ.includes('phone')) specificField = 'address';
  else if (lowerQ.includes('hobby') || lowerQ.includes('hobbies') || lowerQ.includes('sport') || lowerQ.includes('achievement') || lowerQ.includes('extracurricular')) specificField = 'hobbies';
  else if (lowerQ.includes('previous') || lowerQ.includes('10th') || lowerQ.includes('inter') || lowerQ.includes('diploma') || lowerQ.includes('marks')) specificField = 'academic_record';
  else if (lowerQ.includes('which year') || lowerQ.includes('what year')) specificField = 'year';
  else if (lowerQ.includes('what branch') || lowerQ.includes('which branch')) specificField = 'branch';
  else if (lowerQ.includes('college') || lowerQ.includes('institute')) specificField = 'college';

  // 3. Name Match Retrieval
  if (extractedName && extractedName.length >= 2) {
    const matched = findStudentsByName(extractedName);

    if (matched.length === 1) {
      const student = matched[0];
      logSearchQuery(
        `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        q,
        1,
        [student.id],
        'exact_name'
      );
      return {
        answer: formatStudentRecord(student, specificField),
        found: true,
        matchedStudents: [student],
        queryType: 'exact_student'
      };
    }

    if (matched.length > 1) {
      // Disambiguation
      logSearchQuery(
        `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        q,
        matched.length,
        matched.map(m => m.id),
        'disambiguation'
      );

      let disambiguationText = `I found multiple matching records.\n\n`;
      matched.forEach((s, idx) => {
        disambiguationText += `${idx + 1}. **${s.name}** — ${formatYearLabel(s.year)} ${s.branch} (Regd. No: ${s.roll_number})\n`;
      });
      disambiguationText += `\nWhich one do you want? (You can reply with the Regd. No. or full name)`;

      return {
        answer: disambiguationText,
        found: true,
        matchedStudents: matched,
        isDisambiguation: true,
        queryType: 'disambiguation'
      };
    }
  }

  // 3b. Direct Full-Name Substring Search in Query
  const allStudents = getAllStudents(undefined, undefined, 500, 0).records;
  const directMatches = allStudents.filter(s => lowerQ.includes(s.name.toLowerCase()));
  if (directMatches.length === 1) {
    const student = directMatches[0];
    logSearchQuery(
      `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      q,
      1,
      [student.id],
      'exact_name'
    );
    return {
      answer: formatStudentRecord(student, specificField),
      found: true,
      matchedStudents: [student],
      queryType: 'exact_student'
    };
  }

  // 4. Branch / Year / Multi-field broad search
  const multiMatched = searchStudentsMultiField(q);
  if (multiMatched.length > 0 && !lowerQ.startsWith('who is') && !lowerQ.startsWith('tell me about')) {
    logSearchQuery(
      `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      q,
      multiMatched.length,
      multiMatched.map(m => m.id),
      'multi_search'
    );

    if (multiMatched.length === 1) {
      return {
        answer: formatStudentRecord(multiMatched[0], specificField),
        found: true,
        matchedStudents: multiMatched,
        queryType: 'exact_student'
      };
    }

    let listText = `I found **${multiMatched.length}** matching student record${multiMatched.length > 1 ? 's' : ''}:\n\n`;
    multiMatched.forEach((s, idx) => {
      listText += `${idx + 1}. **${s.name}** (Regd: \`${s.roll_number}\`) — ${formatYearLabel(s.year)} ${s.branch}${s.skills ? ` | Skills: *${s.skills}*` : ''}\n`;
    });
    listText += `\n*Ask for any student's name or Regd. No. to view full details.*`;

    return {
      answer: listText,
      found: true,
      matchedStudents: multiMatched,
      queryType: 'list_query'
    };
  }

  // 5. Unknown student check (Zero-Hallucination Guardrail)
  if (
    lowerQ.startsWith('who is') || 
    lowerQ.startsWith('tell me about') || 
    lowerQ.includes('details') || 
    lowerQ.includes('student') ||
    (extractedName && extractedName.length >= 3)
  ) {
    const targetName = extractedName || q;
    logSearchQuery(
      `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      q,
      0,
      [],
      'failed_search'
    );

    return {
      answer: `I couldn't find a student named **${targetName}** in the available records.\n\nPlease check the spelling or ask the administrator to register this student in the appropriate Year Folder.`,
      found: false,
      matchedStudents: [],
      queryType: 'not_found'
    };
  }

  // 6. General Conversation / Help Queries
  if (lowerQ.includes('hello') || lowerQ.includes('hi') || lowerQ.includes('hey') || lowerQ === 'help') {
    return {
      answer: `Hello! I am your AI Student Assistant.\n\nYou can ask me about any registered student by Name, Regd. No., Department, Parents, Blood Group, or Skills.\n\n**Examples you can try:**\n* \`Sai\` or \`Who is Sai?\`\n* \`23CSE001\`\n* \`What is Sai's blood group?\`\n* \`Who is Sai's father?\`\n* \`Where does Sai live?\`\n* \`What are Sai's hobbies and sports?\`\n* \`Show 3rd year students\`\n\nHow can I help you today?`,
      found: true,
      matchedStudents: [],
      queryType: 'general'
    };
  }

  // General unknown fallback
  logSearchQuery(
    `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    q,
    0,
    [],
    'unknown_query'
  );

  return {
    answer: `I couldn't find that information in the available student data.\n\nYou can search by **Student Name**, **Regd. No.** (e.g. \`23CSE001\`), **Year** (e.g. \`3rd Year\`), or **Skills** (e.g. \`Java\`).`,
    found: false,
    matchedStudents: [],
    queryType: 'not_found'
  };
}
