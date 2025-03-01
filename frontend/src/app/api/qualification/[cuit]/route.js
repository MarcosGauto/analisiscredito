import { NextResponse } from "next/server"

// Datos de ejemplo
const mockDatabase = {
    20123456789: {
        preCalificacion: "Aprobado",
        calificacionFinal: "A+",
        condicionVenta: "Crédito a 30 días",
        montoMaximo: 2500000,
    },
    30123456789: {
        preCalificacion: "Pre-Aprobado",
        calificacionFinal: "B",
        condicionVenta: "Crédito a 15 días con garantía",
        montoMaximo: 1500000,
    },
}

export async function GET(req, context) {
    try {
        const cuit = context.params.cuit

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Validar formato de CUIT
        if (!/^\d{11}$/.test(cuit)) {
            return new NextResponse(JSON.stringify({ error: "Formato de CUIT inválido" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            })
        }

        // Buscar datos en el mock
        const data = mockDatabase[cuit]

        if (!data) {
            return new NextResponse(JSON.stringify({ error: "CUIT no encontrado" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            })
        }

        // Retornar los datos encontrados
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        console.error("Error en API Qualification:", error)
        return new NextResponse(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}

