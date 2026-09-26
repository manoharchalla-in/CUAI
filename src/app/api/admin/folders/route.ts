import { NextResponse } from 'next/server';
import { getAllFolders, createFolder } from '@/lib/db';

export async function GET() {
  try {
    const folders = getAllFolders();
    return NextResponse.json({ folders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, year_label, description, is_form_active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const newFolder = createFolder({
      name: name.trim(),
      year_label: year_label?.trim() || name.trim(),
      description: description?.trim() || `${name} Intake Records`,
      is_form_active: is_form_active !== undefined ? (is_form_active ? 1 : 0) : 1
    });

    return NextResponse.json({
      success: true,
      message: `Folder "${newFolder.name}" created successfully with default form fields`,
      folder: newFolder
    });
  } catch (error: any) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}

