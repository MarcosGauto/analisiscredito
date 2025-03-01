const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const balanceRoutes = require("./routes/balance.routes");

const app = express();

app.use(express.json());
app.use("/api/balances", balanceRoutes);  // Ruta para balances

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("🔥 Conectado a MongoDB"))
    .catch((err) => console.error("Error conectando a MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
