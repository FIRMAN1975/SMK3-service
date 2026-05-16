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
      message: 'Server berjalan dengan sempurna',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('docs')
  getApiDocs() {
    return {
      name: 'Berita & Informasi Sekolah API',
      version: '1.0.0',
      description: 'Backend API untuk aplikasi berita dan informasi sekolah',
      endpoints: {
        berita: {
          'GET /api/berita': 'Daftar berita',
          'POST /api/berita': 'Buat berita baru',
          'GET /api/berita/:id': 'Detail berita',
          'PUT /api/berita/:id': 'Ubah berita',
          'DELETE /api/berita/:id': 'Hapus berita',
        },
        categories: {
          '/api/categories': 'GET/POST - Kategori berita',
          '/api/categories/:id': 'GET/PUT/DELETE - Kategori spesifik',
          '/api/categories/:id/toggle-active': 'PUT - Ubah status aktif',
        },
        pengumuman: {
          '/api/pengumuman': 'GET/POST - Pengumuman',
          '/api/pengumuman/:id': 'GET/PUT/DELETE - Pengumuman spesifik',
          '/api/pengumuman/:id/toggle-active': 'PUT - Ubah status aktif',
        },
        agenda: {
          '/api/agenda': 'GET/POST - Agenda',
          '/api/agenda/:id': 'GET/PUT/DELETE - Agenda spesifik',
          '/api/agenda/:id/toggle-active': 'PUT - Ubah status aktif',
        },
        search: {
          '/api/search': 'GET - Cari semua (berita & pengumuman)',
        },
      },
    };
  }
}

