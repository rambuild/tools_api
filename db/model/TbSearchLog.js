const mongoose = require('../index')

const schema = mongoose.Schema({
    time: { type: String },
    uip: { type: String },
    url: { type: String },
    title: { type: String }
})

module.exports = mongoose.model('tbSearchLog', schema, 'tbSearch_logs')