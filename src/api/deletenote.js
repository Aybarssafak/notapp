import { MongoClient, ObjectId } from 'mongodb';

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
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }

      const db = await connectToDb();
      const result = await db.collection('notes').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        res.json({ success: true, message: 'Note deleted successfully' });
      } else {
        res.status(404).json({ message: "Note not found" });
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ message: "Error deleting note." });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}