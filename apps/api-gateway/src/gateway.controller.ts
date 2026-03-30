import { Controller, Get, Req } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import type { Request } from 'express';

@Controller()
export class GatewayController {
  /**
   * Public health-check endpoint.
   * No JWT required — useful for Docker health checks and uptime monitoring.
   */
  @Public()
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Returns the authenticated user's info extracted from the JWT.
   * Useful for frontend to verify the token and display user roles.
   * Requires a valid JWT token (protected by global JwtAuthGuard).
   */
  @Get('auth/me')
  getMe(@Req() req: Request) {
    const user = (req as any).user;
    return {
      userId: user.sub,
      username: user.username,
      roles: user.roles,
    };
  }
}
