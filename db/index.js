const mongoose = require('mongoose')

mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
// { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
mongoose.connect('mongodb://fyh:qwer1236@106.55.157.112:27017/tools_site?authSource=admin')
// mongoose.connect('mongodb://localhost:27017/tools_site')

const db = mongoose.connection

db.on('error', (err) => {
    console.log('error:', err)
})
db.once('open', () => {
    console.log('数据库连接成功！')
})

module.exports = mongoose