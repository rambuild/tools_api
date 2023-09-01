const mongoose = require('../index')

const schema = mongoose.Schema({
	school_cate: { type: String },
	university: { type: String },
	department: { type: String },
	supervisor: { type: String },
	rate: { type: Number },
	description: { type: String },
	date: { type: String },
	counts: { type: String },
})

module.exports = mongoose.model('supervisor-info', schema)
