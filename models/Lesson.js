const mongoose = require('mongoose');
const LessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: { type: String, unique: true },
  content: String,
  order: Number
});
module.exports = mongoose.model('Lesson', LessonSchema);
