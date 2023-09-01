const path = require('path');
module.exports = app => {
  // 引入路由
  // require('./routes/regTools')(app);
  // require('./routes/tbPriceHistory')(app);
  // require('./routes/tbkApi')(app);
  require('./biliVideo')(app);
  // 日志注入路由
  // require('./routes/logInject')(app);
  // 上传文件路由
  require('./upload')(app);
  // up主粉丝统计
  require('./bilibili-fans-tools')['main'](app);
  // 信息统计接口
  // require('./stat')(app);
  // 星火矿池统计
  // require("./sparkPoolStat")(app)
  // pic-everyday
  require('./pic-everyday')['main'](app);
  // 论文字数统计
  require('./paper-stat')(app);
  // yasmine
  require('./yasmine-stat')(app);
  // pdf表格解析
  require('./table-analyse')(app);
  // 流式传输视频文件
  require('./proxy-media')(app);
  // 导师信息统计
  require('./ds-info')(app);
  // 服务器登录统计
  require('./linux-login-log')(app);

  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname + '/../404/404.html'));
  });
};
