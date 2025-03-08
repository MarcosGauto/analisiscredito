require("dotenv").config({ path: ".env.local" });

const express = require("express");
const mongoose = require("mongoose");

const balanceRoutes = require("./routes/balance.routes")
const documentRoutes = require("./routes/document.routes")
const cors = require("cors");

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // URL de tu frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

app.use("/api/balances", balanceRoutes);
app.use("api/documents", documentRoutes);



app.use((req, res, next) => {
    console.log(`📢 Petición recibida: ${req.method} ${req.url}`);
    next();
});


const mongoURI = process.env.MONGO_URL || process.env.DATABASE_URL;

if (!mongoURI) {
    console.error("❌ ERROR: La variable MONGO_URL no está definida. Revisa tu .env");
    process.exit(1);
}

mongoose

    .connect(mongoURI)
    .then(() => console.log("🔥 Conectado a MongoDB"))
    .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
