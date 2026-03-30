import { All, Controller, Req, Res, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@app/common';

/** Service targets */
const TARGETS: Record<string, string> = {
  pelanggaran: process.env.SERVICE_PELANGGARAN_URL || 'http://localhost:3001',
  profile:     process.env.SERVICE_PROFILE_URL     || 'http://localhost:3002',
  berita:      process.env.SERVICE_BERITA_URL      || 'http://localhost:3003',
  portofolio:  process.env.SERVICE_PORTOFOLIO_URL  || 'http://localhost:3004',
  management:  process.env.SERVICE_MANAGEMENT_URL  || 'http://localhost:3005',
};

@Controller('api')
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  /* ── pelanggaran ── admin & guru only */
  @All('pelanggaran/*path')
  @Roles(Role.ADMIN, Role.GURU)
  proxyPelanggaran(@Req() req: Request, @Res() res: Response) {
    return this.forward('pelanggaran', req, res);
  }

  /* ── profile ── all authenticated roles */
  @All('profile/*path')
  @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
  proxyProfile(@Req() req: Request, @Res() res: Response) {
    return this.forward('profile', req, res);
  }

  /* ── berita ── all authenticated roles */
  @All('berita/*path')
  @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
  proxyBerita(@Req() req: Request, @Res() res: Response) {
    return this.forward('berita', req, res);
  }

  /* ── portofolio ── all authenticated roles */
  @All('portofolio/*path')
  @Roles(Role.ADMIN, Role.GURU, Role.SISWA)
  proxyPortofolio(@Req() req: Request, @Res() res: Response) {
    return this.forward('portofolio', req, res);
  }

  /* ── management ── admin only */
  @All('management/*path')
  @Roles(Role.ADMIN)
  proxyManagement(@Req() req: Request, @Res() res: Response) {
    return this.forward('management', req, res);
  }

  /** Build proxy, inject user headers, forward request */
  private forward(service: string, req: Request, res: Response) {
    const target = TARGETS[service];
    const user = (req as any).user;

    this.logger.log(
      `→ [${req.method}] /api/${service}${req.url} | user=${user?.username} roles=[${user?.roles}]`,
    );

    const opts: Options = {
      target,
      changeOrigin: true,
      pathRewrite: { [`^/api/${service}`]: '' },
      on: {
        proxyReq: (proxyReq) => {
          if (user) {
            proxyReq.setHeader('X-User-Id', user.sub ?? '');
            proxyReq.setHeader('X-User-Name', user.username ?? '');
            proxyReq.setHeader('X-User-Roles', (user.roles ?? []).join(','));
          }
        },
        error: (_err, _req, proxyRes: any) => {
          this.logger.error(`Service "${service}" (${target}) unavailable`);
          proxyRes.status(502).json({
            statusCode: 502,
            message: `Service tidak tersedia: ${service}`,
          });
        },
      },
    };

    return createProxyMiddleware(opts)(req, res, () => {});
  }
}