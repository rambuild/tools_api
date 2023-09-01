const mongoose = require('../../index')

const schema = mongoose.Schema({
	url: { type: String },
	videoName: { type: String },
})

module.exports = mongoose.model('bili-video-history', schema)
