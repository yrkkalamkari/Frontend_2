import { Playfair_Display, Inter } from "next/font/google";
import { SWRConfig } from "swr";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"] });

export const metadata = {
  title: "YRK Collections — Handcrafted Kalamkari Textiles",
  description: "YRK Collections — traditional Kalamkari sarees, dupattas, and fabric, hand block-print and pen-kalamkari work.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#7B2632",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <SWRConfig value={{ revalidateOnFocus: false, revalidateOnReconnect: true, dedupingInterval: 2000 }}>
          <AuthProvider>
            <CartProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <ServiceWorkerRegister />
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
