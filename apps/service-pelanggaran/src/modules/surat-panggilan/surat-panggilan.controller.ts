import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SuratPanggilanService } from './surat-panggilan.service';
import { CreateSuratDto } from './dto/create-surat.dto';

@Controller('surat-panggilan')
export class SuratPanggilanController {
    constructor(private readonly suratService: SuratPanggilanService) { }

    // ==========================================
    // 1. MASTER DATA
    // ==========================================
    @Get('master/siswa')
    async getMasterSiswa() {
        return await this.suratService.getMasterSiswa();
    }

    @Get('master/guru')
    async getMasterGuru() {
        return await this.suratService.getMasterGuru();
    }

    // ==========================================
    // 2. TRANSAKSI (CRUD Surat)
    // ==========================================
    @Post()
    async createSurat(@Body() createSuratDto: CreateSuratDto) {
        return await this.suratService.createSurat(createSuratDto);
    }

    @Put(':id')
    async updateSurat(@Param('id') id: string, @Body() updateSuratDto: CreateSuratDto) {
        return await this.suratService.updateSurat(id, updateSuratDto);
    }

    @Get()
    async getAllSurat() {
        return await this.suratService.getAllSurat();
    }

    @Delete(':id')
    async deleteSurat(@Param('id') id: string) {
        return await this.suratService.deleteSurat(id);
    }

    // ==========================================
    // 3. AKSI & INTEGRASI
    // ==========================================
    @Get(':id/pdf')
    async downloadPdf(@Param('id') id: string, @Res() res: Response) {
        const { buffer, fileName } = await this.suratService.generatePdf(id);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }

    @Get(':id/whatsapp')
    async getWhatsappLink(@Param('id') id: string) {
        return await this.suratService.generateWhatsappLink(id);
    }
}