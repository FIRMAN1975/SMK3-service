// libs/common/src/utils/loadModelsUtil.ts
import glob from "glob";
import path from "path";
import { Sequelize } from "sequelize";

/**
 * Fungsi untuk memindai seluruh folder apps dan me-load semua file .model.ts
 * agar terdaftar di dalam instance Sequelize yang diberikan.
 */
export function loadAllModels(sequelizeInstance: Sequelize) {
    // Path menuju folder apps dari posisi file ini
    const appsDir = path.resolve(__dirname, "../../../../../apps");

    // Mencari file dengan akhiran .model.ts atau Model.ts
    const modelFiles = glob.sync(`${appsDir}/**/*+(model|Model).ts`);

    for (const file of modelFiles) {
        // Memanggil file model. 
        // Karena kita pakai db.define, file tersebut butuh instance sequelize.
        const modelDefiner = require(path.resolve(file));
        if (typeof modelDefiner === 'function') {
            modelDefiner(sequelizeInstance);
        }
    }

    return sequelizeInstance.models;
}