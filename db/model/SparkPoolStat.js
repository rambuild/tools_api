const mongoose = require('../index')

const schema = mongoose.Schema({
    accountName: { type: String },
    time: { type: String },
    ethBalance: { type: Number },
    cnyBalance: { type: Number },
    curEthCny: { type: Number }
})

module.exports = mongoose.model('sparkPoolStat', schema, 'sparkpool_stat')