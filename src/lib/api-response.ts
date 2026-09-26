import { NextResponse } from 'next/server';

export interface ApiResponseEnvelope<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
    durationMs?: number;
  };
}

/**
 * Return a successful standard JSON response envelope
 */
export function apiSuccess<T>(
  data: T,
  meta?: Omit<NonNullable<ApiResponseEnvelope['meta']>, 'timestamp'>,
  status = 200,
  headers?: Record<string, string>
) {
  const envelope: ApiResponseEnvelope<T> = {
    success: true,
    data,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
    },
  };
  return NextResponse.json(envelope, { status, headers });
}

/**
 * Return a standard error JSON response envelope
 */
export function apiError(
  message: string,
  code = 'INTERNAL_SERVER_ERROR',
  status = 500,
  details?: any,
  headers?: Record<string, string>
) {
  const envelope: ApiResponseEnvelope = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  return NextResponse.json(envelope, { status, headers });
}

export function apiBadRequest(message = 'Invalid request parameters', details?: any) {
  return apiError(message, 'BAD_REQUEST', 400, details);
}

export function apiUnauthorized(message = 'Authentication required') {
  return apiError(message, 'UNAUTHORIZED', 401);
}

export function apiForbidden(message = 'Access forbidden: Insufficient permissions') {
  return apiError(message, 'FORBIDDEN', 403);
}

export function apiNotFound(message = 'Requested resource not found') {
  return apiError(message, 'NOT_FOUND', 404);
}

export function apiConflict(message = 'Resource conflict or duplicate entry', details?: any) {
  return apiError(message, 'CONFLICT', 409, details);
}

export function apiRateLimited(retryAfterSeconds = 60, message = 'Too many requests. Please try again later.') {
  return apiError(message, 'RATE_LIMIT_EXCEEDED', 429, { retryAfterSeconds }, {
    'Retry-After': String(retryAfterSeconds),
  });
}
