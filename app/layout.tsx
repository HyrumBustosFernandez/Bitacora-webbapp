import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "PaceUp",
  description: "Personal student productivity tracker",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%", display: "flex", flexDirection: "row", overflow: "hidden" }}>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
