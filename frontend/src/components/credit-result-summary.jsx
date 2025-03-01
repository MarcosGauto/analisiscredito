"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { IndicatorsSummary } from "@/components/indicators-summary"
import { QualificationSummary } from "@/components/qualification-summary"

export function CreditResultSummary({ cuit }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [declarationsResponse, qualificationResponse] = await Promise.all([
                    fetch(`/api/declarations/${cuit}`),
                    fetch(`/api/qualification/${cuit}`),
                ])

                const declarationsData = await declarationsResponse.json()
                const qualificationData = await qualificationResponse.json()

                // Calcular el promedio de ventas
                const ventasIVA = declarationsData.iva.reduce((acc, curr) => acc + Number.parseFloat(curr.debitoFiscal), 0)
                const ventasIIBB = declarationsData.iibb.reduce((acc, curr) => acc + Number.parseFloat(curr.baseImponible), 0)
                const ventasContables = declarationsData.balance?.ventas || 0

                const promedio = (ventasIVA + ventasIIBB + ventasContables) / 3
                const patrimonio = Number.parseFloat(declarationsData.balance?.patrimonioNeto || 0)

                setData({
                    indicators: {
                        ventasContables,
                        ventasIIBB,
                        ventasIVA,
                        promedio,
                        patrimonio,
                    },
                    qualification: qualificationData,
                })
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

    if (!data) {
        return (
            <Card>
                <CardContent className="py-10">
                    <p className="text-center text-muted-foreground">No se encontró información para el CUIT proporcionado</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Análisis Final</CardTitle>
                    <CardDescription>Resultado del proceso de evaluación crediticia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <IndicatorsSummary {...data.indicators} />
                    <QualificationSummary {...data.qualification} />
                </CardContent>
            </Card>
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-[150px]" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-6 w-[120px]" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-[150px]" />
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-[100px]" />
                                        <Skeleton className="h-6 w-[120px]" />
                                    </div>
                                ))}
                            </div>
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-8 w-[150px]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

