import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: "Personal tech blog showcasing articles, projects, and more",
  openGraph: {
    title: siteConfig.title,
    description: "Personal tech blog showcasing articles, projects, and more",
    url: siteConfig.baseUrl,
    siteName: siteConfig.title,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: "Personal tech blog showcasing articles, projects, and more",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
