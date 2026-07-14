import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Sidebar } from "@/shared/ui/Sidebar";
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
  title: "Time Tracker",
  description:
    "Registro y seguimiento de tiempo por Tarea y Proyecto, con historial y totales acumulados.",
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
        <div className="root flex min-h-full flex-1 flex-row">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
