// apps/service-pelanggaran/src/scripts/sync.ts
import { dbProfile } from "../config/database";
// WAJIB import semua model agar Sequelize tahu tabel apa yang mau di-sync
import "../models/SejarahIdentitasModel";
import "../models/VisiMisiModel";
import "../models/StrukturOrganisasiModel";
import "../models/FasilitasModel";
import "../models/PrestasiModel";
import "../models/MitraKerjaSamaModel";
import "../models/ProgramKeahlianModel";

async function syncDB(): Promise<void> {
    try {
        console.log("Sedang melakukan sinkronisasi data db_pelanggaran...");

        // Gunakan force: true HANYA JIKA ingin drop dan buat ulang tabel dari nol
        // Jika data sudah aman, gunakan alter: true
        await dbProfile.sync({ alter: true });

        console.log("✅ Berhasil sinkronisasi database Pelanggaran.");
    } catch (error) {
        console.error("❌ Gagal sinkronisasi:", error);
    } finally {
        await dbProfile.close();
    }
}

syncDB();