import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://monterra-residence.pl"),
  title: {
    default: "Monterra Residence | Nowe mieszkania w Poznaniu",
    template: "%s | Monterra Residence",
  },
  description:
    "Monterra Residence w Poznaniu — wybierz mieszkanie, sprawdź cenę, przejdź przez interaktywny spacer po wnętrzu oraz zobacz dostępne miejsca postojowe i komórki.",
  keywords: ["mieszkania Poznań", "deweloper Poznań", "nowe mieszkania", "Monterra Residence"],
  openGraph: {
    title: "Monterra Residence | Poznań",
    description: "Nowoczesna inwestycja mieszkaniowa z interaktywnym wyborem lokalu i spacerem po wnętrzu.",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/media/hero-building.webp",
        width: 1600,
        height: 900,
        alt: "Monterra Residence",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
    </html>
  );
}
