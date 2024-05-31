const request = require('../common/utils/fetcher');

const host = process.env.API_HOST;

module.exports = {
    getUsers: async (params) => {
        return request(`${host}/api/list`, params);
    }
};
