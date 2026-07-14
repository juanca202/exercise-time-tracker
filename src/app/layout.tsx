import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { InicializadorAplicacion } from "@/shared/store";
import { Sidebar } from "@/shared/ui";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
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
