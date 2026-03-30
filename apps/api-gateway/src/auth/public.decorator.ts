import { SetMetadata } from '@nestjs/common';

/**
 * Mark a route as public — skips JWT authentication and role checks.
 * Use this for health checks, public endpoints, etc.
 *
 * @example
 * @Public()
 * @Get('health')
 * healthCheck() { return { status: 'ok' }; }
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
