const mongoose = require('mongoose');
const Project = require('../app/backend/src/models/project');

// Singleton connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    const db = await mongoose.connect(process.env.MONGODB_URI);
    
    cachedDb = db;
    console.log('MongoDB connected successfully');
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    cachedDb = null;
    throw err;
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Ensure database connection
    await connectToDatabase();
    
    // Wait for connection to be ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not ready');
    }

    if (req.method === 'GET') {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};
      
      // Use Promise.all for concurrent operations
      const [total, projects] = await Promise.all([
        Project.countDocuments().exec(),
        Project.find()
          .limit(limit)
          .skip(startIndex)
          .exec()
      ]);

      if (endIndex < total) {
        results.next = { page: page + 1, limit };
      }

      if (startIndex > 0) {
        results.previous = { page: page - 1, limit };
      }

      results.results = projects;
      results.total = total;
      results.page = page;
      results.limit = limit;

      return res.status(200).json(results);
    }

    if (req.method === 'POST') {
      const { title, short_description, detailed_description, images, category } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      
      const project = new Project({ 
        title, 
        short_description, 
        detailed_description, 
        images, 
        category 
      });
      
      const savedProject = await project.save();
      return res.status(201).json(savedProject);
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Function execution error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({ 
        error: 'Database connection error', 
        details: 'Please try again later' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
};