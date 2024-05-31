const bcrypt = require('bcrypt');
const { ERROR_MSG } = require('../../common/lib/enum');
const jwt = require('jsonwebtoken');
const db = require('../../db');

class UserService {
    /**
     * @api {POST} /api/user/create 新增用户
     * @apiGroup user
     */
    async create(req, res, next) {
        try {
            const user = req.body;
            if (!user.email || !user.password)
                throw Error(ERROR_MSG.LACK_PARAMS);
            user.password = await bcrypt.hash(user.password, 10);
            await db.execute(
                'INSERT INTO `user` SET `email` = ?, `password` = ?',
                [user.email, user.password]
            );
            res.success();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/update 更新用户
     * @apiGroup user
     * @apiBody {string} id 用户ID
     */
    async update(req, res, next) {
        try {
            const { id, email, password } = req.body;
            if (!id) throw Error(ERROR_MSG.LACK_PARAMS);
            await db.execute(
                'UPDATE `user` SET `email` = ? , `password` = ?  WHERE `id` = ?',
                [email, password, id]
            );
            res.success();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/list 分页查询所有用户
     * @apiGroup user
     * @apiBody {number} pageIndex 分页序号
     * @apiBody {number} pageSize 分页数量
     */
    async list(req, res, next) {
        try {
            const { pageIndex, pageSize } = req.body;
            if (!pageIndex || !pageSize) throw Error(ERROR_MSG.LACK_PARAMS);
            const records = await db.execute(
                'SELECT id,email FROM `user` LIMIT ?,?',
                [pageIndex, pageSize]
            );

            const [count] = await db.execute(
                'SELECT COUNT(*) AS total FROM `user` '
            );
            res.data(records, count.total);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/get 获取用户详情
     * @apiGroup user
     * @apiBody {string} id 用户ID
     */
    async get(req, res, next) {
        try {
            const [user] = await db.execute(
                'SELECT * FROM `user` WHERE `id` = ?',
                [req.body.id]
            );
            if (!user) throw Error(ERROR_MSG.NO_RECORD);
            res.data(user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/del 删除用户
     * @apiGroup user
     * @apiBody {string} id 用户ID
     */
    async del(req, res, next) {
        try {
            await db.execute('DELETE FROM `user` WHERE `id` = ?', [
                req.body.id
            ]);
            res.success();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {POST} /api/user/login 登录
     * @apiGroup user
     *
     * @apiBody {string} email 账号
     * @apiBody {string} password 密码
     * @apiSuccess {string} token 令牌
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const [user] = await db.execute(
                'SELECT * FROM `user` WHERE `email` = ?',
                [email]
            );
            if (!user) throw Error(ERROR_MSG.NO_RECORD);
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {
                    expiresIn: '24h'
                });
                res.data({ token });
            } else {
                throw Error(ERROR_MSG.NOT_MATCH);
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserService();
