const mongoose = require('../index')

const schema = mongoose.Schema({
    time: { type: String },
    uip: { type: String }
})

module.exports = mongoose.model('v2boxRegLog', schema, 'v2boxReg_logs')