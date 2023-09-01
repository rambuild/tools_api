const mongoose = require('../index')

const schema = mongoose.Schema({
	token: { type: String },
})

module.exports = mongoose.model('ai-token', schema)
