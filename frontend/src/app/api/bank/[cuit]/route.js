import { NextResponse } from "next/server"

// Datos de ejemplo
const mockDatabase = {
    20123456789: {
        creditoAsignado: 2000000,
        saldoCuenta: 350000,
        valoresCartera: 850000,
    },
    30123456789: {
        creditoAsignado: 10000000,
        saldoCuenta: 1500000,
        valoresCartera: 2500000,
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
        console.error("Error en API Bank:", error)
        return new NextResponse(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}

