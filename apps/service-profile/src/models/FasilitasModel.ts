import { DataTypes } from "sequelize";
import { dbProfile } from "../config/database";

const FasilitasModel = dbProfile.define("m_fasilitas", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nama_fasilitas: { type: DataTypes.STRING, allowNull: false },
  foto: { type: DataTypes.TEXT, allowNull: true },
  deskripsi: { type: DataTypes.TEXT, allowNull: true },
}, {
  freezeTableName: true,
  tableName: "m_fasilitas",
});

export default FasilitasModel;