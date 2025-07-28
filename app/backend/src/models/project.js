const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true
  },
  short_description: String,
  detailed_description: String,
  images: [String],
  category: [String]
});

// Prevent re-compilation error
module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);