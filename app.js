const express = require('express');
const cors = require('cors');
const timeout = require('connect-timeout');
const compression = require('compression');
const responseTime = require('response-time');
const path = require('path');
const config = require('dotenv').config();
const logger = require('./common/utils/logger');
const responser = require('./common/middleware/responser');

// routes
const mainRouter = require('./api/main/main.router');
const userRouter = require('./api/user/user.router');

if (config) {
    logger.info(`Using .env file to supply config environment variables`);
}

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    cors({
        origin: process.env.WHITE_LIST.split(','),
        credentials: true
    })
);

// performance
app.use(compression());
app.use(responseTime());
app.use(timeout('3s')); //req.timeout

// router
app.use(responser);
app.use('/api', mainRouter);
app.use('/api/user', userRouter);

// 404
app.use((req, res, next) => {
    res.status = 404;
    next();
});

// error
app.use((err, req, res, next) => {
    res.error(err);
});

module.exports = app;
