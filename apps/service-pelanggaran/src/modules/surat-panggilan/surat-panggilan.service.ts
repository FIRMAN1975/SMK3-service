import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuratDto } from './dto/create-surat.dto';
import SiswaModel from '../../models/SiswaModel';
import GuruModel from '../../models/GuruModel';
import SuratPanggilanModel from '../../models/SuratPanggilanModel';
import { Op } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';

@Injectable()
export class SuratPanggilanService {

    // --- Master Data ---
    async getMasterSiswa() {
        const data = await SiswaModel.findAll({
            attributes: ['id', 'nama', 'kelas', 'no_wa_ortu'],
            order: [['nama', 'ASC']]
        });
        return { status: 'success', data };
    }

    async getMasterGuru() {
        const data = await GuruModel.findAll({
            attributes: ['id', 'nama', 'jabatan', 'nip'],
            order: [['nama', 'ASC']]
        });
        return { status: 'success', data };
    }

    // --- CRUD Transaksi ---
    async createSurat(payload: CreateSuratDto) {
        try {
            const suratBaru = await SuratPanggilanModel.create({
                id_siswa: payload.id_siswa,
                no_surat: payload.no_surat,
                permasalahan: payload.permasalahan,
                tanggal_panggilan: payload.tanggal_panggilan,
                waktu_panggilan: payload.waktu_panggilan || '09.00 WIB - Selesai',
                tempat: payload.tempat || 'Ruang BK',
                id_penandatangan: payload.id_penandatangan
            });

            return {
                status: 'success',
                message: 'Surat Panggilan berhasil dibuat',
                data: suratBaru
            };
        } catch (error) {
            throw new Error(`Gagal membuat surat: ${error.message}`);
        }
    }

    async getAllSurat() {
        try {
            const data = await SuratPanggilanModel.findAll({
                order: [['tanggal_panggilan', 'DESC']]
            });
            return { status: 'success', data };
        } catch (error) {
            throw new Error(`Gagal mengambil data surat: ${error.message}`);
        }
    }

    async deleteSurat(id: string) {
        const deletedCount = await SuratPanggilanModel.destroy({ where: { id } });
        if (deletedCount === 0) {
            throw new NotFoundException(`Surat dengan ID ${id} tidak ditemukan`);
        }
        return { status: 'success', message: 'Surat panggilan berhasil dihapus' };
    }

    // --- Aksi Integrasi ---

    // 🔥 Fungsi Generate PDF (Puppeteer & Handlebars) 🔥
    async generatePdf(id: string): Promise<{ buffer: Buffer; fileName: string }> {
        // 1. Cari data surat
        const surat = await SuratPanggilanModel.findByPk(id);
        if (!surat) {
            throw new NotFoundException(`Surat dengan ID ${id} tidak ditemukan`);
        }

        // 2. Ambil data Siswa
        const siswa = await SiswaModel.findByPk(surat.getDataValue('id_siswa'));

        // 3. Ambil data Guru (Penandatangan)
        const arrIdPenandatangan = surat.getDataValue('id_penandatangan') || [];
        const gurus = await GuruModel.findAll({
            where: {
                id: { [Op.in]: arrIdPenandatangan }
            }
        });

        // Urutkan guru sesuai urutan ID di array aslinya
        const penandatanganTerurut = arrIdPenandatangan.map((guruId: string) => {
            const guru = gurus.find(g => g.getDataValue('id') === guruId);
            return guru ? guru.toJSON() : null;
        }).filter(Boolean);

        // 4. Siapkan Data untuk Template
        const dataTemplate = {
            tanggal_cetak: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            no_surat: surat.getDataValue('no_surat'),
            nama_siswa: siswa?.getDataValue('nama') || 'Nama Siswa Tidak Ditemukan',
            tanggal_panggilan: surat.getDataValue('tanggal_panggilan'), // Bisa di-format lagi nanti
            waktu_panggilan: surat.getDataValue('waktu_panggilan'),
            tempat: surat.getDataValue('tempat'),
            permasalahan: surat.getDataValue('permasalahan'),
            penandatangan: penandatanganTerurut
        };

        // 5. Baca Template HTML
        // Gunakan process.cwd() agar path mengarah ke root project monorepo
        const templatePath = path.join(process.cwd(), 'apps/service-pelanggaran/src/templates/surat-panggilan.hbs');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');

        // 6. Compile Handlebars
        const template = handlebars.compile(templateHtml);
        const finalHtml = template(dataTemplate);

        // 7. Jalankan Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

        // 8. Generate Buffer PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px' }
        });

        await browser.close();

        const namaMentah = siswa?.getDataValue('nama') || 'Siswa_Tidak_Diketahui';
        const namaBersih = namaMentah.replace(/[^a-zA-Z0-9]/g, '_');

        // Pastikan mengembalikan Buffer yang valid
        return {
            buffer: Buffer.from(pdfBuffer),
            fileName: `surat_panggilan_${namaBersih}.pdf`
        };
    }

    async generateWhatsappLink(id: string) {
        // TODO: Akan kita kerjakan setelah tes PDF berhasil!
        return {
            status: 'pending',
            message: `Fitur link WhatsApp untuk ID ${id} siap diimplementasikan.`
        };
    }
}