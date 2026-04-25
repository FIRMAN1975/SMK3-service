import { Injectable, NotFoundException } from '@nestjs/common';
import PortofolioModel from '../../models/PortofolioModel';
import { CreatePortfolioDto } from './dto/create-portofolio.dto';

@Injectable()
export class PortofolioService {

    // --- CRUD Transaksi ---

    async create(payload: CreatePortfolioDto) {
        try {
            const dataBaru = await PortofolioModel.create({
                title: payload.title,
                description: payload.description,
                studentName: payload.studentName,
                major: payload.major,
                category: payload.category,
                skill: payload.skill,
                image: payload.image,
            });

            return {
                status: 'success',
                message: 'Portofolio berhasil dibuat',
                data: dataBaru
            };
        } catch (error) {
            throw new Error(`Gagal membuat portofolio: ${error.message}`);
        }
    }

   async findAll() {
        try {
            // Hapus order createdAt karena timestamps-nya false
            const data = await PortofolioModel.findAll();
            return { status: 'success', data };
        } catch (error) {
            throw new Error(`Gagal mengambil data portofolio: ${error.message}`);
        }
    }

    async findOne(id: number) {
        const data = await PortofolioModel.findByPk(id);
        if (!data) {
            throw new NotFoundException(`Portofolio dengan ID ${id} tidak ditemukan`);
        }
        return { status: 'success', data };
    }

    async update(id: number, payload: CreatePortfolioDto) {
        const portfolio = await PortofolioModel.findByPk(id);
        if (!portfolio) {
            throw new NotFoundException(`Portofolio dengan ID ${id} tidak ditemukan`);
        }

        await portfolio.update(payload);
        return {
            status: 'success',
            message: 'Portofolio berhasil diperbarui',
            data: portfolio
        };
    }

    async delete(id: number) {
        const deletedCount = await PortofolioModel.destroy({ where: { id } });
        if (deletedCount === 0) {
            throw new NotFoundException(`Portofolio dengan ID ${id} tidak ditemukan`);
        }
        return { 
            status: 'success', 
            message: 'Portofolio berhasil dihapus' 
        };
    }
}