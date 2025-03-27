"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { LocationInfo } from "./location-info"
import { IndicatorsSummary } from "./indicators-summary"
import { QualificationSummary } from "./qualification-summary"

export function CreditInfo({ cuit }) {
    const [loading, setLoading] = useState(true)
    const [creditData, setCreditData] = useState(null)
    const [bankData, setBankData] = useState(null)
    const [qualificationData, setQualificationData] = useState(null)

    const periodos = creditData?.results?.periodos || [];
    const entidades = periodos?.[0]?.entidades || [];
    const situacionMaxima = entidades.length > 0 
        ? Math.max(...entidades.map(e => e.situacion)) 
        : null;
    const totalMonto = entidades.reduce((sum, e) => sum + e.monto, 0);
    const diasAtraso = entidades.reduce((sum, e) => sum + e.diasAtrasoPago,0)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [creditResponse, bankResponse, qualificationResponse] = await Promise.all([
                    fetch(`/api/bcra/${cuit}`),
                    fetch(`/api/bank/${cuit}`),
                    fetch(`/api/qualification/${cuit}`),
                    fetch(`/api/cheques/${cuit}`),
                ])

                const creditData = await creditResponse.json()
                const bankData = await bankResponse.json()
                const qualificationData = await qualificationResponse.json()

                setCreditData(creditData)
                setBankData(bankData)
                setQualificationData(qualificationData)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [cuit])

    if (loading) {
        return <LoadingSkeleton />
    }

    if (!creditData || !bankData || !qualificationData) {
        return <div>No se encontró información para el CUIT proporcionado</div>
    }

    const chequeRechazados = creditData.causales?.some(causal =>
        causal.entidades?.some(entidad =>entidad.detalle?.length > 0)
    )
    const totalDisponible = bankData.saldoCuenta + bankData.valoresCartera

    // Datos de ejemplo para los indicadores
    const indicatorsData = {
        ventasContables: 15000000,
        ventasIIBB: 14500000,
        ventasIVA: 14800000,
        promedio: 14766666.67,
        patrimonio: 20000000,
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard title="Información General">
                    <dl className="space-y-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">Denominación</dt>
                            <dd className="font-medium">{creditData.results?.denominacion}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Situación maxima con entidades</dt>
                            <dd className="font-medium">{situacionMaxima !== null ? `Situacion ${situacionMaxima}` : "No disponible"} </dd>
                        </div>

                    </dl>
                </InfoCard>

                <InfoCard title="Situación Crediticia">
                    <dl className="space-y-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">Monto</dt>
                            <dd className="font-medium">{formatCurrency(totalMonto)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Días de Atraso</dt>
                            <dd className="font-medium">{diasAtraso}</dd>
                        </div>
                    </dl>
                </InfoCard>

                <InfoCard title="Estado Legal">
                    <dl className="space-y-2">
                        <div>
                            <dt className="text-sm text-muted-foreground">Situación Jurídica</dt>
                            <dd className="font-medium">{creditData.situacionJuridica}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Cheques rechazados</dt>
                            <dd className="font-medium">{chequeRechazados ? "Sí" : "No"}</dd>
                        </div>
                    </dl>
                </InfoCard>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Información GBP</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <BankInfoItem label="Crédito Asignado" value={bankData.creditoAsignado} />
                            <BankInfoItem label="Saldo en Cuenta" value={bankData.saldoCuenta} />
                            <BankInfoItem label="Valores en Cartera" value={bankData.valoresCartera} />
                            <BankInfoItem label="Total Disponible" value={totalDisponible} highlighted />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <LocationInfo />

        </div>
    )
}

function BankInfoItem({ label, value, highlighted = false }) {
    return (
        <div className={`p-4 rounded-lg ${highlighted ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className={`text-2xl font-semibold mt-1 ${highlighted ? "text-primary" : ""}`}>{formatCurrency(value)}</dd>
        </div>
    )
}

function InfoCard({ title, children }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-[150px]" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

