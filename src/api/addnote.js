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
  if (req.method === 'POST') {
    try {
      const { title, contents } = req.body;
      if (!title || !contents) {
        return res.status(400).json({ message: "Both title and contents are required." });
      }

      const db = await connectToDb();
      await db.collection('notes').insertOne({ title, contents, created_at: new Date() });
      res.status(201).json({ message: "Note added successfully!" });
    } catch (error) {
      console.error('Error inserting note:', error);
      res.status(500).json({ message: "Error adding note." });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
