const bcrypt = require('bcrypt');
const { ERROR_MSG } = require('../../common/lib/enum');
const jwt = require('jsonwebtoken');
const user = require('./user.query');

class UserService {
    /**
     * @api {POST} /api/user/create 新增用户
     * @apiGroup user
     */
    async create(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) throw Error(ERROR_MSG.LACK_PARAMS);
            password = await bcrypt.hash(password, 10);
            await user.create(email, password);
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
            await user.update(email, password, id);
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
            const { records, total } = await user.findAndCount(
                pageIndex,
                pageSize
            );
            res.data(records, total);
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
            const record = await user.get(req.body.id);
            if (!record) throw Error(ERROR_MSG.NO_RECORD);
            res.data(record);
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
            await user.del(req.body.id);
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
            const record = await user.findByEmail(email);
            if (!record) throw Error(ERROR_MSG.NO_RECORD);
            const isMatch = await bcrypt.compare(password, record.password);
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
