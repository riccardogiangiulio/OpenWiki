

const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://localhost:27017"; // URL di connessione al server MongoDB
    const client = new MongoClient(uri);

    try {
        await client.connect(); // Connettersi al server MongoDB
        console.log("Connesso a MongoDB!");

        // Esempio: Creazione di un database e una collezione
        const database = client.db('miodatabase');
        const collection = database.collection('miacollezione');

        // Esempio: Inserimento di un documento
        const result = await collection.insertOne({ nome: "John", cognome: "Doe" });
        console.log(`Documento inserito con id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}

main().catch(console.error);


import  express  from  'express';
import cors from "cors";
import "dotenv/config";

const PORT = process.env.PORT;

const  app  =  express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "*" }));

// Esempio di rotta
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Application listening at port "${PORT}"`);
});
