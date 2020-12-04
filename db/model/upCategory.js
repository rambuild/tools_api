const mongoose = require('../index')

const schema = mongoose.Schema({
    nickname: {
        type: String,
        unique: true,
        required: true
    },
    mid: {
        type: Number,
        unique: true,
        required: true
    },
    addTime: { type: String }
})

module.exports = mongoose.model('upCategory', schema, 'up_categories')