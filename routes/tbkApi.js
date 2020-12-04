module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const request = require('request')
    const tbkMethod = require('../utils/tbkMethod')

    app.use('/tbk', router)
    // 根据商品链接查询优惠券
    router.get('/getCoupon', (req, appRes) => {
        let queryStr = req.query.queryStr
        let paramsObj = tbkMethod('taobao.tbk.dg.material.optional', {
            adzone_id: 64232324,
            q: queryStr,
            platform:2
        })
        let RequestOptions = {
            method: 'GET',
            url: 'https://eco.taobao.com/router/rest',
            qs: paramsObj
        }
        request(RequestOptions, (err, res, body) => {
            appRes.send({ data: JSON.parse(body) })
        })
    })
    // 链接转淘口令
    router.get('/getTkl',(req,appRes)=>{
        let url = req.query.url
        let paramsObj = tbkMethod('taobao.tbk.tpwd.create',{
            text:'内部优惠券',
            url
        })
        let RequestOptions = {
            method: 'GET',
            url: 'https://eco.taobao.com/router/rest',
            qs: paramsObj
        }
        request(RequestOptions, (err, res, body) => {
            appRes.send({ data: JSON.parse(body) })
        })
    })


}