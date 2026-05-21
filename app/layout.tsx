import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
