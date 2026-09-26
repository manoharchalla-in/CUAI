import { NextResponse } from 'next/server';
import { updateUser, deleteUser, updateAdmin, deleteAdmin, getUserById, getAdminById } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, status, role, password } = body;

    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (status) {
      if (status !== 'active' && status !== 'suspended') {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updates.status = status;
    }
    if (role) updates.role = role;
    if (password && password.trim()) {
      updates.password_hash = await bcrypt.hash(password, 10);
    }

    // Try updating user first
    let updated: any = updateUser(id, updates);
    if (!updated) {
      // Try updating admin
      updated = updateAdmin(id, updates);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        status: updated.status || 'active',
        role: updated.role,
        created_at: updated.created_at
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    let success = deleteUser(id);
    if (!success) {
      success = deleteAdmin(id);
    }

    if (!success) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
