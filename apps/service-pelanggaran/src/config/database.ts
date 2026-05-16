import { createDatabaseConnectionFromUrl } from '../../../../libs/common/src/utils/dbFactory';
import dotenv from 'dotenv';
dotenv.config();

export const dbPelanggaran = createDatabaseConnectionFromUrl(
    process.env.DATABASE_URL || process.env.DB_PELANGGARAN_URL,
    {
        dbName: process.env.DB_NAME_PELANGGARAN || 'db_pelanggaran',
        dbUser: process.env.DB_USER_PELANGGARAN || process.env.DB_USERNAME || 'postgres',
        dbPass: process.env.DB_PASSWORD_PELANGGARAN || process.env.DB_PASSWORD || 'postgres_pass',
        dbHost: process.env.DB_HOST_PELANGGARAN || process.env.DB_HOST || 'localhost',
        dbPort: parseInt(process.env.DB_PORT_PELANGGARAN || '5433'),
    },
);
