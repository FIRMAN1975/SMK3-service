import { DataTypes } from "sequelize";
import { dbProfile } from "../config/database";

const ProgramKeahlianModel = dbProfile.define("m_program_keahlian", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nama_jurusan: { type: DataTypes.STRING, allowNull: false },
  deskripsi: { type: DataTypes.TEXT, allowNull: true },
  icon: { type: DataTypes.TEXT, allowNull: true },
}, {
  freezeTableName: true,
  tableName: "m_program_keahlian",
});

export default ProgramKeahlianModel;