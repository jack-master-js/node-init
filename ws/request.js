const logger = require('../common/utils/logger');

module.exports = (client) => {
    client.on('ping', (msg) => {
        logger.info(msg);
        client.emit('pong', {
            clientTime: msg.clientTime,
            serverTime: Date.now()
        });
    });
};
