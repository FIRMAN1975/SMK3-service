import { DataTypes } from "sequelize";
import { dbProfile } from "../config/database";


const StrukturOrganisasiModel = dbProfile.define("m_struktur_organisasi", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  gambar: { type: DataTypes.TEXT, allowNull: false },
}, {
  freezeTableName: true,
  tableName: "m_struktur_organisasi",
});

export default StrukturOrganisasiModel;