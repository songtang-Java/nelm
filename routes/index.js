const v1 = require('./v1');
const v2 = require('./v2');
const admin = require('./admin');
const promotion = require('./promotion');
const user = require('./user');
const shopping = require('./shopping');
const statics = require('./statis');
const rating = require('./rating');
const member = require('./member');
const v3 = require('./v3');

module.exports = app => {
  app.use('/v1', v1);
  app.use('/v2', v2);
  app.use('/admin', admin);
  app.use('/promotion', promotion);
  app.use('/v2/user', user);
  app.use('/shopping', shopping);
  app.use('/apis', statics);
  app.use('/rating', rating);
  app.use('/member', member);
  app.use('/v3', v3);
};
