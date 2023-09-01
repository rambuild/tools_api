const getCurrentTime = require("../utils/getCurrentTime")
module.exports = app => {
	const express = require("express")
	const router = express.Router()
	const personalStat = require('../db/model/personalStat')

	// 插入记录
	router.post("/stat", async (req, res) => {
		let { pay, commission, category, verifyCode } = req.body
		if (verifyCode == "qq") {
			let time = getCurrentTime()
			let timeStamp = Date.now()
			await personalStat.create({
				pay,
				commission,
				category,
				time,
				timeStamp
			})
			res.send({
				status: 200,
				msg: "记录成功"
			})
		} else {
			res.send({
				status: 400,
				msg: "验证错误"
			})
		}

	})
	router.post('/statInfo', async (req, res) => {
		let cloth = await personalStat.find({
			category: "衣服"
		})
		let tea = await personalStat.find({
			category: "茶叶"
		})
		let clothFormat = cloth.map(i => {
			return {
				pay: i.pay,
				commission: i.commission,
				category: i.category,
				time: i.time,
				timeStamp: i.timeStamp
			}
		})
		let teaFormat = tea.map(i => {
			return {
				pay: i.pay,
				commission: i.commission,
				category: i.category,
				time: i.time,
				timeStamp: i.timeStamp
			}
		})
		res.send({
			status: 200,
			data: {
				cloth: clothFormat,
				tea: teaFormat
			}
		})
	})
	app.use("/", router)
}
