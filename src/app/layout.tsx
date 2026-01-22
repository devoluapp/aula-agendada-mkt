import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aulas Live - Plataforma de Mini Cursos",
  description: "Aprenda com aulas agendadas e conteúdo exclusivo protegidos por login.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50`}>
        {children}
      </body>
    </html>
  );
}
