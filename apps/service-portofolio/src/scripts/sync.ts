import { dbPortofolio } from "../config/database";
import "../models/PortofolioModel";

const syncDb = async () => {
    try {
        // Ganti dbPelanggaran menjadi dbPortofolio
        await dbPortofolio.sync({ alter: true });
        console.log("Database Portofolio synced successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error syncing database:", error);
        process.exit(1);
    }
};

syncDb();