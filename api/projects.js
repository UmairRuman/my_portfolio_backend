const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('portfolio');
    const projects = await db.collection('projects').find().limit(3).toArray();
    res.setHeader('Access-Control-Allow-Origin', 'https://your-site-name.netlify.app'); // Update with your Netlify URL
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.status(200).json({ results: projects });
  } catch (error) {
    console.error('Error in projects function:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
};