import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/shared/ui/app-shell/AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Time Tracker",
  description:
    "Aplicación offline-first para organizar el tiempo dedicado a tus tareas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="root flex min-h-full flex-1 flex-col">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
