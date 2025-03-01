"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    cuit: z
        .string()
        .length(11, "El CUIT debe tener 11 dígitos")
        .regex(/^[0-9]+$/, "El CUIT solo debe contener números"),
})

export function CuitForm() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cuit: "",
        },
    })

    async function onSubmit(values) {
        setLoading(true)
        try {
            const response = await fetch(`/api/bcra/${values.cuit}`)
            if (!response.ok) throw new Error("Error al consultar el CUIT")

            router.push(`/analysis/${values.cuit}`)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo procesar el CUIT. Por favor, intente nuevamente.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Consulta de CUIT</CardTitle>
                <CardDescription>Ingrese el CUIT sin guiones para comenzar el análisis</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="cuit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CUIT</FormLabel>
                                    <FormControl>
                                        <Input placeholder="20123456789" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Consultando..." : "Consultar"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

