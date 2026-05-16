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

export const createDatabaseConnectionFromUrl = (
  databaseUrl: string | undefined,
  fallback: {
    dbName: string;
    dbUser: string;
    dbPass: string;
    dbHost: string;
    dbPort: number;
  },
): Sequelize => {
  const baseOptions = {
    dialect: 'postgres' as const,
    logging: false,
    timezone: '+07:00',
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
    },
  };

  if (databaseUrl) {
    return new Sequelize(databaseUrl, baseOptions);
  }

  return new Sequelize(
    fallback.dbName,
    fallback.dbUser,
    fallback.dbPass,
    {
      ...baseOptions,
      host: fallback.dbHost,
      port: fallback.dbPort,
    },
  );
};
