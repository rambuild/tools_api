const mongoose = require('../index')

const schema = mongoose.Schema({
    inviteCode:{
        type:String,
        unique:true
    }
})

module.exports = mongoose.model('baliInviteCode',schema)