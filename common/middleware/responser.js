const logger = require('../utils/logger');

module.exports = (req, res, next) => {
    res.success = () => {
        res.send({
            success: true
        });
        logger.info(
            `[ http ] ${req.method} ${req.originalUrl} body: ${JSON.stringify(
                req.body
            )} success`
        );
    };

    res.data = (data, total = null) => {
        if (total === null) {
            res.send({
                success: true,
                data
            });
        } else {
            res.send({
                success: true,
                data,
                total
            });
        }

        logger.info(
            `[ http ]  ${req.method} ${req.originalUrl} body: ${JSON.stringify(
                req.body
            )} response: ${JSON.stringify(data)}`
        );
    };

    res.error = (error) => {
        const { message } = error;
        res.send({
            success: false,
            message
        });

        logger.error(
            `[ http ]  ${req.method} ${req.originalUrl} body: ${JSON.stringify(
                req.body
            )} error: ${message}`
        );
    };

    res.filePath = () => {
        let file = req.file;
        let files = req.files;

        if (file) {
            let fileName = req.file.filename;
            let filePath = `/uploads/${req.body.name}/${fileName}`;
            let data = {
                file: fileName,
                path: filePath
            };

            logger.info(
                `[ http ]  ${req.method} ${
                    req.originalUrl
                } response: ${JSON.stringify(data)}`
            );
            return res.send({
                success: true,
                data: data
            });
        } else if (files && files.length > 0) {
            let fileList = [];
            for (let file of files) {
                let fileName = file.filename;
                let filePath = `/uploads/${req.body.name}/${fileName}`;

                fileList.push({
                    file: fileName,
                    path: filePath
                });
            }

            logger.info(
                `[ http ]  ${req.method} ${
                    req.originalUrl
                } response: ${JSON.stringify(fileList)}`
            );
            return res.send({
                success: true,
                data: fileList
            });
        } else {
            throw Error('no file founded!');
        }
    };

    next();
};
