// libs/common/src/utils/dbFactory.ts
import { Sequelize } from 'sequelize';

/**
 * Fungsi untuk membuat instance koneksi Sequelize baru.
 * Digunakan oleh masing-masing service untuk terhubung ke DB-nya sendiri.
 */
export const createDatabaseConnection = (
  dbName: string,
  dbUser: string,
  dbPass: string,
  dbHost: string,
  dbPort: number
): Sequelize => {
  return new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false, // Set ke console.log jika ingin melihat query SQL di terminal
    timezone: '+07:00', // Sesuaikan ke WIB
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  });
};