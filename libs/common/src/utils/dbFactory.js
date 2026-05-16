"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseConnection = void 0;
const sequelize_1 = require("sequelize");
const createDatabaseConnection = (dbName, dbUser, dbPass, dbHost, dbPort) => {
    return new sequelize_1.Sequelize(dbName, dbUser, dbPass, {
        host: dbHost,
        port: dbPort,
        dialect: 'postgres',
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
        }
    });
};
exports.createDatabaseConnection = createDatabaseConnection;
//# sourceMappingURL=dbFactory.js.map