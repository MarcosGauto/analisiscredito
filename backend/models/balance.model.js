const mongoose = require("mongoose");

const BalanceSchema = new mongoose.Schema({
    fecha: Date,
    ingresos: Number,
    egresos: Number,
    activos: Number,
    pasivos: Number,
},{ timestamps: true });

module.exports = mongoose.model("Balance", BalanceSchema);
