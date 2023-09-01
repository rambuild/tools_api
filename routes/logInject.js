module.exports = app => {
    const express = require('express')
    const router = express.Router()

    // 添加数据接口
    router.post('/', async (req, res) => {
        req.Model.create(req.body, (err, data) => {
            if (err) {
                return res.send({
                    errorCode: err.code
                })
            } else {
                res.send({
                    status: 200,
                    msg: '日志添加成功'
                })
            }
        })
    })

    // CRUD通用接口
    app.use('/logs/rest/:resource', (req, res, next) => {
        let modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../db/model/${modelName}`)
        next()
    }, router)
}