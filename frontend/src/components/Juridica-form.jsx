"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/file-upload"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    balance: z.object({
        activoCorriente: z.string().min(1, "Campo requerido"),
        activoCorrienteAnterior: z.string().min(1, "Campo requerido"),
        activoNoCorriente: z.string().min(1, "Campo requerido"),
        activoNoCorrienteAnterior: z.string().min(1, "Campo requerido"),
        totalActivo: z.string().min(1, "Campo requerido"),
        totalActivoAnterior: z.string().min(1, "Campo requerido"),
        disponibilidades: z.string().min(1, "Campo requerido"),
        disponibilidadesAnterior: z.string().min(1, "Campo requerido"),
        creditosVentas: z.string().min(1, "Campo requerido"),
        creditosVentasAnterior: z.string().min(1, "Campo requerido"),
        inventarios: z.string().min(1, "Campo requerido"),
        inventariosAnterior: z.string().min(1, "Campo requerido"),
        cuentasSocios: z.string().min(1, "Campo requerido"),
        cuentasSociosAnterior: z.string().min(1, "Campo requerido"),
        pasivoCorriente: z.string().min(1, "Campo requerido"),
        pasivoCorrienteAnterior: z.string().min(1, "Campo requerido"),
        pasivoNoCorriente: z.string().min(1, "Campo requerido"),
        pasivoNoCorrienteAnterior: z.string().min(1, "Campo requerido"),
        totalPasivo: z.string().min(1, "Campo requerido"),
        totalPasivoAnterior: z.string().min(1, "Campo requerido"),
        deudasComerciales: z.string().min(1, "Campo requerido"),
        deudasComercialesAnterior: z.string().min(1, "Campo requerido"),
        patrimonioNeto: z.string().min(1, "Campo requerido"),
        patrimonioNetoAnterior: z.string().min(1, "Campo requerido"),
        capitalSuscripto: z.string().min(1, "Campo requerido"),
        capitalSuscriptoAnterior: z.string().min(1, "Campo requerido"),
    }),
    ventas: z.object({
        actualizadas2023: z.string().min(1, "Campo requerido"),
        actualizadas2022: z.string().min(1, "Campo requerido"),
        credito2023: z.string().min(1, "Campo requerido"),
        credito2022: z.string().min(1, "Campo requerido"),
    }),
    compras: z.object({
        actualizadas2023: z.string().min(1, "Campo requerido"),
        credito2023: z.string().min(1, "Campo requerido"),
    }),
    costos: z.object({
        actualizados2023: z.string().min(1, "Campo requerido"),
        actualizados2022: z.string().min(1, "Campo requerido"),
        credito2023: z.string().min(1, "Campo requerido"),
        credito2022: z.string().min(1, "Campo requerido"),
    }),
    iva: z
        .array(
            z.object({
                fecha: z.date({ required_error: "Seleccione una fecha" }),
                debitoFiscal: z.string().min(1, "Campo requerido"),
                creditoFiscal: z.string().min(1, "Campo requerido"),
            }),
        )
        .min(1, "Debe ingresar al menos una declaración de IVA"),
    iibb: z
        .array(
            z.object({
                fecha: z.date({ required_error: "Seleccione una fecha" }),
                impuestoDeterminado: z.string().min(1, "Campo requerido"),
                baseImponible: z.string().min(1, "Campo requerido"),
            }),
        )
        .min(1, "Debe ingresar al menos una declaración de IIBB"),
})

