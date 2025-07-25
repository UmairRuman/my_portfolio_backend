const mongoose = require('mongoose');
const Project = require('../app/backend/src/models/project');

// Singleton connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Reduce timeout for faster failure
      heartbeatFrequencyMS: 10000,    // Adjust MongoDB heartbeat
    });
    cachedDb = db;
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = async (req, res) => {
  try {
    await connectToDatabase();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    const total = await Project.countDocuments().exec();

    if (endIndex < total) {
      results.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      results.previous = { page: page - 1, limit };
    }

    results.results = await Project.find()
      .limit(limit)
      .skip(startIndex)
      .exec();

    res.json(results);
  } catch (error) {
    console.error('Function execution error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Optional POST route
module.exports.post = async (req, res) => {
  try {
    await connectToDatabase();
    const { title, short_description, detailed_description, images, category } = req.body;
    const project = new Project({ title, short_description, detailed_description, images, category });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};