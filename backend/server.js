require("dotenv").config(); // Cargar las variables de entorno al inicio

const express = require("express");
const mongoose = require("mongoose");

console.log("🔍 MONGO_URL:", process.env.MONGO_URL); // Verifica que la variable se cargue correctamente

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URL || process.env.DATABASE_URL;

if (!mongoURI) {
    console.error("❌ ERROR: La variable MONGO_URL no está definida. Revisa tu .env");
    process.exit(1);
}

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("🔥 Conectado a MongoDB"))
    .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
