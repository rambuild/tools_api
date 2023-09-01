const mongoose = require('../index')

const schema = mongoose.Schema({
    time: { type: String },
    uip: { type: String },
    searchUserID: { type: String },
    searchUserName: { type: String }
})

module.exports = mongoose.model('bilifansLog', schema, 'bilifans_logs')