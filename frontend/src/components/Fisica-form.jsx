"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUpload } from "@/components/file-upload"
import { cn } from "@/lib/utils"

const formSchema = z.object({
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

export function FisicaForm({ cuit }) {
    const [loading, setLoading] = useState(false)
    const [ivaPdf, setIvaPdf] = useState(null)
    const [iibbPdf, setIibbPdf] = useState(null)
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            iva: [{ fecha: new Date(), debitoFiscal: "", creditoFiscal: "" }],
            iibb: [{ fecha: new Date(), impuestoDeterminado: "", baseImponible: "" }],
        },
    })

    const {
        fields: ivaFields,
        append: appendIva,
        remove: removeIva,
    } = useFieldArray({
        control: form.control,
        name: "iva",
    })

    const {
        fields: iibbFields,
        append: appendIibb,
        remove: removeIibb,
    } = useFieldArray({
        control: form.control,
        name: "iibb",
    })

    async function onSubmit(values) {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("data", JSON.stringify(values))
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
                {/* IVA */}
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
                                {ivaFields.map((field, index) => (
                                    <TableRow key={field.id}>
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
                                                                        {field.value ? field.value.toLocaleDateString() : <span>Seleccione una fecha</span>}
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
                                                            <Input placeholder="0.00" {...field} />
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
                                                            <Input placeholder="0.00" {...field} />
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
                                                disabled={ivaFields.length === 1}
                                                onClick={() => removeIva(index)}
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
                                onClick={() => appendIva({ fecha: new Date(), debitoFiscal: "", creditoFiscal: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Declaración
                            </Button>
                            <FileUpload label="Adjuntar Declaraciones de IVA (PDF)" onFileSelect={(file) => setIvaPdf(file)} />
                        </div>
                    </CardContent>
                </Card>

                {/* IIBB */}
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
                                {iibbFields.map((field, index) => (
                                    <TableRow key={field.id}>
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
                                                                        {field.value ? field.value.toLocaleDateString() : <span>Seleccione una fecha</span>}
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
                                                            <Input placeholder="0.00" {...field} />
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
                                                            <Input placeholder="0.00" {...field} />
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
                                                disabled={iibbFields.length === 1}
                                                onClick={() => removeIibb(index)}
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
                                onClick={() => appendIibb({ fecha: new Date(), impuestoDeterminado: "", baseImponible: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Declaración
                            </Button>
                            <FileUpload label="Adjuntar Declaraciones de IIBB (PDF)" onFileSelect={(file) => setIibbPdf(file)} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Procesando..." : "Continuar"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

