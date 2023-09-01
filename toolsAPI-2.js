const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
// 引入数据库
require('./db/index');

// 中间件
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 网站全局静态资源
app.use('/static', express.static(__dirname + '/../static'));

app.get('/test', (req, res) => {
  res.send('222');
});
// 路由
require('./routes')(app);
// 周期性任务
// require('./routes/periodic-tasks');

app.listen(6066);
console.log('started at http://127.0.0.1:6066');
