import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Bitácora",
  description: "Personal student productivity tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-[#080808] text-[#EDE8DC]">
        <TopNav />
        <main className="flex flex-col flex-1 p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
