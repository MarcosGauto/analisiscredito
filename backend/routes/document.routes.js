const express = require("express");
const router = express.Router();
const documentController = require ("../controllers/document.controller")

router.get("/", documentController.getDocuments);
router.get("/search", documentController.searchDocuments);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;