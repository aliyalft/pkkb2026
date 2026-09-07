import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import "./font-variables.css";

const bricologe = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});



export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  title: "PKKB 2026 — Pekan Kebudayaan Kota Bandung",
  description:
    "Pekan Kebudayaan Kota Bandung 2026 — Ngamumule Budaya, Ngawangun Kota.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${bricologe.variable} ${hanken.variable}`}>
        {children}
      </body>
    </html>

    
  );
}