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

    // 🔥 Fungsi Update (Edit) Baru 🔥
    async updateSurat(id: string, payload: CreateSuratDto) {
        try {
            const surat = await SuratPanggilanModel.findByPk(id);
            if (!surat) {
                throw new NotFoundException(`Surat dengan ID ${id} tidak ditemukan`);
            }

            await surat.update({
                id_siswa: payload.id_siswa,
                no_surat: payload.no_surat,
                permasalahan: payload.permasalahan,
                tanggal_panggilan: payload.tanggal_panggilan,
                waktu_panggilan: payload.waktu_panggilan,
                tempat: payload.tempat,
                id_penandatangan: payload.id_penandatangan
            });

            return { status: 'success', message: 'Surat Panggilan berhasil diperbarui', data: surat };
        } catch (error) {
            throw new Error(`Gagal memperbarui surat: ${error.message}`);
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
    async generatePdf(id: string): Promise<{ buffer: Buffer; fileName: string }> {
        const surat = await SuratPanggilanModel.findByPk(id);
        if (!surat) throw new NotFoundException(`Surat dengan ID ${id} tidak ditemukan`);

        const siswa = await SiswaModel.findByPk(surat.getDataValue('id_siswa'));
        const arrIdPenandatangan = surat.getDataValue('id_penandatangan') || [];
        const gurus = await GuruModel.findAll({
            where: { id: { [Op.in]: arrIdPenandatangan } }
        });

        const penandatanganTerurut = arrIdPenandatangan.map((guruId: string) => {
            const guru = gurus.find(g => g.getDataValue('id') === guruId);
            return guru ? guru.toJSON() : null;
        }).filter(Boolean);

        const dataTemplate = {
            tanggal_cetak: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            no_surat: surat.getDataValue('no_surat'),
            nama_siswa: siswa?.getDataValue('nama') || 'Nama Siswa Tidak Ditemukan',
            tanggal_panggilan: surat.getDataValue('tanggal_panggilan'),
            waktu_panggilan: surat.getDataValue('waktu_panggilan'),
            tempat: surat.getDataValue('tempat'),
            permasalahan: surat.getDataValue('permasalahan'),
            penandatangan: penandatanganTerurut
        };

        const templatePath = path.join(process.cwd(), 'apps/service-pelanggaran/src/templates/surat-panggilan.hbs');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');

        const template = handlebars.compile(templateHtml);
        const finalHtml = template(dataTemplate);

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px' }
        });

        await browser.close();

        const namaMentah = siswa?.getDataValue('nama') || 'Siswa_Tidak_Diketahui';
        const namaBersih = namaMentah.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `Surat_Panggilan_${namaBersih}.pdf`;

        return {
            buffer: Buffer.from(pdfBuffer),
            fileName: fileName
        };
    }

    async generateWhatsappLink(id: string) {
        const surat = await SuratPanggilanModel.findByPk(id);
        if (!surat) throw new NotFoundException(`Surat dengan ID ${id} tidak ditemukan`);

        const siswa = await SiswaModel.findByPk(surat.getDataValue('id_siswa'));
        if (!siswa) throw new NotFoundException(`Data siswa tidak ditemukan`);

        const namaSiswa = siswa.getDataValue('nama');
        let noWa = siswa.getDataValue('no_wa_ortu');

        if (!noWa) {
            return { status: 'error', message: `Nomor WhatsApp orang tua belum terdaftar.` };
        }

        noWa = noWa.replace(/\D/g, '');
        if (noWa.startsWith('0')) noWa = '62' + noWa.substring(1);

        const tanggal = surat.getDataValue('tanggal_panggilan');
        const waktu = surat.getDataValue('waktu_panggilan');
        const tempat = surat.getDataValue('tempat');

        const pesan = `Yth. Bapak/Ibu Orang Tua/Wali dari siswa/i *${namaSiswa}*,

Dengan hormat,
Sehubungan dengan perlunya penyelesaian masalah akademik/kedisiplinan anak kita, kami mengharapkan kehadiran Bapak/Ibu pada:

 Tanggal: ${tanggal}
 Waktu: ${waktu}
 Tempat: ${tempat}

Mengingat pentingnya pertemuan ini, kami sangat mengharapkan kehadiran Bapak/Ibu tepat waktu. Surat panggilan resmi (PDF) akan kami lampirkan setelah pesan ini.

Atas perhatian dan kerja samanya, kami ucapkan terima kasih.`;

        const encodedPesan = encodeURIComponent(pesan);
        const waLink = `https://wa.me/${noWa}?text=${encodedPesan}`;

        return {
            status: 'success',
            message: 'Link WhatsApp berhasil dibuat',
            data: { nama_siswa: namaSiswa, no_wa_tujuan: noWa, link_whatsapp: waLink }
        };
    }
}