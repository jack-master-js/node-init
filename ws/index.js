const WebSocket = require('ws');
const logger = require('../common/utils/logger');
const { getWsClientIp, getQueryStr } = require('../common/utils');
const queryString = require('querystring');
const Client = require('./Client');
const protor = require('../common/utils/protor');

class WS {
    constructor() {
        this.onlineClients = new Map();
        this.offlineClients = new Map();
    }

    async start(server) {
        this.server = new WebSocket.Server({ server });
        this.server.on('connection', (socket, req) => {
            logger.info(`[ ws ] connection origin: ${req.headers.origin}`);
            logger.info(`[ ws ] connection url: ${req.url}`);

            socket.on('error', (e) => {
                logger.error(`[ ws ] ${socket.id} socket error: ${e.message}`);
            });

            // distribute the client from different path
            // if (req.url === '/login')
            this.handleConnection(socket, req);
        });
    }

    handleConnection(socket, req) {
        const ip = getWsClientIp(req);
        const queryStr = getQueryStr(req.url);
        const query = queryString.parse(queryStr);
        const { token } = query;

        //check client
        const clientID = this.checkClient(socket, token);

        try {
            if (!clientID) throw Error('invalid client');
            socket.id = clientID;

            let onlineClient = this.onlineClients.get(clientID);
            let offlineClient = this.offlineClients.get(clientID);
            let client = onlineClient || offlineClient;

            if (!client) {
                //new client
                client = this.newClient(socket);

                client.ip = ip;
                client.id = clientID;

                client.onNewConnection(socket);
            } else {
                //old client
                if (onlineClient) {
                    throw Error('you already login somewhere else!!!');
                    // this.kickOut(
                    //     onlineClient.socket,
                    //     'you login somewhere else.'
                    // )
                    // client.onKickOut(socket)
                }

                if (offlineClient) {
                    this.offlineClients.delete(clientID);
                }

                client.onReConnection(socket);
            }

            //用户上线
            client.online(socket, async () => {
                this.onlineClients.set(clientID, client);

                this.socketMsg(socket, 'loginRes', {
                    clientInfo: client.info
                });
            });

            //用户下线
            client.onOffline(socket, async () => {
                this.onlineClients.delete(clientID);
                this.offlineClients.set(clientID, client);
            });
        } catch (e) {
            this.kickOut(socket, e.message);
        }
    }

    checkClient(socket, token) {
        if (!token) this.kickOut(socket, 'need token');
        // todo: find user in db, return a user id
        return token;
    }

    newClient(socket) {
        // todo: check the user info in db
        return new Client(socket, { name: 'test user' });
    }

    //当前建立连接的用户
    socketMsg(socket, cmd, msg) {
        if (process.env.PROTO === 'yes') {
            socket.send(protor.encode(cmd, msg));
        } else {
            socket.send(JSON.stringify({ cmd, msg }));
        }
    }

    //所有用户
    broadcast(cmd, msg) {
        this.onlineClients.forEach((client) => {
            client.emit(cmd, msg);
        });
    }

    checkOnline(clientID) {
        return this.onlineClients.get(clientID);
    }

    kickOut(socket, message) {
        if (socket) {
            this.socketMsg(socket, 'systemNotice', { message });
            socket.close();
        }
    }

    kickOutAll(msg) {
        this.onlineClients.forEach((client) => {
            this.kickOut(client.socket, msg);
        });
    }

    async close() {
        logger.error(`[ ws ] ws is closed.`);
    }
}

module.exports = new WS();
