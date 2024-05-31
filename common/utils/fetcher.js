const fetch = require('node-fetch');
const queryString = require('querystring');
const logger = require('./logger');

module.exports = (url, data, method = 'GET', headers = {}) => {
    let options = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (data) {
        if (options.method === 'GET') {
            url = `${url}?${queryString.stringify(data)}`;
        } else {
            options.body = JSON.stringify(data);
        }
    }

    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(async (res) => {
                const ret = await res.json();
                resolve(ret);
                logger.info(
                    `[ Request ] ${method} ${url} body: ${JSON.stringify(
                        data
                    )} receive: ${JSON.stringify(ret)}`
                );
            })
            .catch((e) => {
                reject(e.message);
                logger.error(
                    `[ Request ] ${method} ${url} body: ${JSON.stringify(
                        data
                    )} error: ${e.message}`
                );
            });
    });
};
