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

  @Get('api/docs')
  getApiDocs() {
    return {
      name: 'Berita & Informasi Sekolah API',
      version: '1.0.0',
      description: 'Backend API untuk aplikasi berita dan informasi sekolah',
      endpoints: {
        news: {
          '/api/news': 'GET/POST - Kelola berita',
          '/api/news/featured/list': 'GET - Berita unggulan',
          '/api/news/recent/list': 'GET - Berita terbaru',
          '/api/news/search/query': 'GET - Cari berita',
          '/api/news/slug/:slug': 'GET - Berita berdasarkan slug',
          '/api/news/:id': 'GET/PUT/DELETE - Berita spesifik',
        },
        categories: {
          '/api/categories': 'GET/POST - Kategori berita',
          '/api/categories/:id': 'GET/PUT/DELETE - Kategori spesifik',
        },
        announcements: {
          '/api/announcements': 'GET/POST - Pengumuman',
          '/api/announcements/type/:type': 'GET - Pengumuman berdasarkan tipe',
          '/api/announcements/active/list': 'GET - Pengumuman aktif',
          '/api/announcements/not-expired/list': 'GET - Pengumuman belum kadaluarsa',
          '/api/announcements/:id': 'GET/PUT/DELETE - Pengumuman spesifik',
        },
        contacts: {
          '/api/contacts': 'GET/POST - Kontak sekolah',
          '/api/contacts/type/:type': 'GET - Kontak berdasarkan tipe',
          '/api/contacts/:id': 'GET/PUT/DELETE - Kontak spesifik',
        },
        search: {
          '/api/search': 'GET - Cari semua (berita & pengumuman)',
          '/api/search/news': 'GET - Cari berita',
          '/api/search/announcements': 'GET - Cari pengumuman',
        },
      },
    };
  }
}

