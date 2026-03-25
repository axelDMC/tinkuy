import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tinkuy — Organiza tu pichanga sin el caos del WhatsApp",
  description: "Crea tu evento deportivo en segundos, comparte el link y gestiona confirmaciones y pagos Yape/Plin fácilmente. Fútbol, vóley, surf y más. Gratis.",
  keywords: ["pichanga", "organizar pichanga", "fútbol peru", "voley peru", "eventos deportivos", "yape pago", "confirmación jugadores", "tinkuy"],
  authors: [{ name: "Tinkuy" }],
  openGraph: {
    title: "Tinkuy — Organiza tu pichanga sin el caos del WhatsApp",
    description: "Crea el evento, comparte el link, los jugadores se apuntan y confirman su pago. Tú solo apareces a jugar.",
    url: "https://tinkuy.app",
    siteName: "Tinkuy",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tinkuy — Organiza tu pichanga sin el caos del WhatsApp",
    description: "Crea el evento, comparte el link, los jugadores se apuntan y confirman su pago.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://tinkuy.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${geist.className} bg-black text-white min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
