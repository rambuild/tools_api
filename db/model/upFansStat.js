const mongoose = require('../index')

const schema = mongoose.Schema({
    fansNum: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'upCategory'
    },
    fromNickname: { type: String },
    recordTime: { type: String },
    timestamp: { type: String }
})

module.exports = mongoose.model('upFansStat', schema, 'up_fans_stat')