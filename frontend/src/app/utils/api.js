const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchDocuments = async (query = "") => {
    const res = await fetch(`${API_URL}/api/documents${query ? `/search?query=${query}` : ""}`);
    if (!res.ok) throw new Error("Error obteniendo documentos");
    return res.json();
};

export const deleteDocument = async (id) => {
    const res = await fetch(`${API_URL}/api/documents/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error eliminando documento");
};
