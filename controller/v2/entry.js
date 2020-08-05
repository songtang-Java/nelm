const EntryModel = require('../../database/model/v2/entry');

class Entry {
    constructor() {

    }
    async getEntry(req, res, next) {
        try {
            const entries = await EntryModel.find({}, '-_id');
            res.send(entries);
        } catch (err) {
            console.log('获取数据失败！' + err);
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                msg: '获取数据失败'
            })
        }
    }
}

module.exports = new Entry(); // 导出这个类