import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monterra Residence | Poznań",
  description: "Interaktywny system sprzedaży mieszkań: wybór lokalu, 3D, spacer i konfigurator ceny."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
