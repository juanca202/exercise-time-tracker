import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Sidebar } from "@/features/time-tracking/components/sidebar";
import { StoreHydrator } from "@/features/time-tracking/components/store-hydrator";
import "./globals.css";

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
  description: "Registra el tiempo dedicado a tus proyectos y tareas.",
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
        <div className="root flex min-h-full flex-1">
          <StoreHydrator />
          <Sidebar />
          <main className="min-w-0 flex-1 overflow-y-auto bg-surface p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
