import { DataTypes } from "sequelize";
import { dbPelanggaran } from "../config/database";

const GuruModel = dbPelanggaran.define("m_guru", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nama: { type: DataTypes.STRING, allowNull: false },
    nip: { type: DataTypes.STRING, allowNull: true },
    jabatan: { type: DataTypes.STRING, allowNull: false },
}, {
    freezeTableName: true, // 👈 Tambahkan ini agar tetap 'm_guru'
    tableName: 'm_guru'
});

export default GuruModel;