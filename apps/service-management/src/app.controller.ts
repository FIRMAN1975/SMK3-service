import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      message: 'Service Management siap',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('docs')
  getDocs() {
    return {
      name: 'Service Management API',
      version: '1.0.0',
      description: 'Backend Nest.js untuk data guru dan siswa',
      endpoints: {
        guru: [
          'GET /guru',
          'GET /guru/search',
          'GET /guru/total',
          'GET /guru/:id',
          'POST /guru',
          'PUT /guru/:id',
          'DELETE /guru/:id',
        ],
        siswa: [
          'GET /siswa',
          'GET /siswa/search',
          'GET /siswa/stats',
          'GET /siswa/export',
          'GET /siswa/:id',
          'POST /siswa',
          'PUT /siswa/:id',
          'DELETE /siswa/:id',
          'GET /siswa/:id/download/:type',
          'POST /siswa/:id/upload/:type',
        ],
      },
    };
  }
}