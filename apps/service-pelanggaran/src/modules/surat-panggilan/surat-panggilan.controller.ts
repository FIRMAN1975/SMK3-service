import { Controller, Get, Post, Put, Delete, Param, Body, Res, Req } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SuratPanggilanService } from './surat-panggilan.service';
import { CreateSuratDto } from './dto/create-surat.dto';
import { UpdateSuratDto } from './dto/update-surat.dto';

@Controller('surat-panggilan')
export class SuratPanggilanController {
    constructor(private readonly suratService: SuratPanggilanService) { }

    private getActor(req: Request) {
        return {
            userId: req.header('X-User-Id') ?? '',
            username: req.header('X-User-Name') ?? '',
        };
    }

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
    async createSurat(@Body() createSuratDto: CreateSuratDto, @Req() req: Request) {
        return await this.suratService.createSurat(createSuratDto, this.getActor(req));
    }

    @Put(':id')
    async updateSurat(@Param('id') id: string, @Body() updateSuratDto: UpdateSuratDto, @Req() req: Request) {
        return await this.suratService.updateSurat(id, updateSuratDto, this.getActor(req));
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
    async getWhatsappLink(@Param('id') id: string, @Req() req: Request) {
        return await this.suratService.generateWhatsappLink(id, this.getActor(req));
    }

    @Put(':id/selesai')
    async markDone(@Param('id') id: string, @Req() req: Request) {
        return await this.suratService.markDone(id, this.getActor(req));
    }

    @Put(':id/batalkan')
    async cancel(@Param('id') id: string, @Req() req: Request) {
        return await this.suratService.cancel(id, this.getActor(req));
    }
}
