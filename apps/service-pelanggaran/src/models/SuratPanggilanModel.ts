import { DataTypes } from "sequelize";
import { dbPelanggaran } from "../config/database";

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
}, {
    freezeTableName: true,
    tableName: 't_surat_panggilan',
    timestamps: false
});

export default SuratPanggilanModel;