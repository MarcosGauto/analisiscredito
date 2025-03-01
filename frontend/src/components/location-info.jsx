"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Building } from "lucide-react";

export function LocationInfo() {
    const [address, setAddress] = useState("");
    const [mapUrl, setMapUrl] = useState("");
    const [web, setWeb] = useState("www.empresa.com");
    const [sucursales, setSucursales] = useState("0");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const encodedAddress = encodeURIComponent(address);
            setMapUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=400x200&key=YOUR_API_KEY`);
        } catch (error) {
            console.error("Error fetching map:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ubicación</CardTitle>
                <CardDescription>Información de la ubicación y sucursales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Búsqueda de dirección */}
                <div className="flex gap-2">
                    <Input placeholder="Ingrese la dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <Button onClick={handleSearch} disabled={loading || !address}>
                        Buscar
                    </Button>
                </div>

                {/* Mapa */}
                {mapUrl && (
                    <div className="relative h-[200px] w-full rounded-md overflow-hidden">
                        <Image src={mapUrl} alt="Mapa de ubicación" fill className="object-cover" />
                    </div>
                )}

                {/* Información editable */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                    {/* Dirección */}
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Casa Central" />
                    </div>

                    {/* Web */}
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Input value={web} onChange={(e) => setWeb(e.target.value)} placeholder="Ingrese la web" />
                    </div>

                    {/* Sucursales */}
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <Input type="number" value={sucursales} onChange={(e) => setSucursales(e.target.value)} className="w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
