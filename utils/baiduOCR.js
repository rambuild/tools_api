const request = require("request")
let token = "24.8218724ff333492df402dc524d2861bd.2592000.1603642114.282335-22758949"


function sendRequest(classify, apiVersion, method, imgData, params) {
	if (params) {
		params = JSON.parse(params)
	}
	return new Promise((resolve, reject) => {
		request(
			{
				method: "POST",
				url: `https://aip.baidubce.com/rest/2.0/${classify}/${apiVersion}/${method}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				json: true,
				form: {
					access_token: token,
					image: imgData,
					...params
				}
			},
			(err, result, body) => {
				if (err) {
					reject(err)
				} else {
					resolve(body)
				}
			}
		)
	})
}

module.exports = sendRequest
