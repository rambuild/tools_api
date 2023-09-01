const mongoose = require('../index');

const schema = mongoose.Schema({
  name: { type: String, required: true },
  wordNum: { type: Number, required: true },
  timestamp: { type: Number, required: true },
});

module.exports = mongoose.model('paper-stat', schema);
