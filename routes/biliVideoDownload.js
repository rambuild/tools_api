module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const request = require('request')

    router.post('/biliVideoDownload', (req, res) => {
        let { url } = req.body
        request({
            method: 'POST',
            url: 'http://118.24.49.88/Video/X.php',
            form: {
                url,
                token: 'TEST',
                kjs: '公众号：科技兽'
            }
        }, (err, data, body) => {
            if (!err) {
                res.send(body)
            }else{
                res.send({
                    status:500,
                    msg:'未知错误'
                })
            }
        })
    })
    app.use('/', router)
}