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
    const projects = await db.collection('projects').find().limit(10).toArray();
    res.status(200).json({ results: projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};