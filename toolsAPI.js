const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// 引入数据库
require('./db/index')

// 设置跨域 (cors)
app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, mytoken");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With, X_Requested_With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", "lbwnb");
    next()
})

// 网站全局静态资源
app.use('/static', express.static(__dirname + "/../static"))

// bodyParser中间件
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// 引入路由
require('./routes/regTools')(app)
require('./routes/biliFans')(app)
require('./routes/tbPriceHistory')(app)
require('./routes/tbkApi')(app)
require('./routes/biliVideoDownload')(app)
// 日志注入路由
require('./routes/logInject')(app)
// 上传文件路由
require('./routes/upload')(app)
// up主粉丝统计
require('./routes/upFansStat')(app)
// ai接口
require('./routes/ai')(app)

app.listen(9090)
console.log('variousTools api started at port:9090!')