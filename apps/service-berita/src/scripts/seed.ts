import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CategoryService } from '../services/category.service';
import { ContactService } from '../services/contact.service';
import { AnnouncementService } from '../services/announcement.service';
import { ContactType } from '../entities/contact.entity';
import { AnnouncementType } from '../entities/announcement.entity';

async function seed() {
  const app = await NestFactory.create(AppModule);

  const categoryService = app.get(CategoryService);
  const contactService = app.get(ContactService);
  const announcementService = app.get(AnnouncementService);

  console.log('🌱 Mulai seed database...');

  try {
    // Seed Categories
    console.log('📂 Membuat kategori...');
    const categories = await Promise.all([
      categoryService.create({
        name: 'Berita Umum',
        description: 'Berita umum sekolah',
        color: '#3b82f6',
        order: 1,
      }),
      categoryService.create({
        name: 'Akademik',
        description: 'Berita terkait akademik',
        color: '#ef4444',
        order: 2,
      }),
      categoryService.create({
        name: 'Ekstrakurikuler',
        description: 'Kegiatan ekstrakurikuler',
        color: '#10b981',
        order: 3,
      }),
      categoryService.create({
        name: 'Pengumuman Penting',
        description: 'Pengumuman yang perlu diperhatikan',
        color: '#f59e0b',
        order: 4,
      }),
    ]);

    console.log('✅ Kategori berhasil dibuat');

    // Seed Contacts
    console.log('📞 Membuat kontak sekolah...');
    await Promise.all([
      contactService.create({
        label: 'Telepon',
        type: ContactType.PHONE,
        value: '+62 274 (588) 783',
        icon: 'phone',
        order: 1,
      }),
      contactService.create({
        label: 'Email',
        type: ContactType.EMAIL,
        value: 'info@sekolah.ac.id',
        icon: 'mail',
        order: 2,
      }),
      contactService.create({
        label: 'Alamat',
        type: ContactType.ADDRESS,
        value: 'Jl. Diponegoro No. 25, Yogyakarta 55143',
        icon: 'map-pin',
        order: 3,
      }),
      contactService.create({
        label: 'Website',
        type: ContactType.WEBSITE,
        value: 'https://www.sekolah.ac.id',
        icon: 'globe',
        order: 4,
      }),
      contactService.create({
        label: 'Facebook',
        type: ContactType.SOCIAL_MEDIA,
        value: 'https://facebook.com/sekolah',
        icon: 'facebook',
        order: 5,
      }),
      contactService.create({
        label: 'Instagram',
        type: ContactType.SOCIAL_MEDIA,
        value: 'https://instagram.com/sekolah',
        icon: 'instagram',
        order: 6,
      }),
    ]);

    console.log('✅ Kontak berhasil dibuat');

    // Seed Announcements
    console.log('📢 Membuat pengumuman...');
    await Promise.all([
      announcementService.create({
        title: 'Pengumuman: Libur Semester Genap',
        content:
          'Pengumuman libur semester genap tahun ajaran 2024/2025 dimulai pada tanggal 20 Desember 2024 hingga 7 Januari 2025.',
        type: AnnouncementType.PENTING,
        author: 'Administrator',
      }),
      announcementService.create({
        title: 'Ujian Akhir Semester akan dilaksanakan',
        content:
          'Ujian Akhir Semester untuk semua kelas akan dilaksanakan mulai tanggal 16 Desember 2024. Siswa diminta mempersiapkan diri dengan baik.',
        type: AnnouncementType.PENTING,
        author: 'Administrator',
      }),
      announcementService.create({
        title: 'Pengumuman Pengambilan Raport',
        content:
          'Pengambilan raport semester ganjil dapat diambil pada tanggal 20-24 November 2024 di ruang administrasi.',
        type: AnnouncementType.BIASA,
        author: 'TU',
      }),
      announcementService.create({
        title: 'URGENT: Pertemuan Orang Tua Murid Besok',
        content:
          'Ada perubahan jadwal pertemuan orang tua murid menjadi hari Jumat, 15 November 2024 pukul 14:00 WIB. Dihadiri oleh orang tua dan guru kelas.',
        type: AnnouncementType.SANGAT_PENTING,
        author: 'Kepala Sekolah',
      }),
    ]);

    console.log('✅ Pengumuman berhasil dibuat');

    console.log('✅ Database seed berhasil dilakukan!');
  } catch (error) {
    console.error('❌ Error saat seeding:', error);
  }

  await app.close();
}

seed();
