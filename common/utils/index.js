exports.mapToObj = (map) => {
    return Array.from(map).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
};
exports.sleep = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
exports.clone = (data) => {
    return JSON.parse(JSON.stringify(data));
};
exports.random = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
};
exports.shuffle = (arr) => {
    let _arr = arr.slice();
    for (let i = 0; i < _arr.length; i++) {
        let temp = _arr[i];
        let j = this.random(0, i);
        _arr[i] = _arr[j];
        _arr[j] = temp;
    }
    return _arr;
};
exports.randomMap = (start, end, arr = []) => {
    let _start = arr.length + start;
    let map = {};
    for (let i = _start; i < end; i++) {
        map[i] = i;
    }

    let index = end - 1;
    while (index >= start) {
        let num = this.random(start, index);
        let temp = map[num];
        map[num] = map[i];
        map[index] = temp;
        index--;
    }

    return map;
};
exports.getWsClientIp = (request) => {
    let ip = '';
    if (request.headers['x-forwarded-for']) {
        ip = request.headers['x-forwarded-for'].split(/\s*, \s*/)[0];
    } else if (request.connection.remoteAddress) {
        ip = request.connection.remoteAddress.split(':').pop();
    }
    return ip;
};
exports.getQueryStr = (url) => {
    let index = url.indexOf('?');
    if (index >= 0) return url.slice(index + 1);
    return '';
};