const mongoose = require('../index');

const schema = mongoose.Schema({
  ip: { type: String },
  user: { type: String },
  ipAddress: { type: String },
  date: { type: String },
  timestamp: { type: String },
});

module.exports = mongoose.model('linux-login-log', schema);
