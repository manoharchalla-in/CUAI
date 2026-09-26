import { NextResponse } from 'next/server';
import { getFolderBySlug, updateFolder, deleteFolder } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const folder = getFolderBySlug(slug);
  if (!folder) {
    return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
  }
  return NextResponse.json({ folder });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const folder = getFolderBySlug(slug);
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, year_label, description, is_form_active, regenerate_token } = body;

    let newToken: string | undefined = undefined;
    if (regenerate_token) {
      newToken = `token_${slug}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    }

    const updated = updateFolder(folder.id, {
      name: name !== undefined ? name : folder.name,
      year_label: year_label !== undefined ? year_label : folder.year_label,
      description: description !== undefined ? description : folder.description,
      is_form_active: is_form_active !== undefined ? (is_form_active ? 1 : 0) : folder.is_form_active,
      form_token: newToken
    });

    return NextResponse.json({ success: true, folder: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const folder = getFolderBySlug(slug);
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    deleteFolder(folder.id);
    return NextResponse.json({ success: true, message: `Folder "${folder.name}" deleted successfully` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}
