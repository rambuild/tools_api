const mongoose = require('../index')

const schema = mongoose.Schema({
	remoteUrl: { type: String, unique: true },
	localUrl: { type: String, unique: true },
})

module.exports = mongoose.model('pic-everyday', schema)
