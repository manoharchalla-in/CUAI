import { getClientIp } from './rate-limit';
import { logAuditEvent as dbLogAuditEvent } from './db';
import type { AuditLogEntry } from './db/schema';

export interface AuditContext {
  req?: Request;
  actor?: {
    id?: string;
    username?: string;
    role?: string;
  };
  action: string;
  target?: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  status?: 'success' | 'failure' | 'warning';
}

/**
 * Record an enriched audit log entry with network metadata
 */
export function recordAuditLog(context: AuditContext): AuditLogEntry {
  const req = context.req;
  const ip = req ? getClientIp(req) : '127.0.0.1';
  const userAgent = req?.headers.get('user-agent') || 'system';

  const detailsPayload: Record<string, any> = {
    ...(context.details || {}),
    status: context.status || 'success',
    userAgent: userAgent.slice(0, 200),
    timestamp: new Date().toISOString(),
  };

  if (context.actor) {
    detailsPayload.actor = context.actor;
  }

  const actorName = context.actor?.username || context.actor?.id || 'system';
  const entityType = context.entity_type || 'system';
  const entityId = context.entity_id || context.target || 'system';

  return dbLogAuditEvent(
    actorName,
    context.action,
    entityType,
    entityId,
    JSON.stringify(detailsPayload),
    undefined,
    undefined,
    ip
  );
}
