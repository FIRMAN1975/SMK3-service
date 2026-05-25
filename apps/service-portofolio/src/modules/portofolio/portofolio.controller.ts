import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { PortofolioService } from './portofolio.service';
import { CreatePortfolioDto } from './dto/create-portofolio.dto';
import { UpdatePortfolioDto } from './dto/update-portofolio.dto';
import { QueryPortfolioDto } from './dto/query-portofolio.dto';
import { RejectPortfolioDto } from './dto/reject-portofolio.dto';

@Controller('portofolio')
export class PortofolioController {
    constructor(private readonly portfolioService: PortofolioService) { }

    private getActor(req: Request) {
        return {
            userId: req.header('X-User-Id') ?? '',
            username: req.header('X-User-Name') ?? '',
            roles: (req.header('X-User-Roles') ?? '')
                .split(',')
                .map((role) => role.trim())
                .filter(Boolean),
        };
    }

    // ==========================================
    // 1. TRANSAKSI (CRUD Portofolio)
    // ==========================================

    @Post()
<<<<<<< Updated upstream
    async create(@Body() dto: CreatePortfolioDto, @Req() req: Request) {
=======
    @UseInterceptors(FileInterceptor('image', { storage: storageConfig }))
    async create(
        @Body() dto: CreatePortfolioDto,
        @Req() req: Request,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        // Jika ada file gambar yang diunggah, kita timpa isi dto.image secara tegas dengan string URL
        if (file && file.filename) {
            dto.image = `http://localhost:6766/uploads/${file.filename}`;
        }
>>>>>>> Stashed changes
        return await this.portfolioService.create(dto, this.getActor(req));
    }


    @Get()
    async getAll(@Query() query: QueryPortfolioDto, @Req() req: Request) {
        return await this.portfolioService.findAll(query, this.getActor(req));
    }

    @Get('review')
    async getForReview(@Query() query: QueryPortfolioDto, @Req() req: Request) {
        return await this.portfolioService.findForReview(query, this.getActor(req));
    }

    @Get('me')
    async getMine(@Query() query: QueryPortfolioDto, @Req() req: Request) {
        return await this.portfolioService.findMine(query, this.getActor(req));
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        return await this.portfolioService.findOne(id, this.getActor(req));
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdatePortfolioDto,
        @Req() req: Request,
    ) {
<<<<<<< Updated upstream
=======
        // Jika ada file baru, timpa ke dto.image. 
        // Jika tidak ada file baru, kita biarkan dto.image apa adanya agar tidak merusak data lama
        if (file && file.filename) {
            dto.image = `http://localhost:6766/uploads/${file.filename}`;
        } else {
            // Pengaman: Jika frontend mengirim string "[object Object]" karena tidak ganti gambar, 
            // kita set jadi undefined agar service NestJS tahu untuk mengabaikannya (tidak diupdate ke DB)
            if (dto.image && typeof dto.image !== 'string') {
                dto.image = undefined;
            }
        }
>>>>>>> Stashed changes
        return await this.portfolioService.update(id, dto, this.getActor(req));
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        return await this.portfolioService.delete(id, this.getActor(req));
    }

    @Put(':id/submit')
    async submit(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        return await this.portfolioService.submit(id, this.getActor(req));
    }

    @Put(':id/publish')
    async publish(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        return await this.portfolioService.publish(id, this.getActor(req));
    }

    @Put(':id/reject')
    async reject(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: RejectPortfolioDto,
        @Req() req: Request,
    ) {
        return await this.portfolioService.reject(id, dto, this.getActor(req));
    }
}
