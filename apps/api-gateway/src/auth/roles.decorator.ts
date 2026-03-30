import { SetMetadata } from '@nestjs/common';
import { Role } from '@app/common';

/**
 * Decorator to restrict route access to specific Keycloak realm roles.
 *
 * @example
 * @Roles(Role.ADMIN, Role.GURU)
 * @Get('violations')
 * getViolations() { ... }
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);