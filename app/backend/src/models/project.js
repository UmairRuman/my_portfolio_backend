const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  short_description: {
    type: String,
    trim: true
  },
  detailed_description: {
    type: String,
    trim: true
  },
  images: [{ 
    type: String,
    trim: true
  }],
  category: [{
    type: String,
    trim: true
  }],
}, {
  timestamps: true
});

// Prevent re-compilation error
module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);