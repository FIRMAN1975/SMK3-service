import { DataTypes } from "sequelize";
import { dbProfile } from "../config/database";

const PrestasiModel = dbProfile.define("m_prestasi", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  judul: { type: DataTypes.STRING, allowNull: false },
  tingkat: { type: DataTypes.ENUM("kabupaten", "provinsi", "nasional", "internasional"), allowNull: false },
  tahun: { type: DataTypes.STRING, allowNull: false },
  keterangan: { type: DataTypes.TEXT, allowNull: true },
}, {
  freezeTableName: true,
  tableName: "m_prestasi",
});

export default PrestasiModel;