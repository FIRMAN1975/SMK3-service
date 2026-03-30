import { DataTypes } from "sequelize";
import { dbProfile } from "../config/database";

const SejarahIdentitasModel = dbProfile.define("m_sejarah_identitas", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  tahun_berdiri: { type: DataTypes.STRING, allowNull: true },
  deskripsi: { type: DataTypes.TEXT, allowNull: false },
}, {
  freezeTableName: true,
  tableName: "m_sejarah_identitas",
});

export default SejarahIdentitasModel;