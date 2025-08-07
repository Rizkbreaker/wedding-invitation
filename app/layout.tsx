import type { Metadata } from "next";
import { Quicksand, Poppins } from 'next/font/google'; // Importamos las nuevas fuentes
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Jan & Natalia - Nuestra Boda 💕",
  description: "Te invitamos a celebrar nuestro amor el 7 de Octubre, 2025 ✨",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${quicksand.variable} ${poppins.variable}`}>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
