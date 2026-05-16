import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class GatewayInternalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expectedSecret = process.env.INTERNAL_GATEWAY_SECRET;

    // SECURITY: If INTERNAL_GATEWAY_SECRET is not configured, this is a critical misconfiguration
    // Fail-safe is to block ALL requests (throw error) instead of allowing all
    if (!expectedSecret) {
      console.error(
        '🔴 CRITICAL: INTERNAL_GATEWAY_SECRET is not configured. All internal requests will be blocked.',
      );
      throw new ForbiddenException('Internal service not properly configured');
    }

    const request = context.switchToHttp().getRequest();
    const providedSecret = request.headers['x-gateway-secret'];

    if (providedSecret !== expectedSecret) {
      throw new ForbiddenException('Request harus melalui API Gateway');
    }

    return true;
  }
}
