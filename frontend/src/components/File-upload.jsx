"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FileUpload({ label, onFileSelect }) {
    const [fileName, setFileName] = useState("")

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.type !== "application/pdf") {
                alert("Por favor, seleccione un archivo PDF")
                e.target.value = ""
                return
            }
            setFileName(file.name)
            onFileSelect(file)
        }
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="pdf-upload">{label}</Label>
            <div className="flex items-center gap-2">
                <Input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("pdf-upload").click()}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Seleccionar PDF
                </Button>
            </div>
            {fileName && <p className="text-sm text-muted-foreground">Archivo seleccionado: {fileName}</p>}
        </div>
    )
}

