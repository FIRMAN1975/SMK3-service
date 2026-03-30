import { dbPelanggaran } from "../config/database";
import SiswaModel from "../models/SiswaModel";
import GuruModel from "../models/GuruModel";
import SuratPanggilanModel from "../models/SuratPanggilanModel";

async function seedDB(): Promise<void> {
    try {
        await dbPelanggaran.authenticate();
        console.log("Sedang melakukan penyemaian data...");

        // 1. Seed Data Siswa
        const [siswa] = await SiswaModel.findOrCreate({
            where: { nama: 'Jenifer Ronauli Siahaan' },
            defaults: { kelas: 'XI PH 2', no_wa_ortu: '08123456789' }
        });

        // 2. Seed Data Guru
        const [kepsek] = await GuruModel.findOrCreate({
            where: { nip: '197409042000121003' },
            defaults: { nama: 'Charles Hutajulu, S.Pd., M.Si.', jabatan: 'Kepala Sekolah' }
        });

        const [waka] = await GuruModel.findOrCreate({
            where: { nama: 'Dra. Ren Sijabat' },
            defaults: { nip: '196501011990012001', jabatan: 'Waka Kesiswaan' }
        });

        const [guruBk] = await GuruModel.findOrCreate({
            where: { nama: 'Dewi Aritonang, S.Pd' },
            defaults: { nip: '198002022005012002', jabatan: 'Guru BK' }
        });

        const [walikelas] = await GuruModel.findOrCreate({
            where: { nama: 'Yuyun Aruan, SE' },
            defaults: { nip: '198503032010012003', jabatan: 'Walikelas' }
        });

        // 3. Seed Data Surat Panggilan (Menggunakan Array id_penandatangan)
        await SuratPanggilanModel.findOrCreate({
            where: { no_surat: '421.5/001/SMKN3/2026' },
            defaults: {
                id_siswa: siswa.getDataValue('id'),
                permasalahan: 'Sering terlambat masuk sekolah dan alpa tanpa keterangan lebih dari 3 kali.',
                tanggal_panggilan: '2026-03-30',
                waktu_panggilan: '09.00 WIB - Selesai',
                tempat: 'Ruang BK SMK Negeri 3 Balige',
                id_penandatangan: [
                    waka.getDataValue('id'),
                    guruBk.getDataValue('id'),
                    walikelas.getDataValue('id')
                    // Kamu bisa tambah/kurangi array ini sesuka hati nanti di frontend!
                ]
            }
        });

        console.log("✅ Data Dummy (Siswa, Guru, & Surat Panggilan) berhasil disemai.");
    } catch (error) {
        console.error("❌ Gagal penyemaian database: ", error);
    } finally {
        await dbPelanggaran.close();
    }
}

seedDB();