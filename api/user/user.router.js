const express = require('express');
const service = require('./user.service');
const auth = require('../../common/middleware/auth');

const router = express.Router();

/* /api/user */

router.post('/create', service.create);
router.post('/update', service.update);
router.post('/list', service.list);
router.post('/get', service.get);
router.post('/del', auth, service.del);
router.post('/login', service.login);

module.exports = router;
