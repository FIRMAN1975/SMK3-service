import { DataTypes } from "sequelize";
import { dbProfile } from "../config/database";


const VisiMisiModel = dbProfile.define("m_visi_misi", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  tipe: { type: DataTypes.ENUM("visi", "misi"), allowNull: false },
  deskripsi: { type: DataTypes.TEXT, allowNull: false },
}, {
  freezeTableName: true,
  tableName: "m_visi_misi",
});

export default VisiMisiModel;