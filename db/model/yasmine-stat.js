const mongoose = require('../index');

const schema = mongoose.Schema({
  name: { type: String, required: true },
  timestamp: { type: Number, required: true },
  wordNum: { type: Number },
  studyTime: { type: Number },
  remarks: { type: String },
});

module.exports = mongoose.model('yasmine-stat', schema);
