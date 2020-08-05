var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const session = require('express-session');
const mongoConnection = require('./database/config'); // 引入连接数据库的默认配置文件
const connectMongo = require('connect-mongo'); // 引入连接数据库插件
const MongoStore = connectMongo(session);
const {config} = require('./utils/configPort'); // 引入默认全局端口
const chalk = require('chalk'); // 引入打印字体样式库.
const passport = require('passport');

// const HOST = req;

var app = express();

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', '*');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
// 配置passport  配置passport代码量非常大   把配置抽离一个单独的文件
app.use(passport.initialize()); // 初始化
require('./controller/jwt/passport')(passport); // 导入配置文件  把passport传递过去,而且要导入一个函数

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/elm', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(session({
  name: 'SongTang',
  secret: 'SongTang',
  resave: false,
  saveUninitialized: false,
  cookie: config.session.cookie,
  store: new MongoStore({ mongooseConnection: mongoConnection })
}));

// app.use('/', indexRouter);
indexRouter(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log('错误页-------------------', err)
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
