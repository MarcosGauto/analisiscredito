import { PersonTypeSelector } from "@/components/Person-type-selector"
import { CreditInfo } from "@/components/Credit-info"

export default function AnalysisPage({ params }) {
    return (
        <main className="min-h-screen p-6 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Análisis Crediticio</h1>
                    <p className="text-muted-foreground">CUIT: {params.cuit}</p>
                </div>
                <CreditInfo cuit={params.cuit} />
                <PersonTypeSelector cuit={params.cuit} />
            </div>
        </main>
    )
}

