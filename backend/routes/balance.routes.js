const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balance.controller");
const checkJwt = require("../middlewares/auth0.middleware");

const balanceRoutes = require("../routes/balance.routes"); // Importa las rutas
app.use("/api/balances", balanceRoutes);


// Rutas para manejar los balances
/* router.post("/", checkJwt, balanceController.createBalance);  // Solo usuarios autenticados pueden crear balances
router.get("/", balanceController.getBalances); // Obtiene todos los balances
router.get("/:id", balanceController.getBalance); // Obtiene un balance por id
router.put("/:id", checkJwt, balanceController.updateBalance); // Solo usuarios autenticados pueden actualizar balance
router.delete("/:id", checkJwt, balanceController.deleteBalance); // Solo usuarios autenticados pueden eliminar balance */
router.post("/", checkJwt, balanceController.createBalance);
router.get("/", balanceController.getBalances);
router.get("/:id", balanceController.getBalance);
router.put("/:id", checkJwt, balanceController.updateBalance);
router.delete("/:id", checkJwt, balanceController.deleteBalance);
router.get("/:id/pdf", balanceController.getBalancePdf);

// Ruta para obtener el PDF de un balance específico
router.get("/:id/pdf", balanceController.getBalancePdf);

module.exports = router;


