import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { 
  getMaintenanceSettings, 
  isGlobalMaintenanceActive, 
  isUserUnderMaintenance,
  autoPurge7DayData
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Automatically purge records older than 7 days
    try {
      autoPurge7DayData();
    } catch (e) {}
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope') || undefined;
    const userIdQuery = searchParams.get('userId') || undefined;

    const globalSettings = getMaintenanceSettings();
    const isGlobalActive = isGlobalMaintenanceActive(scope);

    // 1. Super Admin is always exempt from all maintenance locks
    const superAdminUser = await getCurrentUser('superadmin');
    if (superAdminUser && superAdminUser.role === 'superadmin') {
      return NextResponse.json({
        isBlocked: false,
        isGlobalActive,
        userMaintenance: false,
        isSuperAdmin: true,
        globalSettings
      });
    }

    // 2. Resolve role-scoped user based on scope
    let user = null;
    if (scope === 'admin') {
      user = await getCurrentUser('admin');
    } else if (scope === 'chatbot') {
      user = await getCurrentUser('user');
    } else {
      user = await getCurrentUser();
    }

    // 3. Check individual account maintenance status
    let userMaintenance = false;
    if (user && user.status === 'maintenance') {
      userMaintenance = true;
    } else if (userIdQuery && isUserUnderMaintenance(userIdQuery)) {
      userMaintenance = true;
    } else if (user && isUserUnderMaintenance(user.id)) {
      userMaintenance = true;
    }

    const isBlocked = isGlobalActive || userMaintenance;

    return NextResponse.json({
      isBlocked,
      isGlobalActive,
      userMaintenance,
      isSuperAdmin: false,
      globalSettings
    });
  } catch (error: any) {
    console.error('Maintenance check error:', error);
    return NextResponse.json({ isBlocked: false, isGlobalActive: false, isSuperAdmin: false }, { status: 500 });
  }
}
