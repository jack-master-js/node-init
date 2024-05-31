const db = require('../../common/utils/db');

class UserQuery {
    async create(email, password) {
        return db.execute(
            'INSERT INTO `user` SET `email` = ?, `password` = ?',
            [email, password]
        );
    }

    async update(email, password, id) {
        return db.execute(
            'UPDATE `user` SET `email` = ? , `password` = ?  WHERE `id` = ?',
            [email, password, id]
        );
    }

    async findAndCount(pageIndex, pageSize) {
        const records = await db.execute(
            'SELECT id,email FROM `user` LIMIT ?,?',
            [pageIndex, pageSize]
        );

        const [count] = await db.execute(
            'SELECT COUNT(*) AS total FROM `user` '
        );

        return { records, total: count.total };
    }

    async get(id) {
        const [user] = await db.execute('SELECT * FROM `user` WHERE `id` = ?', [
            id
        ]);
        return user;
    }

    async findByEmail(email) {
        const [user] = await db.execute(
            'SELECT * FROM `user` WHERE `email` = ?',
            [email]
        );
        return user;
    }

    async del(id) {
        return db.execute('DELETE FROM `user` WHERE `id` = ?', [id]);
    }
}

module.exports = new UserQuery();
