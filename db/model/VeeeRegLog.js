const mongoose = require('../index')

const schema = mongoose.Schema({
    time: { type: String },
    uip: { type: String }
})

module.exports = mongoose.model('veeeRegLog', schema, 'veeeReg_logs')