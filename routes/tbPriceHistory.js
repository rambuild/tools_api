module.exports = app => {
    const request = require('request')
    const express = require('express')
    const router = express.Router()
    const iconv = require("iconv-lite")
    const urlencode = require('urlencode')
    const fs = require('fs')
    const getCurrentTime = require('../utils/getCurrentTime')

    // 淘宝比价API
    let tbPriceResult = null
    router.get('/priceHistory', (req, appres) => {
        let searchUrl = req.query.url
        // 先到i.rcuts获取token
        request({
            url: 'http://i.rcuts.com/api/Goods/api_v2.php',
            method: 'POST',
            form: {
                'text': searchUrl,
                "price_history": 3
            }
        }, (err, res, body) => {
            let primaryUrl = JSON.parse(body).url
            let apiUrl = primaryUrl.slice(37)
            apiUrl = urlencode.decode(apiUrl, 'gbk')

            // 拿到token后到 manmanbuy.com 接口获取历史价格信息
            let requestOptions = {
                method: 'GET',
                encoding: null, // 不设置编码，,得到buffer流之后用iconv-lite转码
                headers: {
                    'Referer': 'https://tool.manmanbuy.com/m/history.aspx',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36'
                },
                url: apiUrl
            }

            request(requestOptions, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    tbPriceResult = JSON.parse(iconv.decode(body, 'gb2312').toString())
                    tbPriceResult.status = 200
                    let time = getCurrentTime()
                    //获取用户ip
                    let uip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                    // 注入数据库日志
                    request({
                        method: 'POST',
                        url: 'https://api.rambuild.cn/tools/logs/rest/tbSearchLog',
                        form: {
                            uip,
                            time,
                            url:tbPriceResult.spurl,
                            title:tbPriceResult.spname
                        }
                    }, (err, result2, body) => { })
                    // fs.appendFile(__dirname + '/../logs/priceHistory_logs/priceHistory.log', `${time}, ${uip}, url:'${tbPriceResult.spurl}', title:'${tbPriceResult.spname}'\n`, (err) => { })
                    appres.send({ data: tbPriceResult })
                } else {
                    return console.log(err)
                }
            })
        })
    })
    app.use('/', router)
}