const Balance = require("../models/balance.model"); // Ruta relativa al controlador


const createBalance = async (req, res) => {
    try {
        const { fecha, ingresos, egresos, activos, pasivos } = req.body;
        const balance = new Balance({ fecha, ingresos, egresos, activos, pasivos });
        await balance, save();
        res.status(201).json(balance);
    } catch (error) {
        resizeTo.status(400).json({ message: error.message })
    }
}

const getBalances = async (req, res) => {
    try {
        const balances = await Balance.find();
        res.status(200).json(balances);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getBalance = async (req, res) => {
    try {
        const balance = await Balance.findById(req.params.id);
        if (!balance) return res.status(404).json({ message: " Balance no encontrado" });
        res.status(200).json(balance);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const updateBalance = async (req, res) => {
    try {
        const uopdateBalance = await Balance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(uopdateBalance)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const deleteBalance = async (req, res) => {
    try {
        await Balance.findByIdAndDelete(req.params.id)
        res.status(204).json();
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const generatePdf = require("../utils/pdfGenerator");

const getBalancePdf = async (req, res) => {
    try {
        const balance = await Balance.findById(req.params.id);
        const pdf = await generatePdf(balance);
        res.contentType("application/pdf");
        res.send(pdf);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = { createBalance, getBalances, getBalance, updateBalance, deleteBalance };
