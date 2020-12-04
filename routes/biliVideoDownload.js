module.exports = app => {
	const express = require("express")
	const router = express.Router()
	const request = require("request")
	const BiliSearchList = require("../db/model/BiliSearchList")

	router.post("/biliVideoDownload", (req, res) => {
		let { url } = req.body
		request(
			{
				method: "POST",
				url: "http://118.24.49.88/Video/X.php",
				form: {
					url,
					token: "TEST",
					kjs: "公众号：科技兽"
				}
			},
			(err, data, body) => {
				if (!err) {
					res.send(body)
				} else {
					res.send({
						status: 500,
						msg: "未知错误"
					})
				}
			}
		)
	})
	// 保存搜索结果
	router.post("/saveBiliVideo", async (req, res) => {
		let { videoName, url } = req.body
		let result = await BiliSearchList.create({
			videoName,
			url
		})
		if (result) {
			res.send({
				status: 200,
				msg: "存储成功"
			})
		} else {
			res.send({
				status: 400,
				msg: "存储失败"
			})
		}
	})
	// 获取搜索记录
	router.get("/getBiliVideo", async (req, res) => {
		let searchList = await BiliSearchList.find()
		searchList = searchList.map(i => {
			return {
				url: i.url,
				videoName: i.videoName
			}
		})
		res.send(searchList)
	})
	// 删除单项搜索记录
	router.delete("/delBiliVideo", async (req, res) => {
		let { url, verifyCode } = req.query
		if (verifyCode == "qq") {
			let result = await BiliSearchList.deleteOne({ url })
			if (result.ok == 1 && result.deletedCount !== 0) {
				res.send({
					status: 200,
					msg: "删除成功"
				})
			} else {
				res.send({
					status: 400,
					msg: "删除失败"
				})
			}
		} else {
			res.send({
				status: 401,
				msg: "认证失败"
			})
		}
	})
	app.use("/", router)
}
