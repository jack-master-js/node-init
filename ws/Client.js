const logger = require('../common/utils/logger');
const protor = require('../common/utils/protor');
const request = require('./request');

class Client {
    constructor(socket, info) {
        this.socket = socket;
        this.info = info;

        this.handlers = new Map();
        this.handler();
        request(this);
    }

    on(cmd, callback) {
        this.handlers.set(cmd, callback);
    }

    emit(cmd, msg) {
        if (process.env.PROTO === 'yes') {
            this.socket.send(protor.encode(cmd, msg));
        } else {
            this.socket.send(JSON.stringify({ cmd, msg }));
        }
    }

    handler() {
        this.socket.on('message', (data) => {
            let message = {};
            if (process.env.PROTO === 'yes') {
                message = protor.decode(data);
            } else {
                message = JSON.parse(data);
            }
            const { cmd, msg } = message;
            if (cmd) this.trigger(cmd, msg, false);
        });
    }

    trigger(cmd, msg, fromSystem = true) {
        let handle = this.handlers.get(cmd);
        if (handle) {
            msg = msg || {};
            msg.fromSystem = fromSystem;
            handle(msg);
        }
    }

    onNewConnection(socket) {
        logger.info(`[ client ] ${socket.id} new connected!`);
    }

    onReConnection(socket) {
        logger.info(`[ client ] ${socket.id} reconnected!`);
        this.socket = socket;
        this.handler();
    }

    onKickOut(socket) {
        logger.info(`[ client ] ${socket.id} was kick out!`);
    }

    async online(socket, clientOnline) {
        await clientOnline();
        logger.info(`[ client ] ${socket.id} is online!`);

        this.joinRoom();
    }

    async onOffline(socket, clientOffline) {
        this.socket.on('close', async () => {
            if (socket === this.socket) {
                await clientOffline();
                logger.info(`[ client ] ${socket.id} is offline!`);
            }
        });
    }

    joinRoom() {}
}

module.exports = Client;
