const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csvtojson');

mongoose.connect('mongodb+srv://vedr:Cr9TyZQC3Gl7nKmr@vedr.0yhgtpw.mongodb.net/projectJoey', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB-verbindingsfout:'));
db.once('open', async function () {
    console.log('Verbonden met MongoDB');

    const productSchema = new mongoose.Schema({
      Productnaam: String,
      Categorie: String,
      Prijs: Number,
      Voorraadniveau: Number
  });

    const transactieSchema = new mongoose.Schema({
        Klant_ID: String,
        Product: String,
        Categorie: String,
        Prijs: Number,
        Datum: String, // Gewijzigd naar "Datum"
    });

    const klantSchema = new mongoose.Schema({
        Klant_ID: String,
        Naam: String,
        Email: String, // Gewijzigd naar "Email"
        Locatie: String
    });

    async function importTransactieCSVToMongoDB(csvFilePath, collectionName) {
        const jsonArray = await csv().fromFile(csvFilePath);
        const model = mongoose.model(collectionName, transactieSchema);
        try {
            const result = await model.insertMany(jsonArray);
            console.log(`Gegevens uit ${csvFilePath} geïmporteerd in de collectie ${collectionName}`);
        } catch (error) {
            console.error(`Fout bij het importeren van ${csvFilePath}: ${error}`);
        }
    }


    async function importProductCSVToMongoDB(csvFilePath, collectionName) {
      const jsonArray = await csv().fromFile(csvFilePath);
      const model = mongoose.model(collectionName, productSchema);
      try {
          const result = await model.insertMany(jsonArray);
          console.log(`Gegevens uit ${csvFilePath} geïmporteerd in de collectie ${collectionName}`);
      } catch (error) {
          console.error(`Fout bij het importeren van ${csvFilePath}: ${error}`);
      }
  }

    async function importKlantCSVToMongoDB(csvFilePath, collectionName) {
        const jsonArray = await csv().fromFile(csvFilePath);
        const model = mongoose.model(collectionName, klantSchema);
        try {
            const result = await model.insertMany(jsonArray);
            console.log(`Gegevens uit ${csvFilePath} geïmporteerd in de collectie ${collectionName}`);
        } catch (error) {
            console.error(`Fout bij het importeren van ${csvFilePath}: ${error}`);
        }
    }

    // Roep de importeerfuncties aan voor de juiste bestanden en collecties
    importTransactieCSVToMongoDB('transacties_data.csv', 'transacties');
    importKlantCSVToMongoDB('klanten_data.csv', 'klanten');
    importProductCSVToMongoDB('producten_data.csv', 'producten');
});
