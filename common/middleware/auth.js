const jwt = require('jsonwebtoken');
const db = require('../../db');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const decode = jwt.verify(token, process.env.TOKEN_SECRET);
        const { email } = decode;
        const records = await db.execute(
            'SELECT * FROM `user` WHERE `email` = ?',
            [email]
        );

        if (records) {
            next();
        } else {
            throw Error('invalid token');
        }
    } catch (error) {
        res.error(error);
    }
};
