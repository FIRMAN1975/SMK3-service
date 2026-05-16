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
import { AuthUser } from './auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Skip kalau public
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    // Ambil role requirement
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Tidak ada @Roles → cukup authenticated
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthUser | undefined = request.user;

    // Defensive
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // 🔥 PENTING: pakai roles hasil normalisasi dari JwtStrategy
    const userRoles = user.roles ?? [];

    const hasRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRole) {
      this.logger.warn(
        `Access denied for "${user.username}" ` +
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