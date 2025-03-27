import https from "https";
import fs from "fs";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    try {
        // Await the params object before accessing its properties
        const { params } = context;
        const { cuit } = await params;

        // Validate the CUIT format
        if (!cuit || !/^\d{11}$/.test(cuit)) {
            console.error("Invalid CUIT:", cuit);
            return NextResponse.json({ error: "Invalid CUIT" }, { status: 400 });
        }

        // Construct the absolute path to the certificate
        const certPath = process.cwd() + '/certificates/bcra_cert.pem';
        if (!fs.existsSync(certPath)) {
            throw new Error(`Certificate not found at: ${certPath}`);
        }

        const cert = fs.readFileSync(certPath);

        // Configure the HTTPS agent with the certificate
        const agent = new https.Agent({
            ca: cert,
            rejectUnauthorized: true // Validate the certificate
        });

        // BCRA API URL
        const apiUrlcheque = `https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/ChequesRechazados/${cuit}`;
        
        console.log("API URL:", apiUrlcheque);

        // Make the API request
        const response = await fetch(apiUrlcheque, {
            agent, // Use the HTTPS agent
            headers: { "Content-Type": "application/json" },
        });

        // Check if the response is successful
        if (!response.ok) {
            console.error("API response error:", response.status);
            throw new Error(`BCRA API error: ${response.status}`);
        }

        // Parse the response data
        const data = await response.json();

        // Log the received data
        console.log("Data received from API:", data);

        // Return the response with the received data
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("❌ BCRA API error:", error.message);
        return NextResponse.json({ error: "Error querying BCRA" }, { status: 500 });
    }
}
