module.exports = app => {
    const request = require('request')
    const express = require('express')
    const router = express.Router()
    const fs = require('fs')
    const getCurrentTime = require('../utils/getCurrentTime')

    // veee API
    router.post('/veeeApi', (req, res, next) => {
        let params = req.query
        request({
            method: 'POST',
            url: "https://l-weuz2.club/api.php",
            form: params
        }, (err, result, body) => {
            let time = getCurrentTime()
            //获取用户ip
            let uip = req.header('x-forwarded-for') || req.connection.remoteAddress
            // 注入数据库日志
            request({
                method: 'POST',
                url: 'https://api.rambuild.cn/tools/logs/rest/veeeRegLog',
                form: { uip, time }
            }, (err, result2, body) => { })
            // fs.appendFile(__dirname + '/../logs/veee_logs/veeeRegTimes.log', `${time}, ${uip} ,计次：${++veeeRegTimes}\n`, (err) => { })
            return res.send(result.body)
        })
    })

    // bali日志
    router.get('/baliInvite', (req, res, next) => {
        let inviteCode = req.query.inviteCode
        let time = getCurrentTime()
        //获取用户ip
        let uip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        // 注入数据库日志
        request({
            method: 'POST',
            url: 'https://api.rambuild.cn/tools/logs/rest/baliLog',
            form: { inviteCode, uip, time }
        }, (err, result2, body) => {
            if (!err) {
                res.send({
                    status: 200,
                    inviteCode
                })
            } else {
                res.send({ status: 400, msg: '日志写入失败' })
            }
        })
        // fs.appendFile(__dirname + `/../logs/bili_logs/${inviteCode}.log`, `${time}, ${uip} ,${inviteCode},计次：${biliRecTimes[inviteCode]}\n`, (err) => { })
    })
    // 获取推荐码列表
    router.get('/bali/inviteCode', async (req, res) => {
        const codeModel = require('../db/model/baliInviteCode')
        let rawList = await codeModel.find()
        let codeList = rawList.map(i => {
            return i.inviteCode
        })
        res.send({ codeList })
    })
    // 添加推荐码
    router.post('/bali/inviteCode', async (req, res) => {
        const codeModel = require('../db/model/baliInviteCode')
        let { inviteCode } = req.body
        if (inviteCode) {
            codeModel.create(req.body, (err, data) => {
                if (err) {
                    return res.send({
                        errorCode: err.code,
                        msg: '该推荐码已存在'
                    })
                } else {
                    res.send({
                        status: 200,
                        inviteCode,
                        msg: '添加成功'
                    })
                }
            })
        }
    })

    // v2box注册工具类    
    // 激活临时邮箱
    router.get('/v2box/activeEmail', (req, res) => {
        let { email } = req.query
        let timeStamp = (new Date().getTime() + '').slice(0, 10)
        request({
            method: 'GET',
            url: `https://www.linshiyouxiang.net/api/v1/mailbox/keepalive?force_change=1&mailbox=${email}&_ts=${timeStamp}`
        }, (err, data, body) => {
            if (!err) {
                res.send({ status: 200, data: JSON.parse(body), t: Number.parseInt(timeStamp) })
            } else {
                res.send({ status: 500, msg: '发生错误' })
            }
        })
    })
    // 获取邮件状态
    router.get('/v2box/getEmailState', (req, res) => {
        let { emailPrefix } = req.query
        request({
            method: 'GET',
            url: `https://www.linshiyouxiang.net/api/v1/mailbox/${emailPrefix}`
        }, (err, data, body) => {
            if (!err) {
                res.send({ status: 200, data: JSON.parse(body) })
            } else {
                res.send({ status: 500, msg: '发生错误' })
            }
        })
    })
    // 通过ID获取邮件内容
    router.get('/v2box/getEmailContent', (req, res) => {
        let { emailPrefix, emailID } = req.query
        request({
            method: 'GET',
            url: `https://www.linshiyouxiang.net/mailbox/${emailPrefix}/${emailID}/source`
        }, (err, data, body) => {
            if (!err) {
                res.send({ status: 200, data: body })
            } else {
                res.send({ status: 500, msg: '发生错误' })
            }
        })
    })

    // v2box日志
    router.get('/v2boxTimes', (req, res, next) => {
        let time = getCurrentTime()
        //获取用户ip
        let uip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        // fs.appendFile(__dirname + '/../logs/v2box_logs/v2boxRegTimes.log', `${time}, ${uip} ,计次：${++v2boxTimes}\n`, (err) => { console.log(err) })

        // 注入数据库日志
        request({
            method: 'POST',
            url: 'https://api.rambuild.cn/tools/logs/rest/v2boxRegLog',
            form: { uip, time }
        }, (err, result2, body) => {
            if (!err) {
                res.send({ status: 200 })
            } else {
                res.send({ status: 400, msg: '日志写入失败' })
            }
        })
    })
    app.use('/', router)
}