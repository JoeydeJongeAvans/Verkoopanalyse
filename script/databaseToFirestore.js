const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const MongoClient = require('mongodb').MongoClient;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const mongoUrl = "mongodb+srv://vedr:Cr9TyZQC3Gl7nKmr@vedr.0yhgtpw.mongodb.net/"; // MongoDB URL
const dbName = "projectJoey"; // Your MongoDB database name
const collectionName = "producten"; // Firestore collection name

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function transferMongoDBToFirestore() {
  const mongoClient = new MongoClient(mongoUrl, { useUnifiedTopology: true });
  await mongoClient.connect();
  const mongoDb = mongoClient.db(dbName);
  const mongoCollection = mongoDb.collection(collectionName);
  const firestoreCollection = collection(db, collectionName);

  const mongoData = await mongoCollection.find().toArray();

  for (const document of mongoData) {
    try {
      await addDoc(firestoreCollection, document);
      console.log(`Document added to Firestore collection ${collectionName}`);
    } catch (error) {
      console.error(`Error adding document to Firestore collection ${collectionName}: `, error);
    }
  }

  await mongoClient.close();
}

// Example usage:
transferMongoDBToFirestore();
