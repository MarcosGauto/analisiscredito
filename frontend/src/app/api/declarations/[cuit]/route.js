import { NextResponse } from "next/server"

// Datos de ejemplo
const mockDatabase = {
    20123456789: {
        iva: [
            {
                fecha: "2024-01-15",
                debitoFiscal: "150000",
                creditoFiscal: "80000",
            },
            {
                fecha: "2023-12-15",
                debitoFiscal: "180000",
                creditoFiscal: "95000",
            },
            {
                fecha: "2023-11-15",
                debitoFiscal: "165000",
                creditoFiscal: "88000",
            },
        ],
        iibb: [
            {
                fecha: "2024-01-15",
                impuestoDeterminado: "45000",
                baseImponible: "1500000",
            },
            {
                fecha: "2023-12-15",
                impuestoDeterminado: "52000",
                baseImponible: "1733333",
            },
            {
                fecha: "2023-11-15",
                impuestoDeterminado: "48000",
                baseImponible: "1600000",
            },
        ],
    },
    30123456789: {
        iva: [
            {
                fecha: "2024-01-15",
                debitoFiscal: "850000",
                creditoFiscal: "420000",
            },
            {
                fecha: "2023-12-15",
                debitoFiscal: "920000",
                creditoFiscal: "480000",
            },
            {
                fecha: "2023-11-15",
                debitoFiscal: "880000",
                creditoFiscal: "445000",
            },
        ],
        iibb: [
            {
                fecha: "2024-01-15",
                impuestoDeterminado: "255000",
                baseImponible: "8500000",
            },
            {
                fecha: "2023-12-15",
                impuestoDeterminado: "276000",
                baseImponible: "9200000",
            },
            {
                fecha: "2023-11-15",
                impuestoDeterminado: "264000",
                baseImponible: "8800000",
            },
        ],
        balance: {
            activoCorriente: "15000000",
            activoNoCorriente: "25000000",
            pasivoCorriente: "8000000",
            pasivoNoCorriente: "12000000",
            patrimonioNeto: "20000000",
        },
    },
}

export async function GET(req, context) {
    try {
        const cuit = context.params.cuit

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 1200))

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
        console.error("Error en API Declarations:", error)
        return new NextResponse(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}

export async function POST(req, context) {
    try {
        const cuit = context.params.cuit
        const data = await req.json()

        // Validar formato de CUIT
        if (!/^\d{11}$/.test(cuit)) {
            return new NextResponse(JSON.stringify({ error: "Formato de CUIT inválido" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            })
        }

        // Simular guardado en base de datos
        console.log(`Guardando datos para CUIT ${cuit}:`, data)

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return new NextResponse(
            JSON.stringify({
                message: "Datos guardados exitosamente",
                cuit,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            },
        )
    } catch (error) {
        console.error("Error en API Declarations POST:", error)
        return new NextResponse(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}

