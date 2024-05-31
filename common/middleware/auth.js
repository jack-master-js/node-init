const jwt = require('jsonwebtoken');
const user = require('../../api/user/user.query');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const decode = jwt.verify(token, process.env.TOKEN_SECRET);
        const { email } = decode;
        const record = await user.findByEmail(email);

        if (record) {
            next();
        } else {
            throw Error('invalid token');
        }
    } catch (error) {
        res.error(error);
    }
};
