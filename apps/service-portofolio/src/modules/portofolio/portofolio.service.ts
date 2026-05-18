import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Op } from 'sequelize';
import PortofolioModel, { PortfolioStatus } from '../../models/PortofolioModel';
import { CreatePortfolioDto } from './dto/create-portofolio.dto';
import { UpdatePortfolioDto } from './dto/update-portofolio.dto';
import { QueryPortfolioDto } from './dto/query-portofolio.dto';
import { RejectPortfolioDto } from './dto/reject-portofolio.dto';

type PortfolioActor = {
    userId: string;
    username: string;
    roles: string[];
};

@Injectable()
export class PortofolioService {

    private requireActor(actor: PortfolioActor) {
        if (!actor?.userId) {
            throw new UnauthorizedException('User tidak terautentikasi');
        }

        if (!actor.roles?.includes('siswa')) {
            throw new ForbiddenException('Hanya siswa yang dapat mengelola portofolio');
        }

        return actor;
    }

    private requireAdmin(actor: PortfolioActor) {
        if (!actor?.userId) {
            throw new UnauthorizedException('User tidak terautentikasi');
        }

        if (!actor.roles?.includes('admin')) {
            throw new ForbiddenException('Hanya admin yang dapat melakukan moderasi portofolio');
        }

        return actor;
    }

    private normalizeRow(portfolio: any) {
        const plain = typeof portfolio.get === 'function'
            ? portfolio.get({ plain: true })
            : portfolio;

        const { ownerUserId, reviewedBy, ...safeData } = plain as Record<string, unknown>;
        return safeData;
    }

    private async findOwnedPortfolio(id: number, ownerUserId: string) {
        const portfolio: any = await PortofolioModel.findByPk(id);

        if (!portfolio) {
            throw new NotFoundException(`Portofolio dengan ID ${id} tidak ditemukan`);
        }

        if (!portfolio.ownerUserId || portfolio.ownerUserId !== ownerUserId) {
            throw new ForbiddenException('Anda hanya dapat mengubah portofolio milik sendiri');
        }

        return portfolio;
    }

    private buildWhere(query: QueryPortfolioDto, actor?: PortfolioActor) {
    const where: any = {};

    if (query.major) where.major = query.major;
    if (query.category) where.category = query.category;
    if (query.skill) where.skill = query.skill;

    // Filter status berdasarkan role
    if (actor?.roles?.includes('admin')) {
        if (query.status) where.status = query.status;
    } else if (actor?.userId) {
        // Siswa: lihat published ATAU milik sendiri
        where[Op.or] = [
            { status: PortfolioStatus.PUBLISHED },
            { ownerUserId: actor.userId },
        ];
    } else {
        // Guest: hanya published
        where.status = PortfolioStatus.PUBLISHED;
    }

    // Fix: search pakai Op.and agar tidak menimpa Op.or di atas
    if (query.search) {
        where[Op.and] = [
            {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${query.search}%` } },
                    { studentName: { [Op.iLike]: `%${query.search}%` } },
                ],
            },
        ];
    }

    return where;
}

    // --- CRUD Transaksi ---

    async create(payload: CreatePortfolioDto, actor: PortfolioActor) {
        try {
            const user = this.requireActor(actor);
            const studentName = user.username || payload.studentName || '';

            const dataBaru = await PortofolioModel.create({
                title: payload.title,
                description: payload.description,
                studentName,
                ownerUserId: user.userId,
                ownerUsername: user.username || studentName,
                major: payload.major ?? null,
                category: payload.category ?? null,
                skill: payload.skill ?? null,
                image: payload.image ?? null,
                status: PortfolioStatus.PUBLISHED,
            });

            return {
                status: 'success',
                message: 'Portofolio berhasil dibuat',
                data: this.normalizeRow(dataBaru)
            };
        } catch (error: any) {
            throw new Error(`Gagal membuat portofolio: ${error.message}`);
        }
    }

   async findAll(query: QueryPortfolioDto = {}, actor?: PortfolioActor) {
        try {
            const page = Math.max(Number(query.page ?? 1), 1);
            const limit = Math.min(Math.max(Number(query.limit ?? 10), 1), 50);

            const { rows, count } = await PortofolioModel.findAndCountAll({
                where: this.buildWhere(query, actor),
                order: [['created_at', 'DESC']],
                offset: (page - 1) * limit,
                limit,
            });

            return {
                status: 'success',
                data: rows.map((item) => this.normalizeRow(item)),
                meta: { total: count, page, limit },
            };
        } catch (error: any) {
            throw new Error(`Gagal mengambil data portofolio: ${error.message}`);
        }
    }

    async findMine(query: QueryPortfolioDto = {}, actor: PortfolioActor) {
        const user = this.requireActor(actor);
        const page = Math.max(Number(query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(query.limit ?? 10), 1), 50);

        const where: any = {
            ownerUserId: user.userId,
        };

        if (query.major) where.major = query.major;
        if (query.category) where.category = query.category;
        if (query.skill) where.skill = query.skill;
        if (query.status) where.status = query.status;

        if (query.search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${query.search}%` } },
                { studentName: { [Op.iLike]: `%${query.search}%` } },
            ];
        }

