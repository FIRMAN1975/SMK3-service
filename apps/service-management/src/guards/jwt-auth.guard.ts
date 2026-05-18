import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export interface JwtPayload {
  sub?: string;
  userId?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan. Sertakan header Authorization: Bearer <token>');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, { secret });
      // userId bisa ada di payload.userId atau payload.sub
      payload.userId = payload.userId ?? payload.sub;
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token tidak valid atau sudah kadaluarsa');
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
