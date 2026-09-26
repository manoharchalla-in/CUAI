import { NextResponse } from 'next/server';
import { getFolderBySlug, getFormConfigsByFolder, saveFormConfigs } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const folder = getFolderBySlug(slug);
  if (!folder) {
    return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
  }

  const configs = getFormConfigsByFolder(folder.id);
  return NextResponse.json({ configs });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const folder = getFolderBySlug(slug);
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const { configs } = await req.json();
    if (!Array.isArray(configs)) {
      return NextResponse.json({ error: 'Configs must be an array' }, { status: 400 });
    }

    saveFormConfigs(folder.id, configs);
    const updated = getFormConfigsByFolder(folder.id);

    return NextResponse.json({ success: true, configs: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save form configurations' }, { status: 500 });
  }
}
