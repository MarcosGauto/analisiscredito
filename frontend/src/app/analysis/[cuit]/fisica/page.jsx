import { FisicaForm } from "@/components/Fisica-form"

export default function FisicaPage({ params }) {
    return (
        <main className="min-h-screen p-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Análisis Persona Física</h1>
                    <p className="text-muted-foreground">CUIT: {params.cuit}</p>
                </div>
                <FisicaForm cuit={params.cuit} />
            </div>
        </main>
    )
}

