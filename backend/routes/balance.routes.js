const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balance.controller"); // Corrige el nombre y ruta
const checkJwt = require("../middlewares/auth0.middleware");

console.log(balanceController);


// Rutas para manejar los balances
router.post("/", checkJwt, balanceController.createBalance);  // Solo usuarios autenticados pueden crear balances
router.get("/", balanceController.getBalances); // Obtiene todos los balances
router.get("/:id", balanceController.getBalance); // Obtiene un balance por id
router.put("/:id", checkJwt, balanceController.updateBalance); // Solo usuarios autenticados pueden actualizar balance
router.delete("/:id", checkJwt, balanceController.deleteBalance); // Solo usuarios autenticados pueden eliminar balance

// Ruta para obtener el PDF de un balance específico
router.get("/:id/pdf", balanceController.getBalancePdf);

module.exports = router;


