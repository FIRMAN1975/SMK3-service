import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Role } from '@app/common';

/**
 * Global roles guard.
 * Checks if the authenticated user has at least one of the required roles.
 * Skips check if:
 *   - Route is marked @Public()
 *   - Route has no @Roles() decorator (any authenticated user can access)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Skip role check for public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // Read roles from @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() on this route → any authenticated user can access
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // Get user from request (populated by JwtStrategy)
    const { user } = context.switchToHttp().getRequest();
    const userRoles: string[] = user?.realm_access?.roles ?? [];

    // Check if user has at least one required role
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      this.logger.warn(
        `Access denied for user "${user?.username}" ` +
          `(roles: [${userRoles.join(', ')}]) — ` +
          `required: [${requiredRoles.join(', ')}]`,
      );
      throw new ForbiddenException(
        `Akses ditolak. Diperlukan salah satu role: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}