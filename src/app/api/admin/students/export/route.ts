import { NextResponse } from 'next/server';
import { getAllStudents, getStudentsByFolder } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');
    const format = searchParams.get('format') || 'json';

    let records = [];
    if (folderId && folderId !== 'all') {
      const res = getStudentsByFolder(folderId, '', 5000, 0);
      records = res.records;
    } else {
      const res = getAllStudents('', 'all', 5000, 0);
      records = res.records;
    }

    if (format === 'csv') {
      const headers = ['ID', 'Year', 'Name', 'Roll Number', 'Branch', 'Section', 'Email', 'Phone', 'College', 'Skills', 'Address', 'Profile Info', 'Created At'];
      const rows = records.map(r => [
        `"${r.id}"`,
        `"${r.year}"`,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${(r.roll_number || '').replace(/"/g, '""')}"`,
        `"${(r.branch || '').replace(/"/g, '""')}"`,
        `"${(r.section || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${(r.college || '').replace(/"/g, '""')}"`,
        `"${(r.skills || '').replace(/"/g, '""')}"`,
        `"${(r.address || '').replace(/"/g, '""')}"`,
        `"${(r.profile_info || '').replace(/"/g, '""')}"`,
        `"${r.created_at}"`,
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\n');
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="students_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ records });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export records' }, { status: 500 });
  }
}
