const request = require('request')
const AiToken = require('../db/model/AiToken')

const getToken = async () => {
	const tokens = await AiToken.find()
	const token = tokens.length ? tokens[tokens.length - 1].token : null
	return token
}
const updateToken = () => {
	return new Promise(async (resolve, reject) => {
		request(
			{
				method: 'POST',
				url: `https://aip.baidubce.com/oauth/2.0/token`,
				form: {
					grant_type: 'client_credentials',
					client_id: 'igtHIvyG26bmWsYGsAXE9wZx',
					client_secret: 'T0y7VcgyZjUNTKnoTRk8FpG9hjDcGFwD',
				},
				json: true,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			},
			(err, result, body) => {
				if (err) {
					reject(err)
				} else {
					const { access_token: token } = body
					AiToken.create({ token })
						.then(resolve())
						.catch(() => reject())
				}
			}
		)
	})
}

const sendRequest = async (classify, apiVersion, method, image, params, step = 1) => {
	if (params) {
		params = JSON.parse(params)
	}
	const access_token = await getToken()
	return new Promise((resolve, reject) => {
		request(
			{
				method: 'POST',
				url: `https://aip.baidubce.com/rest/2.0/${classify}/${apiVersion}/${method}`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				json: true,
				form: {
					access_token,
					image,
					...params,
				},
			},
			async (err, result, body) => {
				if (err) {
					return reject(err)
				} else {
					if (body.error_code) {
						await updateToken()
						resolve({ ...body,error_msg:"please retry later" })
					} else {
						return resolve(body)
					}
				}
			}
		)
	})
}

module.exports = { sendRequest, getToken }
