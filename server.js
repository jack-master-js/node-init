const app = require('./app');
const ws = require('./ws');
const logger = require('./common/utils/logger');

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
    logger.info(
        'App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
    );
});

/**
 * Start ws server.
 */
ws.start(server).then(() => {
    logger.info(`ws server is listening.`);
});

process.on('uncaughtException', (err) => {
    logger.error(`Caught exception: ${JSON.stringify(err)}`);
});

process.on('SIGINT', async () => {
    await ws.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await ws.close();
    process.exit(0);
});
