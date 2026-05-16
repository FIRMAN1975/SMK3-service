import { DataTypes } from "sequelize";
import { dbPelanggaran } from "../config/database";

export enum SuratStatus {
    DRAFT = 'draft',
    TERBIT = 'terbit',
    DIKIRIM = 'dikirim',
    SELESAI = 'selesai',
    DIBATALKAN = 'dibatalkan',
}

const SuratPanggilanModel = dbPelanggaran.define("t_surat_panggilan", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    id_siswa: {
        type: DataTypes.UUID,
        allowNull: false
    },
    no_surat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permasalahan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tanggal_panggilan: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    waktu_panggilan: {
        type: DataTypes.STRING,
        defaultValue: "09.00 WIB - Selesai"
    },
    tempat: {
        type: DataTypes.STRING,
        defaultValue: "Ruang BK"
    },
    // 🔥 Kolom baru menggunakan Array untuk mendukung penandatangan dinamis
    id_penandatangan: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: []
    },
    status: {
        type: DataTypes.ENUM(
            SuratStatus.DRAFT,
            SuratStatus.TERBIT,
            SuratStatus.DIKIRIM,
            SuratStatus.SELESAI,
            SuratStatus.DIBATALKAN,
        ),
        allowNull: false,
        defaultValue: SuratStatus.DRAFT,
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    tableName: 't_surat_panggilan',
    timestamps: true
});

export default SuratPanggilanModel;
