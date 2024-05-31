const multer = require('multer');
const md5 = require('md5');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            cb(null, `public/uploads/`);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const original = file.originalname.split('.');
        cb(null, `${original[0]}-${md5(file.stream)}.${original[1]}`);
    }
});

module.exports = multer({ storage: storage });
