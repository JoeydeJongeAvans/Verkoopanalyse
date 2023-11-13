const fs = require('fs');
const csv = require('csv-parser');
const { collection, addDoc } = require('firebase/firestore');

async function storeCSVsInFirestore(csvDataArray) {
    for (const { filePath, collectionName } of csvDataArray) {
        const csvData = [];

        // Read the CSV file
        await new Promise((resolve) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    csvData.push(row);
                })
                .on('end', () => {
                    resolve();
                });
        });

        const csvCollection = collection(db, collectionName);

        // Loop through the CSV data and add to Firestore
        for (const row of csvData) {
            try {
                const docRef = await addDoc(csvCollection, row);
                console.log(`CSV data added to collection ${collectionName} with ID: `, docRef.id);
            } catch (error) {
                console.error(`Error adding CSV data to collection ${collectionName}: `, error);
            }
        }
    }
}

// Example usage:
const csvDataArray = [
    { filePath: 'klanten_data.csv', collectionName: 'klanten' },
    { filePath: 'producten_data.csv', collectionName: 'producten' },
    { filePath: 'transacties_data.csv', collectionName: 'transacties' }
    // Add more entries as needed
];

storeCSVsInFirestore(csvDataArray);
