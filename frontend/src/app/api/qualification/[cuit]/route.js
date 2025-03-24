import { NextResponse } from "next/server";

// Example data
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
};

export async function GET(req, context) {
    try {
        // Await the params object
        const { params } = context;
        const { cuit } = await params;

        if (!cuit) {
            return NextResponse.json({ error: "CUIT no proporcionado" }, { status: 400 });
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Validate CUIT format
        if (!/^\d{11}$/.test(cuit)) {
            return NextResponse.json({ error: "Formato de CUIT inválido" }, { status: 400 });
        }

        // Retrieve data from the mock database
        const data = mockDatabase[cuit];

        if (!data) {
            return NextResponse.json({ error: "CUIT no encontrado" }, { status: 404 });
        }

        // Return the retrieved data
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error en API Bank:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
