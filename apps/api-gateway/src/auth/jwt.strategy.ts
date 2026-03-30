import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 1. Ambil token dari header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Jangan terima token yang sudah expired
      ignoreExpiration: false,

      // 3. Verifikasi signature pakai public key dari Keycloak JWKS
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get<string>('KEYCLOAK_JWKS_URL')!,  // tambah !
      }),

      // 4. Validasi issuer — pastikan token dari Keycloak kita, bukan dari tempat lain
      issuer: configService.get<string>('KEYCLOAK_ISSUER')!,  // tambah !
      algorithms: ['RS256'],   // Keycloak pakai algoritma RS256
    });
  }

  // 5. Kalau token valid, method ini dipanggil — return value masuk ke request.user
  async validate(payload: any) {
    return {
      sub: payload.sub,                          // user ID
      username: payload.preferred_username,       // guru.budi
      roles: payload.realm_access?.roles ?? [],   // ['guru', ...]
      realm_access: payload.realm_access,         // object lengkap untuk RolesGuard
    };
  }
}