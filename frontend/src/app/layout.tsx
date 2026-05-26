import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SecurityChatbot from "@/components/SecurityChatbot";
import BrowserExtensionBanner from "@/components/BrowserExtensionBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "PhishGuard AI - Detect Before It Strikes",
  description: "A premium futuristic AI-powered cybersecurity web application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased text-white selection:bg-cyan-500/30 overflow-x-hidden cursor-none`}
      >
        <CustomCursor />
        <BrowserExtensionBanner />
        {children}
        <SecurityChatbot />
      </body>
    </html>
  );
}
