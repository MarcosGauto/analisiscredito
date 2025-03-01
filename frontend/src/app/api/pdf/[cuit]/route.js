import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"

export async function GET(req, context) {
    try {
        const cuit = context.params.cuit

        // Obtener todos los datos necesarios
        const [declarationsRes, qualificationRes, bankRes, bcraRes] = await Promise.all([
            fetch(`${req.nextUrl.origin}/api/declarations/${cuit}`),
            fetch(`${req.nextUrl.origin}/api/qualification/${cuit}`),
            fetch(`${req.nextUrl.origin}/api/bank/${cuit}`),
            fetch(`${req.nextUrl.origin}/api/bcra/${cuit}`),
        ])

        const declarations = await declarationsRes.json()
        const qualification = await qualificationRes.json()
        const bank = await bankRes.json()
        const bcra = await bcraRes.json()

        // Crear el PDF
        const doc = new PDFDocument()
        const chunks = []

        doc.on("data", (chunk) => chunks.push(chunk))

        // Título
        doc.font("Helvetica-Bold").fontSize(20).text("Análisis Crediticio", { align: "center" }).moveDown()

        doc.font("Helvetica").fontSize(12).text(`CUIT: ${cuit}`, { align: "center" }).moveDown().moveDown()

        // Información del BCRA
        doc.font("Helvetica-Bold").fontSize(14).text("Información BCRA").moveDown()

        doc
            .font("Helvetica")
            .fontSize(12)
            .text(`Denominación: ${bcra.denominacion}`)
            .text(`Situación: ${bcra.situacionJuridica}`)
            .text(`Monto: ${formatCurrency(bcra.monto)}`)
            .moveDown()

        // Información Bancaria
        doc.font("Helvetica-Bold").fontSize(14).text("Información Bancaria").moveDown()

        doc
            .font("Helvetica")
            .fontSize(12)
            .text(`Crédito Asignado: ${formatCurrency(bank.creditoAsignado)}`)
            .text(`Saldo en Cuenta: ${formatCurrency(bank.saldoCuenta)}`)
            .text(`Valores en Cartera: ${formatCurrency(bank.valoresCartera)}`)
            .moveDown()

        // Indicadores
        if (declarations.iva && declarations.iibb) {
            const ventasIVA = declarations.iva.reduce((acc, curr) => acc + Number.parseFloat(curr.debitoFiscal), 0)
            const ventasIIBB = declarations.iibb.reduce((acc, curr) => acc + Number.parseFloat(curr.baseImponible), 0)
            const ventasContables = declarations.balance?.ventas || 0
            const promedio = (ventasIVA + ventasIIBB + ventasContables) / 3

            doc.font("Helvetica-Bold").fontSize(14).text("Indicadores").moveDown()

            doc
                .font("Helvetica")
                .fontSize(12)
                .text(`Ventas IVA: ${formatCurrency(ventasIVA)}`)
                .text(`Ventas IIBB: ${formatCurrency(ventasIIBB)}`)
                .text(`Ventas Contables: ${formatCurrency(ventasContables)}`)
                .text(`Promedio: ${formatCurrency(promedio)}`)
                .moveDown()
        }

        // Calificación
        doc.font("Helvetica-Bold").fontSize(14).text("Calificación Crediticia").moveDown()

        doc
            .font("Helvetica")
            .fontSize(12)
            .text(`Pre-Calificación: ${qualification.preCalificacion}`)
            .text(`Calificación Final: ${qualification.calificacionFinal}`)
            .text(`Condición de Venta: ${qualification.condicionVenta}`)
            .text(`Monto Máximo: ${formatCurrency(qualification.montoMaximo)}`)
            .moveDown()

        // Finalizar el PDF
        doc.end()

        // Convertir chunks a Buffer
        const pdfBuffer = Buffer.concat(chunks)

        // Retornar el PDF
        return new Response(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=analisis-crediticio-${cuit}.pdf`,
            },
        })
    } catch (error) {
        console.error("Error generando PDF:", error)
        return NextResponse.json({ error: "Error generando PDF" }, { status: 500 })
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(amount)
}

