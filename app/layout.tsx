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
    <html lang="en" style={{ height: "100%" }}>
      <body
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <ThemeProvider>
          <StreakInit />

          {/* Sidebar — full viewport height */}
          <LeftSidebar />

          {/* Right column — topnav + scrollable main + footer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            <TopNav />
            <main
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 24,
                minHeight: 0,
              }}
            >
              {children}
            </main>
            <BottomBar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
