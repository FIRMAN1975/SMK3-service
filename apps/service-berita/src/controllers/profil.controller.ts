// ============================================================
// CATATAN: File ini berisi controller-controller alias untuk
// endpoint profil sekolah yang dipanggil frontend.
// Karena backend NestJS belum punya service untuk ini,
// kita pakai penyimpanan sederhana dalam memori (in-memory)
// atau kamu bisa tambahkan entity + service baru.
//
// Untuk production, sebaiknya buat entity TypeORM masing-masing.
// ============================================================

import {
  Controller, Get, Post, Put, Delete,
  Body, Param, HttpCode, HttpStatus,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// ─── SEJARAH & IDENTITAS ─────────────────────────────────────
// Karena belum ada service, kita simpan di DB lewat TypeORM langsung
// Untuk sekarang pakai endpoint placeholder yang return empty array
// (frontend akan tetap jalan, hanya data kosong)

@Controller('api/sejarah-identitas')
export class SejarahController {
  private data: any[] = [];
  private nextId = 1;

  @Get() findAll() { return this.data; }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    const item = { id: this.nextId++, ...body, created_at: new Date() };
    this.data.push(item);
    return item;
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    const idx = this.data.findIndex(d => d.id == id);
    if (idx === -1) return { message: 'Tidak ditemukan' };
    this.data[idx] = { ...this.data[idx], ...body };
    return this.data[idx];
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.data = this.data.filter(d => d.id != id);
    return { message: 'Berhasil dihapus' };
  }
}

// ─── VISI & MISI ─────────────────────────────────────────────
@Controller('api/visi-misi')
export class VisiMisiController {
  private data: any[] = [];
  private nextId = 1;

  @Get() findAll() { return this.data; }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    const item = { id: this.nextId++, ...body, created_at: new Date() };
    this.data.push(item);
    return item;
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    const idx = this.data.findIndex(d => d.id == id);
    if (idx === -1) return { message: 'Tidak ditemukan' };
    this.data[idx] = { ...this.data[idx], ...body };
    return this.data[idx];
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.data = this.data.filter(d => d.id != id);
    return { message: 'Berhasil dihapus' };
  }
}

// ─── STRUKTUR ORGANISASI ──────────────────────────────────────
@Controller('api/struktur-organisasi')
export class StrukturController {
  private data: any[] = [];
  private nextId = 1;

  @Get() findAll() { return this.data; }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('gambar'))
  create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const gambar = file ? `/uploads/${file.filename}` : body.gambar || '';
    const item = { id: this.nextId++, gambar, created_at: new Date() };
    this.data.push(item);
    return item;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('gambar'))
  update(@Param('id') id: number, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const idx = this.data.findIndex(d => d.id == id);
    if (idx === -1) return { message: 'Tidak ditemukan' };
    if (file) this.data[idx].gambar = `/uploads/${file.filename}`;
    return this.data[idx];
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.data = this.data.filter(d => d.id != id);
    return { message: 'Berhasil dihapus' };
  }
}

// ─── PROGRAM KEAHLIAN ─────────────────────────────────────────
@Controller('api/program-keahlian')
export class ProgramKeahlianController {
  private data: any[] = [];
  private nextId = 1;

  @Get() findAll() { return this.data; }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    const item = { id: this.nextId++, ...body, created_at: new Date() };
    this.data.push(item);
    return item;
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    const idx = this.data.findIndex(d => d.id == id);
    if (idx === -1) return { message: 'Tidak ditemukan' };
    this.data[idx] = { ...this.data[idx], ...body };
    return this.data[idx];
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.data = this.data.filter(d => d.id != id);
    return { message: 'Berhasil dihapus' };
  }
}
// ─── FASILITAS ────────────────────────────────────────────────
@Controller('api/fasilitas')
export class FasilitasController {
  private data: any[] = [];
  private nextId = 1;

  @Get() findAll() { return this.data; }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('foto'))
  create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const foto = file ? `/uploads/${file.filename}` : body.foto || '';
    const item = { id: this.nextId++, nama_fasilitas: body.nama_fasilitas, deskripsi: body.deskripsi, foto, created_at: new Date() };
    this.data.push(item);
    return item;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('foto'))
  update(@Param('id') id: number, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const idx = this.data.findIndex(d => d.id == id);
    if (idx === -1) return { message: 'Tidak ditemukan' };
    if (body.nama_fasilitas) this.data[idx].nama_fasilitas = body.nama_fasilitas;
    if (body.deskripsi !== undefined) this.data[idx].deskripsi = body.deskripsi;
    if (file) this.data[idx].foto = `/uploads/${file.filename}`;
    return this.data[idx];
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.data = this.data.filter(d => d.id != id);
    return { message: 'Berhasil dihapus' };
  }
}

// ─── PRESTASI ─────────────────────────────────────────────────
@Controller('api/prestasi')
export class PrestasiController {
  private data: any[] = [];
  private nextId = 1;

  @Get() findAll() { return this.data; }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    const item = { id: this.nextId++, ...body, created_at: new Date() };
    this.data.push(item);
    return item;
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    const idx = this.data.findIndex(d => d.id == id);
    if (idx === -1) return { message: 'Tidak ditemukan' };
    this.data[idx] = { ...this.data[idx], ...body };
    return this.data[idx];
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.data = this.data.filter(d => d.id != id);
    return { message: 'Berhasil dihapus' };
  }
}

// ─── MITRA KERJASAMA ──────────────────────────────────────────
@Controller('api/mitra-kerjasama')
export class MitraKerjasamaController {
  private data: any[] = [];
  private nextId = 1;

  @Get() findAll() { return this.data; }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('logo'))
  create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const logo = file ? `/uploads/${file.filename}` : body.logo || '';
    const item = { id: this.nextId++, nama_mitra: body.nama_mitra, deskripsi: body.deskripsi, logo, created_at: new Date() };
    this.data.push(item);
    return item;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  update(@Param('id') id: number, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const idx = this.data.findIndex(d => d.id == id);
    if (idx === -1) return { message: 'Tidak ditemukan' };
    if (body.nama_mitra) this.data[idx].nama_mitra = body.nama_mitra;
    if (body.deskripsi !== undefined) this.data[idx].deskripsi = body.deskripsi;
    if (file) this.data[idx].logo = `/uploads/${file.filename}`;
    return this.data[idx];
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.data = this.data.filter(d => d.id != id);
    return { message: 'Berhasil dihapus' };
  }
}