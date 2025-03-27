// app/layout.js

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Analisis Crediticio</title>
      </head>
      <body className="antialiased bg-gray-200 text-gray-800">
        {children}  {/* El contenido de la página se inyecta aquí */}
      </body>
    </html>
  );
}
