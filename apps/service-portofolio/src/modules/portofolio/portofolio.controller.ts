import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PortofolioService } from './portofolio.service';
import { CreatePortfolioDto } from './dto/create-portofolio.dto';

@Controller('portfolio')
export class PortofolioController {
    constructor(private readonly portfolioService: PortofolioService) { }

    // ==========================================
    // 1. TRANSAKSI (CRUD Portofolio)
    // ==========================================

    @Post()
    async create(@Body() dto: CreatePortfolioDto) {
        return await this.portfolioService.create(dto);
    }

    @Get()
    async getAll() {
        return await this.portfolioService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.portfolioService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: CreatePortfolioDto
    ) {
        return await this.portfolioService.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.portfolioService.delete(id);
    }
}