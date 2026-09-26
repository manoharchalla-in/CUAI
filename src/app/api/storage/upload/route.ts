import { NextResponse } from 'next/server';
import { uploadToSupabaseStorage } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToSupabaseStorage(
      buffer,
      file.name,
      file.type || 'application/octet-stream',
      folder
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });
  } catch (error: any) {
    console.error('Storage upload route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error during upload' }, { status: 500 });
  }
}
