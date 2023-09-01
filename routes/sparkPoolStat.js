module.exports = app => {
	const express = require("express")
	const router = express.Router()
	const request = require("request")
	const SparkPoolStat = require("../db/model/SparkPoolStat")
	// 定时任务
	const schedule = require("node-schedule")
	const dayjs = require("dayjs")

	// var rule = new schedule.RecurrenceRule()
	// rule.minute = [0, 10, 20, 28, 30, 40, 50] // 定时任务:每10分钟执行一次

	// 定时任务,每小时执行
	const sparkPoolStatFunc = () => {
		schedule.scheduleJob("0 0 * * * *", () => {
			startStat()
		})
	}
	sparkPoolStatFunc()

	// 插入记录
	function startStat() {
		// 获取账户余额
		request(
			{
				url: `https://www.sparkpool.com/v1/bill/stats?miner=sp_rambuild&pool=SPARK_POOL_CN&currency=ETH`
			},
			async (err, result, body) => {
				// 余额信息
				let serverStat = JSON.parse(body)
				if (serverStat.code == 200) {
					let curEthCny = await getCurEthCny()
					let ethBalance = serverStat.data.balance
					await SparkPoolStat.create(
						{
							accountName: "rambuild",
							time: dayjs(new Date()).format("MM-DD HH:mm"),
							ethBalance,
							curEthCny,
							cnyBalance: (ethBalance * curEthCny).toFixed(2)
						},
						(err, data) => {
							// if (!err) {
							//     console.log('sparkPool记录成功')
							// } else {
							//     console.log('sparkPool记录出错')
							// }
						}
					)
				}
			}
		)
	}

	function getCurEthCny() {
		return new Promise((resolve, reject) => {
			let curEthCny
			// 获取当前币价
			request(
				{
					url: "https://www.sparkpool.com/v1/pool/stats?pool=SPARK_POOL_CN"
				},
				(err2, result2, body2) => {
					JSON.parse(body2).data.forEach(i => {
						if (i.currency == "ETH") {
							curEthCny = i.cny.toFixed(2)
							resolve(curEthCny)
							return
						}
					})
				}
			)
		})
	}
	router.post("/getSparkStat", async (req, res) => {
		let stats = await SparkPoolStat.find({}, { _id: 0, __v: 0 })
		res.send({
			data: stats
		})
	})
	app.use("/", router)
}
