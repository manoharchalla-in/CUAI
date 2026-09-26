import { NextResponse } from 'next/server';
import { getStudentById, updateStudentRecord, deleteStudentRecord } from '@/lib/db';
import { uploadBase64ToSupabase } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = getStudentById(id);
  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }
  return NextResponse.json({ student });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();

    // If profile_image is updated to new base64 image, upload to Supabase
    if (data.profile_image && data.profile_image.startsWith('data:')) {
      try {
        const uploadResult = await uploadBase64ToSupabase(data.profile_image, data.roll_number || id, 'student-photos');
        if (uploadResult.success && uploadResult.url) {
          data.profile_image = uploadResult.url;
        }
      } catch (uploadErr) {
        console.warn('Student photo update Supabase upload warning:', uploadErr);
      }
    }

    const updated = updateStudentRecord(id, data);
    if (!updated) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, student: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = deleteStudentRecord(id);
    if (!success) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Student record deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
