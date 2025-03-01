const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
    fecha: Date,
    ingresos: Number,
    egresos: Number,
    activos: Number,
    pasivos: Number,
});

const Balance = mongoose.model("Balance", balanceSchema);
module.exports = Balance;
