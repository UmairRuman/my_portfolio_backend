const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  short_description: String,
  detailed_description: String,
  images: [{ type: String }],
  category: [String],
});

module.exports = mongoose.model('Project', projectSchema);