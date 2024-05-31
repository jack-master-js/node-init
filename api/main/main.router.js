const express = require('express');
const service = require('./main.service');

const router = express.Router();

/* /api */
router.post('/upload', service.upload);
router.get('/export', service.export);

module.exports = router;
