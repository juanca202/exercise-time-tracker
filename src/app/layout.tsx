import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { InicializadorAplicacion } from "@/shared/store";
import { Sidebar } from "@/shared/ui";
import "./globals.css";

// Tipografía del sistema de diseño "Precision Focus" (ver DESIGN.md): Inter
// para texto general, JetBrains Mono para contadores/metadata alineados.
// Los nombres de variable coinciden con `--font-inter`/`--font-jetbrains-mono`
// consumidos por `@theme inline` en `globals.css` (ADR-002).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TimeTracker",
  description: "Registra el tiempo dedicado a tus tareas y proyectos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="root flex min-h-full flex-1 flex-col">
          {/* Efectos de arranque (hidratación del store, almacenamiento persistente, AC-004/AC-005): no renderiza nada visual. */}
          <InicializadorAplicacion />
          <div className="flex min-h-full flex-1">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
