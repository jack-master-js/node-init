const multer = require('../../common/utils/multer');
const xlsx = require('node-xlsx').default;

class MainService {
    /**
     * @api {POST} /api/upload 上传
     * @apiGroup main
     * @apiParam {string} name 值设置成 file
     */
    upload(req, res, next) {
        try {
            const up = multer.single('file');
            up(req, res, (err) => {
                if (err) {
                    res.error(err);
                } else {
                    res.filePath();
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @api {GET} /api/export 导出
     * @apiGroup main
     * @apiDescription 浏览器地址访问实现下载
     */
    async export(req, res, next) {
        try {
            const data = [
                [1, 2, 3],
                [true, false, null, 'sheetjs'],
                ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
                ['baz', null, 'qux']
            ];
            const buffer = xlsx.build([{ name: 'mySheetName', data: data }]);
            res.attachment('mySheetName.xlsx');
            res.send(buffer);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MainService();
