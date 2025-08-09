const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  description: String,
  level: String,
  subjects: [String],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Course', CourseSchema);
