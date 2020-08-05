const mongoose = require('mongoose');
const chalk = require('chalk'); // Terminal string styling done right 打印的字体样式
const {config} = require('../utils/configPort');

//链接数据库
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/elmPro', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.once('open', () => {
    console.log(chalk.green(`连接数据库成功, 监听端口 ${config.port}`))
});
db.on('error', (err) => {
    console.error(chalk.red('Error in MongoDB connection' + err));
});
db.on('close', () => {
    console.log(chalk.red('数据库断开，重新连接数据库'));
    mongoose.connect('mongodb://localhost:27017/elmPro',  {server:{auto_reconnect:true}})
});

module.exports = db;
