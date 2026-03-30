import { createDatabaseConnection } from '../../../../libs/common/src/utils/dbFactory';
import dotenv from 'dotenv';
dotenv.config();

export const dbProfile = createDatabaseConnection(
    process.env.DB_NAME || 'db_profile',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres_pass',
    process.env.DB_HOST || 'localhost',
    parseInt(process.env.DB_PORT || '5434')
);