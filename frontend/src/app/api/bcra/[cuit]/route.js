import { NextResponse } from "next/server"

// Asegurarse de que la función GET sea asíncrona y use la estructura correcta
export async function GET(req, context) {
    try {
        const cuit = context.params.cuit

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Validar formato de CUIT
        if (!/^\d{11}$/.test(cuit)) {
            return new NextResponse(JSON.stringify({ error: "Formato de CUIT inválido" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            })
        }

        // Llamada al backend para obtener los datos del BCRA
        const res = await  fetch(`https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/${cuit}`);

        if (!res.ok) {
            const errorData = await res.json()
            return new NextResponse(JSON.stringify({ error: errorData.error || "No se pudo obtener la información" }), {
                status: res.status,
                headers: { "Content-Type": "application/json" },
            })
        }

        // Obtener los datos de la respuesta
        const data = await res.json()

        // Retornar los datos obtenidos
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        console.error("Error al obtener datos del BCRA:", error)
        return new NextResponse(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
