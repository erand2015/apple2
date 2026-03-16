import type { Metadata, Viewport } from "next"; // Shto Viewport këtu
import "./globals.css";

// 1. Metadata për SEO dhe titullin
export const metadata: Metadata = {
  title: "TITAN X PRO | The Quantum Monolith",
  description: "Eksploroni fuqinë e vërtetë të inteligjencës artificiale me Titan 16 Pro.",
};

// 2. Viewport i ndarë (Kjo rregullon warning-un)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020202",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq" className="dark">
      <body className="bg-[#020202] text-white antialiased selection:bg-[#00FFFF] selection:text-black overflow-x-hidden">
        <div className="relative flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}