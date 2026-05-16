import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, AuthUser } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwksUri = configService.get<string>('KEYCLOAK_JWKS_URL');
    const issuer = configService.get<string>('KEYCLOAK_ISSUER');
    const clientId = configService.get<string>('KEYCLOAK_CLIENT_ID');

    if (!jwksUri || !issuer || !clientId) {
      throw new Error(
        'Missing KEYCLOAK config: KEYCLOAK_JWKS_URL / KEYCLOAK_ISSUER / KEYCLOAK_CLIENT_ID',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      // JWKS (auto key-rotation)
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),  

      issuer,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    // Minimal integrity check
    if (!payload?.sub || !payload?.preferred_username) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');
    if (!clientId) {
      throw new UnauthorizedException('Client ID not configured');
    }

    const audiences = Array.isArray(payload.aud)
      ? payload.aud
      : payload.aud
        ? [payload.aud]
        : [];

    if (payload.azp !== clientId && !audiences.includes(clientId)) {
      throw new UnauthorizedException('Invalid token client');
    }

    // Ambil client roles (jika ada)
    const clientRoles =
      payload.resource_access?.[clientId]?.roles ?? [];

    // 🔥 Merge + deduplicate roles (realm + client)
    const roles = Array.from(
      new Set([
        ...(payload.realm_access?.roles ?? []),
        ...clientRoles,
      ]),
    );

    // 🔥 Return normalized user (SINGLE SOURCE OF TRUTH)
    return {
      sub: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles,
    };
  }
}
