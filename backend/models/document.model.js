const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    cliente: String,
    tipo: String,
    fecha: Date,
    archivoUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Document", DocumentSchema);
