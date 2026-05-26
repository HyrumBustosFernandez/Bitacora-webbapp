import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import TopNav from "@/components/TopNav";
import LeftSidebar from "@/components/LeftSidebar";
import BottomBar from "@/components/BottomBar";
import StreakInit from "@/components/StreakInit";

export const metadata: Metadata = {
  title: "PaceUp",
  description: "Personal student productivity tracker",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" style={{ height: '100%' }}>
      <body style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ThemeProvider>
          <StreakInit />
          <TopNav />
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <LeftSidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <main style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {children}
              </main>
              <BottomBar />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
