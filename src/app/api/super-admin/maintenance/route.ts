import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { 
  loadDatabase, 
  getMaintenanceSettings, 
  updateMaintenanceSettings, 
  setUserMaintenanceStatus,
  logAuditEvent 
} from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser('superadmin');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden: Super Administrator privileges required' }, { status: 403 });
    }

    const db = loadDatabase();
    const globalConfig = getMaintenanceSettings();

    // Map chatbot users
    const chatbotUsers = (db.users || []).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: 'user',
      roleLabel: 'Chatbot Student',
      status: u.status || 'active',
      created_at: u.created_at
    }));

    // Map admin panel accounts
    const adminAccounts = (db.admins || []).map(a => ({
      id: a.id,
      name: a.name,
      email: a.email,
      role: a.role,
      roleLabel: a.role === 'superadmin' ? 'Super Administrator' : 'Campus Admin',
      status: a.status || 'active',
      created_at: a.created_at
    }));

    return NextResponse.json({
      success: true,
      global: globalConfig,
      chatbotUsers,
      adminAccounts,
      allAccounts: [...adminAccounts, ...chatbotUsers]
    });
  } catch (error: any) {
    console.error('Error fetching maintenance settings:', error);
    return NextResponse.json({ error: 'Failed to fetch maintenance configuration' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser('superadmin');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden: Super Administrator privileges required' }, { status: 403 });
    }

    const body = await req.json();
    const action = body.action || (body.enabled !== undefined ? 'update_global' : '');

    // Action 1: Update Global Maintenance Mode
    if (action === 'update_global') {
      const { enabled, scope, title, message, estimatedEnd } = body;
      const updated = updateMaintenanceSettings({
        enabled: Boolean(enabled),
        scope: scope || 'all',
        title: title || 'Scheduled System Maintenance',
        message: message || 'System undergoing scheduled maintenance and upgrades.',
        estimatedEnd: estimatedEnd || ''
      });

      logAuditEvent(
        'SuperAdmin',
        'UPDATE_GLOBAL_MAINTENANCE',
        'system_settings',
        'global',
        `Global maintenance mode set to ${enabled ? 'ENABLED' : 'DISABLED'} (Scope: ${scope || 'all'})`
      );

      return NextResponse.json({
        success: true,
        message: `Global maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully`,
        global: updated
      });
    }

    // Action 2: Toggle / Set Maintenance Mode for a Specific User or Admin
    if (action === 'set_user_maintenance' || action === 'update_account_status') {
      const targetId = body.id || body.accountId;
      const targetType = (body.accountType || body.accountRole || 'user') === 'user' ? 'user' : 'admin';
      const targetStatus = body.status || 'maintenance';

      if (!targetId) {
        return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
      }

      const updated = setUserMaintenanceStatus(targetId, targetType, targetStatus);
      if (!updated) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }

      logAuditEvent(
        'SuperAdmin',
        targetStatus === 'maintenance' ? 'ENABLE_USER_MAINTENANCE' : 'DISABLE_USER_MAINTENANCE',
        targetType,
        targetId,
        `Account ${updated.name} (${updated.email}) status set to ${targetStatus}`
      );

      return NextResponse.json({
        success: true,
        message: `Account status updated to ${targetStatus}`,
        account: updated
      });
    }

    return NextResponse.json({ error: 'Invalid maintenance action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating maintenance settings:', error);
    return NextResponse.json({ error: 'Failed to update maintenance settings' }, { status: 500 });
  }
}
