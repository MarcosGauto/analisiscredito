const Document = require("../models/document.model")

// obtiene documentos
const getDocuments = async ( req, res) => {
    try {
        const documentos = await Document.find();
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ message: " Error obteniendo documentos"})
    }
}

//Busca los documentos

const searchDocuments = async (req, res) => {
    try {
        const { query } = req.query;
        const documentos = await Document.find({
            $or: [
                { cliente: new RegExp(query, "i") },
                { tipo: new RegExp(query, "i") }
            ]
        });
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ message: "Error en la búsqueda" });
    }
};

const deleteDocument = async ( req, res) => {
    try{
        await Document.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }catch (error){
        res.status(500).json({message: " Error eliminando documento"})
    }
}

module.exports = {getDocuments, searchDocuments, deleteDocument};