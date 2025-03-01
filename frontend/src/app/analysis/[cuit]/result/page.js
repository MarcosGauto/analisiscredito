import { CreditResultSummary } from "@/components/credit-result-summary"
import { PdfGenerator } from "@/components/pdf-generator"

export default function ResultPage({ params }) {
    return (
        <main className="min-h-screen p-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Resultado del Análisis</h1>
                        <p className="text-muted-foreground">CUIT: {params.cuit}</p>
                    </div>
                    <PdfGenerator cuit={params.cuit} />
                </div>
                <CreditResultSummary cuit={params.cuit} />
            </div>
        </main>
    )
}

