import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Nexus AI — Powered by Groq",
  description: "Lightning-fast AI chat powered by Groq",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0b0919",
              color: "#ede9ff",
              border: "1px solid rgba(139,92,246,0.35)",
              borderRadius: "14px",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
            },
            success: { iconTheme: { primary: "#8b5cf6", secondary: "#ede9ff" } },
            error: { iconTheme: { primary: "#f472b6", secondary: "#ede9ff" } },
          }}
        />
      </body>
    </html>
  );
}
