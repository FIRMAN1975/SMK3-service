import { DataTypes } from "sequelize";
import { dbProfile } from "../config/database";

const MitraKerjasamaModel = dbProfile.define("m_mitra_kerjasama", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nama_mitra: { type: DataTypes.STRING, allowNull: false },
  logo: { type: DataTypes.TEXT, allowNull: true },
  deskripsi: { type: DataTypes.TEXT, allowNull: true },
}, {
  freezeTableName: true,
  tableName: "m_mitra_kerjasama",
});

export default MitraKerjasamaModel;