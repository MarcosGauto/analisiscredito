import { NextResponse } from "next/server"

// Datos de ejemplo
const mockDatabase = {
    20123456789: {
        denominacion: "Juan Pérez",
        fechaSituacion: "2024-02-16",
        monto: 1500000,
        diasAtraso: 0,
        refinanciaciones: "Sin refinanciaciones",
        recategorizacionObligatoria: false,
        situacionJuridica: "Normal",
        irrecuperabilidad: false,
        enRevision: false,
        procesoJudicial: false,
    },
    30123456789: {
        denominacion: "Empresa ABC S.A.",
        fechaSituacion: "2024-02-16",
        monto: 5000000,
        diasAtraso: 15,
        refinanciaciones: "1 refinanciación activa",
        recategorizacionObligatoria: true,
        situacionJuridica: "En observación",
        irrecuperabilidad: false,
        enRevision: true,
        procesoJudicial: false,
    },
}

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
        console.error("Error en API BCRA:", error)
        return new NextResponse(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}

