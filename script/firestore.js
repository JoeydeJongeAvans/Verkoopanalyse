require('dotenv').config();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const fs = require('fs');
const csv = require('csv-parser');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Function to store CSV data in Firestore
async function storeCSVInFirestore(csvFilePath, collectionName) {
    const csvData = [];
    
    // Read the CSV file
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        csvData.push(row);
      })
      .on('end', () => {
        const csvCollection = collection(db, collectionName);
  
        // Loop through the CSV data and add to Firestore
        csvData.forEach((row) => {
          addDoc(csvCollection, row)
            .then((docRef) => {
              console.log(`CSV data added to collection ${collectionName} with ID: `, docRef.id);
            })
            .catch((error) => {
              console.error(`Error adding CSV data to collection ${collectionName}: `, error);
            });
        });
      });
  }
  
  // Example usage:
  storeCSVInFirestore('klanten_data.csv', 'klanten'); // Replace 'your_csv_file.csv' with your CSV file path and 'csvData' with the collection name.
