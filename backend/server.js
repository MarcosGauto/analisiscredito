require("dotenv").config({ path: ".env.local" });
require("dotenv").config();


const express = require("express");
const cors = require("cors");
const { db } = require("./firebase"); // Importar Firestore

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`📢 Petición recibida: ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
