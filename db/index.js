const mongoose = require('mongoose')

mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
// { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
mongoose.connect('mongodb://fyh:123666@124.222.30.36:27017/tools-site?authSource=admin')
// mongoose.connect('mongodb://localhost:27017/tools-site')

const db = mongoose.connection

db.on('error', (err) => {
    console.log('error:', err)
})
db.once('open', () => {
    console.log('数据库连接成功！')
})

module.exports = mongoose