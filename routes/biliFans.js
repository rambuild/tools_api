module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const request = require('request')
    const getCurrentTime = require('../utils/getCurrentTime')


    // 获取B站粉丝接口及日志
    router.get('/fansQuery', (req, res, next) => {
        let { mid, pagenum, pagesize } = req.query
        //获取用户ip
        let uip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        let time = getCurrentTime()
        request({
            url: `https://api.bilibili.com/x/relation/followers?vmid=${mid}&pn=${pagenum}&ps=${pagesize}&order=desc&callback=__jp19`
        }, (err, result, body) => {
            request({
                url: `https://api.bilibili.com/x/space/acc/info?mid=${mid}`
            }, (err, result2, body) => {

                // fs.appendFile(__dirname + '/../logs/bilifans_logs/bilifans.log', `${date}, ${uip} ,计次：${++biliFansTimes}\n`, (err) => { })
                var uname = ''
                if (JSON.parse(result2.body).data !== null) {
                    uname = JSON.parse(result2.body).data.name
                }
                // 注入数据库日志
                request({
                    method: 'POST',
                    url: 'https://api.rambuild.cn/tools/logs/rest/bilifansLog',
                    form: {
                        uip,
                        time,                        
                        searchUserID: mid,
                        searchUserName: uname,
                    }
                }, (err, result2, body) => {
                    console.log(body)
                })
                res.send({
                    data: result,
                    uname
                })
            })
        })
    })
    router.get('/fansInfo', (req, res) => {
        let mid = req.query.mid
        request({
            url: `https://api.bilibili.com/x/relation/stat?vmid=${mid}` //用户关注和粉丝数
        }, (err, result, body) => {
            let following = JSON.parse(result.body).data.following
            let follower = JSON.parse(result.body).data.follower
            request({
                url: `https://api.bilibili.com/x/space/acc/info?mid=${mid}`  //用户各项数据
            }, (err, result2, body) => {
                let sex = JSON.parse(result2.body).data.sex
                let sign = JSON.parse(result2.body).data.sign
                let face = JSON.parse(result2.body).data.face
                let officialTitle = JSON.parse(result2.body).data.official.title
                let top_photo = JSON.parse(result2.body).data.top_photo
                let name = JSON.parse(result2.body).data.name
                res.send({
                    name, following, follower, sex, sign, face, officialTitle, top_photo
                })
            })
        })
    })
    app.use('/', router)
}