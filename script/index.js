require('dotenv').config();
const fs = require('fs');
const parse = require('csv-parser');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

async function disconnectFromDatabase() {
  try {
    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
}

async function insertData(collection, filePath, successMessage) {
  const stream = fs.createReadStream(filePath).pipe(parse());

  stream.on('data', async (data) => {
    try {
      await collection.insertOne(data);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  });

  stream.on('end', () => {
    console.log(successMessage);
  });
}

async function importData() {
  await connectToDatabase();

  const db = client.db('projectJoey');

  const klantenCollection = db.collection('klanten');
  const productenCollection = db.collection('producten');
  const transactiesCollection = db.collection('transacties');

  await Promise.all([
    insertData(klantenCollection, 'data/klanten_data.csv', 'Klantgegevens ingevoerd.'),
    insertData(productenCollection, 'data/producten_data.csv', 'Productgegevens ingevoerd.'),
    insertData(transactiesCollection, 'data/transacties_data.csv', 'Transactiegegevens ingevoerd.'),
  ]);

  await disconnectFromDatabase();
}

importData();
