class Util {
    mapToObj(map) {
        return Array.from(map).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    }

    sleep(seconds) {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }

    clone(data) {
        return JSON.parse(JSON.stringify(data));
    }

    randomNum(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }

    randomStr(len) {
        len = len || 32;
        let t = '0123456789abcdefhijkmnprstwxyzABCDEFGHJKMNPQRSTWXYZ',
            a = t.length,
            n = '';
        for (let i = 0; i < len; i++)
            n += t.charAt(Math.floor(Math.random() * a));
        return n;
    }

    shuffle(arr) {
        let _arr = arr.slice();
        for (let i = 0; i < _arr.length; i++) {
            let temp = _arr[i];
            let j = this.random(0, i);
            _arr[i] = _arr[j];
            _arr[j] = temp;
        }
        return _arr;
    }

    randomMap(start, end, arr = []) {
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
    }

    getWsClientIp(request) {
        let ip = '';
        if (request.headers['x-forwarded-for']) {
            ip = request.headers['x-forwarded-for'].split(/\s*, \s*/)[0];
        } else if (request.connection.remoteAddress) {
            ip = request.connection.remoteAddress.split(':').pop();
        }
        return ip;
    }

    getQueryStr(url) {
        let index = url.indexOf('?');
        if (index >= 0) return url.slice(index + 1);
        return '';
    }
}

module.exports = new Util();
