import { PersonTypeSelector } from "@/components/Person-type-selector";
import { CreditInfo } from "@/components/Credit-info";

export default async function AnalysisPage({ params }) {
    const cuit = params?.cuit; // Esperamos a que params esté disponible

    if (!cuit) {
        return <div>Error: No se proporcionó un CUIT válido.</div>;
    }

    return (
        <main className="min-h-screen p-6 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Análisis Crediticio</h1>
                    <p className="text-muted-foreground">CUIT: {cuit}</p>
                </div>
                <CreditInfo cuit={cuit} />
                <PersonTypeSelector cuit={cuit} />
            </div>
        </main>
    );
}
