import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { cuit } = params;
        const API_URL = `https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/${cuit}`;

        console.log(`🔍 Consultando CUIT: ${cuit}`);

        const res = await fetch(API_URL, { method: "GET" });

        if (!res.ok) {
            return NextResponse.json({ error: "No se encontraron datos" }, { status: res.status });
        }

        const data = await res.json();

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("❌ Error al obtener datos del BCRA:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
