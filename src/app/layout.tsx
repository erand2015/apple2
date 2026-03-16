import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TITAN X PRO | The Quantum Monolith",
  description: "Eksploroni fuqinë e vërtetë të inteligjencës artificiale me Titan 16 Pro.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1", // Parandalon zmadhimin e padëshiruar në mobile
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq" className="dark">
      <body className="bg-[#020202] text-white antialiased selection:bg-[#00FFFF] selection:text-black overflow-x-hidden">
        {/* Ky div parandalon "shkrepjen" e layout-it para se të ngarkohet Lenis */}
        <div className="relative flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}