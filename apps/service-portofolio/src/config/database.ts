import { createDatabaseConnectionFromUrl } from '../../../../libs/common/src/utils/dbFactory';
import dotenv from 'dotenv';
dotenv.config();

export const dbPortofolio = createDatabaseConnectionFromUrl(
    process.env.DATABASE_URL || process.env.DB_PORTOFOLIO_URL,
    {
        dbName: process.env.DB_NAME || 'db_portofolio',
        dbUser: process.env.DB_USER || 'postgres',
        dbPass: process.env.DB_PASSWORD || 'postgres_pass',
        dbHost: process.env.DB_HOST || 'localhost',
        dbPort: parseInt(process.env.DB_PORT || '5436'),
    },
);
