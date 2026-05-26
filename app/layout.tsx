import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import LeftSidebar from "@/components/LeftSidebar";
import StreakInit from "@/components/StreakInit";

export const metadata: Metadata = {
  title: "Bitácora",
  description: "Personal student productivity tracker",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" style={{ height: '100%' }}>
      <body
        className="bg-[#080808] text-[#EDE8DC]"
        style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <StreakInit />
        <TopNav />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <LeftSidebar />
          <main style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
