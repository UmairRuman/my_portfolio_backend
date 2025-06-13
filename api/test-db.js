const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    return res.status(500).json({ 
      error: 'MONGODB_URI not found',
      env: Object.keys(process.env).filter(key => key.includes('MONGO'))
    });
  }

  // Don't expose the full URI for security, just test connection
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('portfolio');
    const collections = await db.listCollections().toArray();
    
    res.status(200).json({ 
      message: 'Database connection successful',
      database: 'portfolio',
      collections: collections.map(c => c.name),
      uri_configured: !!uri
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message
    });
  } finally {
    await client.close();
  }
};