const mongoose = require('mongoose');
const QuizSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  questions: [{ questionText: String, choices: [String], correctIndex: Number }]
});
module.exports = mongoose.model('Quiz', QuizSchema);
