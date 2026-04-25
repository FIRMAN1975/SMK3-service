import { createDatabaseConnection } from '../../../../libs/common/src/utils/dbFactory';
import dotenv from 'dotenv';
dotenv.config();

export const dbPelanggaran = createDatabaseConnection(
    process.env.DB_NAME_PELANGGARAN || 'db_pelanggaran',
    process.env.DB_USER_PELANGGARAN || process.env.DB_USERNAME || 'postgres',
    process.env.DB_PASSWORD_PELANGGARAN || process.env.DB_PASSWORD || 'postgres_pass',
    process.env.DB_HOST_PELANGGARAN || process.env.DB_HOST || 'localhost',
    parseInt(process.env.DB_PORT_PELANGGARAN || '5433')
);