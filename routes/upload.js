module.exports = app => {
	const multer = require("multer")
	const fs = require("fs")
	// 封装百度OCR请求
	const ocrRequest = require("../utils/baiduOCR")

	const storage = multer.diskStorage({
		destination(req, file, cb) {
			cb(null, __dirname + '/../../static/upload/img') // 远程部署
			// cb(null, __dirname + "/upload") // 本地开发
		},
		filename(req, file, cb) {
			cb(null, file.originalname)
		}
	})
	const upload = multer({ storage })

	// const upload = require('multer')({ dest: __dirname + "/uploads" })
	app.post("/upload", upload.single("file"), async (req, res) => {
		let { method, params, classify, apiVersion } = req.body
		const file = req.file
		// 图片转换成base64
		var imgData = fs.readFileSync(file.path)
		imgDataBase64 = new Buffer.from(imgData, "utf-8").toString("base64")
		// 百度OCR请求
		let baiduOcrRes = await ocrRequest(classify, apiVersion, method, imgDataBase64, params)
		file.url = `https://api.rambuild.cn/tools/static/upload/img/${file.filename}`
		file.status = 200
		res.send({
			file: {
				url: file.url,
				status: file.status
			},
			baiduOcrRes
		})
	})
}
