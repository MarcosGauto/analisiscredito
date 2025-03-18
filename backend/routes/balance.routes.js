const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin"); // Importa Firestore
const checkJwt = require("../middlewares/auth0.middleware");

// 🔹 Crear un balance (protegido con Auth0)
router.post("/", checkJwt, async (req, res) => {
    try {
        const nuevoBalance = req.body;
        const docRef = await db.collection("balances").add(nuevoBalance);
        res.status(201).json({ id: docRef.id, ...nuevoBalance });
    } catch (error) {
        console.error("❌ Error al crear balance:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Obtener todos los balances
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("balances").get();
        const balances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(balances);
    } catch (error) {
        console.error("❌ Error al obtener balances:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Obtener un balance por ID
router.get("/:id", async (req, res) => {
    try {
        const doc = await db.collection("balances").doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Balance no encontrado" });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("❌ Error al obtener balance:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Actualizar un balance (protegido con Auth0)
router.put("/:id", checkJwt, async (req, res) => {
    try {
        const balanceRef = db.collection("balances").doc(req.params.id);
        await balanceRef.update(req.body);
        res.json({ id: req.params.id, ...req.body });
    } catch (error) {
        console.error("❌ Error al actualizar balance:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Eliminar un balance (protegido con Auth0)
router.delete("/:id", checkJwt, async (req, res) => {
    try {
        await db.collection("balances").doc(req.params.id).delete();
        res.json({ message: "Balance eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar balance:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Generar PDF (Placeholder, necesitas implementar la lógica)
router.get("/:id/pdf", async (req, res) => {
    res.json({ message: "Función de PDF aún no implementada" });
});

module.exports = router;
