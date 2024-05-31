const crypto = require('crypto');

class Cryptor {
    constructor(algorithm, key, iv = '') {
        this.algorithm = algorithm; //openssl list -cipher-algorithms will display the available cipher algorithms.
        this.key = key; //秘钥
        this.iv = iv; //初始化向量
    }

    encrypt(strBuf) {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        cipher.setAutoPadding(true);
        let encrypted = cipher.update(strBuf, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(encrypted) {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.key,
            this.iv
        );
        decipher.setAutoPadding(true);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

module.exports = new Cryptor('aes-128-ccm', '!@#123');
