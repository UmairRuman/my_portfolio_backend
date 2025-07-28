const mongoose = require('mongoose');

// Simple Project Schema (inline to avoid import issues)
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  short_description: String,
  detailed_description: String,
  images: [String],
  category: [String]
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

// Simple connection function
async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
      const skip = (page - 1) * limit;

      const [projects, total] = await Promise.all([
        Project.find().skip(skip).limit(limit),
        Project.countDocuments()
      ]);

      const response = {
        results: projects,
        total,
        page,
        limit
      };

      if (page * limit < total) {
        response.next = { page: page + 1, limit };
      }
      if (page > 1) {
        response.previous = { page: page - 1, limit };
      }

      return res.status(200).json(response);
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

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}