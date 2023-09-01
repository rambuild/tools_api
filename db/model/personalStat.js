const mongoose = require('../index')

const schema = mongoose.Schema({
    time: { type: String },
    timeStamp: { type: Number },
    category: { type: String },
    pay: { type: String },
    commission: { type: String }
})

module.exports = mongoose.model('personalStat', schema, 'personal_stat')