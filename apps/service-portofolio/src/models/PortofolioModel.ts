import { DataTypes } from "sequelize";
import { dbPortofolio } from "../config/database";

const PortofolioModel = dbPortofolio.define("portofolios", {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    studentName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    major: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    category: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    skill: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    image: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
}, {
    freezeTableName: true,
    tableName: 'portofolios',
    timestamps: true // Menambahkan createdAt dan updatedAt secara otomatis
});

export default PortofolioModel;