        const { rows, count } = await PortofolioModel.findAndCountAll({
            where,
            order: [['created_at', 'DESC']],
            offset: (page - 1) * limit,
            limit,
        });

        return {
            status: 'success',
            data: rows.map((item) => this.normalizeRow(item)),
            meta: { total: count, page, limit },
        };
    }

    async findForReview(query: QueryPortfolioDto = {}, actor: PortfolioActor) {
        const admin = this.requireAdmin(actor);
        const page = Math.max(Number(query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(query.limit ?? 10), 1), 50);

        const reviewQuery: QueryPortfolioDto = {
            ...query,
            status: query.status ?? PortfolioStatus.PENDING_REVIEW,
        };

        const { rows, count } = await PortofolioModel.findAndCountAll({
            where: this.buildWhere(reviewQuery, admin),
            order: [['created_at', 'DESC']],
            offset: (page - 1) * limit,
            limit,
        });

        return {
            status: 'success',
            data: rows.map((item) => this.normalizeRow(item)),
            meta: { total: count, page, limit },
        };
    }

    async findOne(id: number, actor?: PortfolioActor) {
        const data: any = await PortofolioModel.findByPk(id);
        if (!data) {
            throw new NotFoundException(`Portofolio dengan ID ${id} tidak ditemukan`);
        }

        const isOwner = actor?.userId && data.ownerUserId === actor.userId;
        const isAdmin = actor?.roles?.includes('admin');

        if (
            data.status !== PortfolioStatus.PUBLISHED &&
            !isOwner &&
            !isAdmin
        ) {
            throw new NotFoundException(`Portofolio dengan ID ${id} tidak ditemukan`);
        }

        return {
            status: 'success',
            data: this.normalizeRow(data),
        };
    }

    async update(id: number, payload: UpdatePortfolioDto, actor: PortfolioActor) {
        const user = this.requireActor(actor);
        const portfolio = await this.findOwnedPortfolio(id, user.userId);

        const updatedPayload = {
            title: payload.title ?? portfolio.title,
            description: payload.description ?? portfolio.description,
            studentName: user.username || portfolio.studentName,
            major: payload.major ?? portfolio.major ?? null,
            category: payload.category ?? portfolio.category ?? null,
            skill: payload.skill ?? portfolio.skill ?? null,
            image: payload.image ?? portfolio.image ?? null,
        };

        await (portfolio as any).update(updatedPayload);
        return {
            status: 'success',
            message: 'Portofolio berhasil diperbarui',
            data: this.normalizeRow(portfolio)
        };
    }

    async submit(id: number, actor: PortfolioActor) {
        const user = this.requireActor(actor);
        const portfolio = await this.findOwnedPortfolio(id, user.userId);

        if (portfolio.status !== PortfolioStatus.DRAFT && portfolio.status !== PortfolioStatus.REJECTED) {
            throw new ForbiddenException('Portofolio hanya bisa diajukan dari status draft atau rejected');
        }

        await (portfolio as any).update({
            status: PortfolioStatus.PENDING_REVIEW,
            rejectionReason: null,
        });

        return {
            status: 'success',
            message: 'Portofolio berhasil diajukan untuk review',
            data: this.normalizeRow(portfolio),
        };
    }

    async publish(id: number, actor: PortfolioActor) {
        const admin = this.requireAdmin(actor);
        const portfolio: any = await PortofolioModel.findByPk(id);

        if (!portfolio) {
            throw new NotFoundException(`Portofolio dengan ID ${id} tidak ditemukan`);
        }

        await portfolio.update({
            status: PortfolioStatus.PUBLISHED,
            rejectionReason: null,
            reviewedBy: admin.userId,
            reviewedAt: new Date(),
        });

        return {
            status: 'success',
            message: 'Portofolio berhasil dipublish',
            data: this.normalizeRow(portfolio),
        };
    }

    async reject(id: number, payload: RejectPortfolioDto, actor: PortfolioActor) {
        const admin = this.requireAdmin(actor);
        const portfolio: any = await PortofolioModel.findByPk(id);

        if (!portfolio) {
            throw new NotFoundException(`Portofolio dengan ID ${id} tidak ditemukan`);
        }

        await portfolio.update({
            status: PortfolioStatus.REJECTED,
            rejectionReason: payload.reason.trim(),
            reviewedBy: admin.userId,
            reviewedAt: new Date(),
        });

        return {
            status: 'success',
            message: 'Portofolio ditolak dan dikembalikan ke siswa',
            data: this.normalizeRow(portfolio),
        };
    }

    async delete(id: number, actor: PortfolioActor) {
        const user = this.requireActor(actor);
        const portfolio = await this.findOwnedPortfolio(id, user.userId);

        await (portfolio as any).destroy();
        return { 
            status: 'success', 
            message: 'Portofolio berhasil dihapus' 
        };
    }
}
