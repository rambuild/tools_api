const mongoose = require('../index')

const schema = mongoose.Schema({
    visitedTime: { type: String },
    praisedTime: { type: String },
    uip: { type: String },
    isPraised: { type: Boolean, default: false }
})

module.exports = mongoose.model('upFansStatLog', schema, 'upFansStat_logs')