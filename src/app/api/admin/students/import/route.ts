import { NextResponse } from 'next/server';
import { findStudentByRollNumber, insertStudentRecord, getFolderById, getFolderBySlug } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { folder_id, records } = await req.json();

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'Records must be a non-empty array' }, { status: 400 });
    }

    let folder = folder_id ? getFolderById(folder_id) : null;
    let yearKey = folder ? (folder.slug.replace('-', '_') as any) : '1st_year';

    let importedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const item of records) {
      if (!item.name || !item.roll_number || !item.email) {
        skippedCount++;
        errors.push(`Skipped row missing name, roll number, or email: ${JSON.stringify(item)}`);
        continue;
      }

      const existing = findStudentByRollNumber(item.roll_number.toString().trim());
      if (existing) {
        skippedCount++;
        errors.push(`Roll number ${item.roll_number} already exists`);
        continue;
      }

      const itemYear = item.year ? (item.year.includes('year') ? item.year : `${item.year}_year`) : yearKey;
      const targetFolderId = folder ? folder.id : (itemYear.includes('1st') ? 'folder_1st_year' : itemYear.includes('2nd') ? 'folder_2nd_year' : itemYear.includes('3rd') ? 'folder_3rd_year' : 'folder_4th_year');

      const studentId = `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      insertStudentRecord({
        id: studentId,
        folder_id: targetFolderId,
        year: itemYear,
        name: item.name.toString(),
        roll_number: item.roll_number.toString(),
        branch: item.branch ? item.branch.toString() : 'General',
        section: item.section ? item.section.toString() : '',
        email: item.email.toString(),
        phone: item.phone ? item.phone.toString() : '',
        college: item.college ? item.college.toString() : '',
        skills: item.skills ? item.skills.toString() : '',
        address: item.address ? item.address.toString() : '',
        profile_info: item.profile_info ? item.profile_info.toString() : '',
        custom_fields_json: '{}',
      });
      importedCount++;
    }

    return NextResponse.json({
      success: true,
      importedCount,
      skippedCount,
      errors
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import student records' }, { status: 500 });
  }
}
