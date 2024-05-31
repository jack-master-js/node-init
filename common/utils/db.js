const mysql = require('mysql2/promise');
const logger = require('./logger');

class DB {
    constructor() {
        this.pool = null;
    }

    createPoll() {
        this.pool = mysql.createPool({
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
    }

    async getConnection() {
        if (!this.pool) this.createPoll();
        const conn = await this.pool.getConnection();
        return conn;
    }

    async execute(sql, values) {
        let conn = await this.getConnection();
        try {
            let [results] = await conn.execute(sql, values);
            conn.release();
            return results;
        } catch (error) {
            logger.error(`[ db ] ${error.message}`);
            conn.release();
            throw error;
        }
    }
}

module.exports = new DB();
