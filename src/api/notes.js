import { MongoClient } from 'mongodb';

const dbConfig = {
  url: 'mongodb://localhost:27017/',
  dbName: 'opinify',
};

let db;

async function connectToDb() {
  if (!db) {
    const client = new MongoClient(dbConfig.url, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbConfig.dbName);
  }
  return db;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await connectToDb();
      const notes = await db.collection('notes').find().sort({ created_at: -1 }).toArray();
      res.status(200).json({ notes });
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ message: "Error fetching notes." });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
