const mongoose = require('mongoose');
const SchoolSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  type: { type: String, enum: ['primary','secondary','university'], default: 'primary' },
  location: String,
  curriculum: String,
  fees: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('School', SchoolSchema);
