import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SectionHeader } from "@/shared/layout/section-header";
import { SidebarNav } from "@/shared/layout/sidebar-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TimeTracker",
  description: "Registra el tiempo que dedicas a tus proyectos y tareas.",
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
      <body className="h-full overflow-hidden">
        <div className="root flex h-full">
          <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-outline-variant bg-background px-4 py-6">
            <SectionHeader />
            <SidebarNav />
          </aside>
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
