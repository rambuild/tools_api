const mongoose = require('../index');

const schema = mongoose.Schema({
  universities: { type: Array },
  school_cates: { type: Array },
  runningFlag: { type: Boolean },
});

module.exports = mongoose.model('school-unit-info', schema);
