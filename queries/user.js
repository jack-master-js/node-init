const db = require('../common/utils/db');

module.exports = {
    getUsers: async () => {
        const records = await db.execute('SELECT * FROM `user`');
        return records;
    }
};
