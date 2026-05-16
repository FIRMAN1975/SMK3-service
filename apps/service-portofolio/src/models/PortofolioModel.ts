import { DataTypes } from "sequelize";
import { dbPortofolio } from "../config/database";

export enum PortfolioStatus {
    DRAFT = 'draft',
    PENDING_REVIEW = 'pending_review',
    PUBLISHED = 'published',
    REJECTED = 'rejected',
}

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
    ownerUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    ownerUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
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
    status: {
        type: DataTypes.ENUM(
            PortfolioStatus.DRAFT,
            PortfolioStatus.PENDING_REVIEW,
            PortfolioStatus.PUBLISHED,
            PortfolioStatus.REJECTED,
        ),
        allowNull: false,
        defaultValue: PortfolioStatus.DRAFT,
    },
    rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    reviewedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    tableName: 'portofolios',
    
    // PERUBAHAN FINAL ADA DI 3 BARIS INI:
    timestamps: true,           // 1. Nyalakan pengisian tanggal otomatis
    createdAt: 'created_at',    // 2. Arahkan Sequelize ke nama kolom DB yang benar
    updatedAt: 'updated_at'     // 3. Arahkan Sequelize ke nama kolom DB yang benar
});

export default PortofolioModel;
