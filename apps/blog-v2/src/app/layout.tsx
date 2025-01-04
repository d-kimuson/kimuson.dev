import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kimuson.dev",
  description: "Personal tech blog showcasing articles, projects, and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        <div className="flex flex-col min-h-screen">
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header />
          </div>
          <main className="flex-grow container mx-auto px-4 py-8 mt-header min-h-content">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
