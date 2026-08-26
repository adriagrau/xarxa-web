import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers"; // <-- Importamos nuestro envoltorio cliente
import CookieBanner from "@/components/CookieBanner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xarxa Mujeres con Discapacidad",
  description: "Asociación de utilidad pública en Valencia",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
<CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
