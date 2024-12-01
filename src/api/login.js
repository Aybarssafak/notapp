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
      const { email, password } = req.body;
      const db = await connectToDb();
      const user = await db.collection('users').findOne({ email, password });

      if (user) {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid email or password" });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Database query error" });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
