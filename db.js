const mysql = require('mysql2/promise');
const logger = require('./common/utils/logger');

class DB {
    constructor() {
        this.pool = null;
    }

    async createPoll() {
        const pool = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'test',
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });

        this.pool = pool;
    }

    async getConnection() {
        if (!this.pool) await this.createPoll();
        const conn = await this.pool.getConnection();
        return conn;
    }

    async execute(sql, values) {
        let conn = await this.getConnection();
        try {
            let [results] = await conn.execute(sql, values);
            await conn.release();
            return results;
        } catch (error) {
            logger.error(`[ db ] ${error.message}`);
            await conn.release();
            throw error;
        }
    }
}

module.exports = new DB();
