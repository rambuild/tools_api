const mongoose = require('../../index')

const schema = mongoose.Schema({
    inviteCode: {
        required: true,
        type: String
    },
    uip: { type: String },
    time: { type: String }
})

module.exports = mongoose.model('baliLog', schema, 'bali_logs')