export function JuridicaForm({ cuit }) {
    const [loading, setLoading] = useState(false)
    const [balancePdf, setBalancePdf] = useState(null)
    const [ivaPdf, setIvaPdf] = useState(null)
    const [iibbPdf, setIibbPdf] = useState(null)
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            balance: {
                activoCorriente: "",
                activoCorrienteAnterior: "",
                activoNoCorriente: "",
                activoNoCorrienteAnterior: "",
                totalActivo: "",
                totalActivoAnterior: "",
                disponibilidades: "",
                disponibilidadesAnterior: "",
                creditosVentas: "",
                creditosVentasAnterior: "",
                inventarios: "",
                inventariosAnterior: "",
                cuentasSocios: "",
                cuentasSociosAnterior: "",
                pasivoCorriente: "",
                pasivoCorrienteAnterior: "",
                pasivoNoCorriente: "",
                pasivoNoCorrienteAnterior: "",
                totalPasivo: "",
                totalPasivoAnterior: "",
                deudasComerciales: "",
                deudasComercialesAnterior: "",
                patrimonioNeto: "",
                patrimonioNetoAnterior: "",
                capitalSuscripto: "",
                capitalSuscriptoAnterior: "",
            },
            ventas: {
                actualizadas2023: "",
                actualizadas2022: "",
                credito2023: "",
                credito2022: "",
            },
            compras: {
                actualizadas2023: "",
                credito2023: "",
            },
            costos: {
                actualizados2023: "",
                actualizados2022: "",
                credito2023: "",
                credito2022: "",
            },
            iva: [{ fecha: new Date(), debitoFiscal: "", creditoFiscal: "" }],
            iibb: [{ fecha: new Date(), impuestoDeterminado: "", baseImponible: "" }],
        },
    })

    async function onSubmit(values) {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("data", JSON.stringify(values))
            if (balancePdf) formData.append("balancePdf", balancePdf)
            if (ivaPdf) formData.append("ivaPdf", ivaPdf)
            if (iibbPdf) formData.append("iibbPdf", iibbPdf)

            // Aquí iría la llamada a la API para guardar los datos
            await fetch(`/api/declarations/${cuit}`, {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            router.push(`/analysis/${cuit}/result`)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="p-4 space-y-8">
                    {/* Balance Sheet Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Balance</CardTitle>
                            <CardDescription>Información del balance de los últimos dos ejercicios</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-[#e6eef9]">
                                            <TableHead className="w-[400px] border">EJERCICIO CERRADO</TableHead>
                                            <TableHead className="text-center border">2023</TableHead>
                                            <TableHead className="text-center border">2022</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium border">ACTIVO CORRIENTE</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.activoCorriente"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.activoCorrienteAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium border">ACTIVO NO CORRIENTE</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.activoNoCorriente"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.activoNoCorrienteAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium border">TOTAL ACTIVO</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.totalActivo"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.totalActivoAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-8 border">DISPONIBILIDADES</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.disponibilidades"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.disponibilidadesAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-8 border">CREDITOS POR VENTAS</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.creditosVentas"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.creditosVentasAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-8 border">INVENTARIOS</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.inventarios"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.inventariosAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-8 border">CUENTAS PARTICULARES SOCIOS</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.cuentasSocios"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.cuentasSociosAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium border">PASIVO CORRIENTE</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.pasivoCorriente"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.pasivoCorrienteAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium border">PASIVO NO CORRIENTE</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.pasivoNoCorriente"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.pasivoNoCorrienteAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium border">TOTAL PASIVO</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.totalPasivo"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.totalPasivoAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-8 border">DEUDAS COMERCIALES</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.deudasComerciales"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.deudasComercialesAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium border">PATRIMONIO NETO</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.patrimonioNeto"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.patrimonioNetoAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="pl-8 border">CAPITAL SUSCRIPTO</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.capitalSuscripto"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="balance.capitalSuscriptoAnterior"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ventas</CardTitle>
                            <CardDescription>Información de ventas de los últimos dos ejercicios</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-[#e6eef9]">
                                            <TableHead className="w-[200px] border">Vtas cbles</TableHead>
                                            <TableHead className="border">Vtas actualiz.</TableHead>
                                            <TableHead className="border">Calculo credito</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium border">2023</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="ventas.actualizadas2023"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="ventas.credito2023"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium border">2022</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="ventas.actualizadas2022"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="ventas.credito2022"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Purchases Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Compras</CardTitle>
                            <CardDescription>Información de compras del último ejercicio</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-[#e6eef9]">
                                            <TableHead className="w-[200px] border">Compras</TableHead>
                                            <TableHead className="border">Vtas actualiz.</TableHead>
                                            <TableHead className="border">Calculo credito</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium border">2023</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="compras.actualizadas2023"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="compras.credito2023"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Costs Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Costos</CardTitle>
                            <CardDescription>Información de costos de los últimos dos ejercicios</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-[#e6eef9]">
                                            <TableHead className="w-[200px] border">Costos</TableHead>
                                            <TableHead className="border">Vtas actualiz.</TableHead>
                                            <TableHead className="border">Calculo credito</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium border">2023</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="costos.actualizados2023"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="costos.credito2023"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium border">2022</TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="costos.actualizados2022"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="border p-0">
                                                <FormField
                                                    control={form.control}
                                                    name="costos.credito2022"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="border-0 text-right" placeholder="-" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* IVA Declarations Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Declaraciones de IVA</CardTitle>
                            <CardDescription>Ingrese las declaraciones de IVA de los últimos 6 meses</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Débito Fiscal</TableHead>
                                        <TableHead>Crédito Fiscal</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {form.watch("iva").map((field, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`iva.${index}.fecha`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-[240px] pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground",
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                field.value.toLocaleDateString()
                                                                            ) : (
                                                                                <span>Seleccione una fecha</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`iva.${index}.debitoFiscal`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="pl-8 text-right" placeholder="0.00" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`iva.${index}.creditoFiscal`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="pl-8 text-right" placeholder="0.00" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={form.watch("iva").length <= 1}
                                                    onClick={() => {
                                                        const values = form.getValues("iva")
                                                        values.splice(index, 1)
                                                        form.setValue("iva", values)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const values = form.getValues("iva")
                                        values.push({ fecha: new Date(), debitoFiscal: "", creditoFiscal: "" })
                                        form.setValue("iva", values)
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agregar Declaración
                                </Button>
                                <FileUpload label="Adjuntar Declaraciones de IVA (PDF)" onFileSelect={(file) => setIvaPdf(file)} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* IIBB Declarations Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ingresos Brutos</CardTitle>
                            <CardDescription>Ingrese las declaraciones de IIBB de los últimos 6 meses</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Impuesto Determinado</TableHead>
                                        <TableHead>Base Imponible</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {form.watch("iibb").map((field, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`iibb.${index}.fecha`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-[240px] pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground",
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                field.value.toLocaleDateString()
                                                                            ) : (
                                                                                <span>Seleccione una fecha</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`iibb.${index}.impuestoDeterminado`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="pl-8 text-right" placeholder="0.00" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`iibb.${index}.baseImponible`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-2.5">$</span>
                                                                    <Input className="pl-8 text-right" placeholder="0.00" {...field} />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={form.watch("iibb").length <= 1}
                                                    onClick={() => {
                                                        const values = form.getValues("iibb")
                                                        values.splice(index, 1)
                                                        form.setValue("iibb", values)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const values = form.getValues("iibb")
                                        values.push({ fecha: new Date(), impuestoDeterminado: "", baseImponible: "" })
                                        form.setValue("iibb", values)
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agregar Declaración
                                </Button>
                                <FileUpload label="Adjuntar Declaraciones de IIBB (PDF)" onFileSelect={(file) => setIibbPdf(file)} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6">
                        <FileUpload label="Adjuntar Balance (PDF)" onFileSelect={(file) => setBalancePdf(file)} />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Procesando..." : "Continuar"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

