import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kommunicate",
  description: "Communication request management for KGS Consulting",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-surface font-sans text-sm leading-5 text-text antialiased">
        {children}
      </body>
    </html>
  );
}
