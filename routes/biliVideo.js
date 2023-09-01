module.exports = app => {
	const express = require('express')
	const router = express.Router()
	const request = require('request')
	const BiliVideoModel = require('../db/model/biliVideo/Bili-video-history')

	router.post('/getVideoLinks', (req, res) => {
		let { url } = req.body
		request(
			{
				method: 'POST',
				url: 'http://118.24.49.88/Video/X.php',
				form: {
					url,
					token: 'TEST',
					kjs: '公众号：科技兽',
				},
			},
			(err, data, body) => {
				if (!err) {
					res.send(body)
				} else {
					res.send({
						status: 500,
						msg: '未知错误',
					})
				}
			}
		)
	})

	router.get('/getVideoHistory', async (req, res) => {
		const searchList = await BiliVideoModel.find()
		res.send({ status: 200, searchList })
	})

	router.post('/saveBiliVideo', async (req, res) => {
		const { videoName, url } = req.body
		BiliVideoModel.create({ videoName, url })
			.then(() => res.send({ status: 200, msg: 'save succeess' }))
			.catch(e => res.send({ status: 400, msg: e.message }))
	})

	router.delete('/delBiliVideo', async (req, res) => {
		const { url, verifyCode } = req.query
		if (verifyCode === 'qq') {
			BiliVideoModel.deleteOne({ url })
				.then(() => res.send({ status: 200, msg: 'delete success' }))
				.catch(e => res.send({ status: 400, msg: e.message }))
		} else {
			res.send({ status: 401, msg: 'delete error' })
		}
	})

	app.use('/', router)
}
