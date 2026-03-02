import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Slashy — AI-Native Email Client",
  description:
    "An intelligent email client that learns your writing style, drafts replies in your voice, and organizes your inbox with AI.",
  keywords: [
    "email client",
    "AI email",
    "smart inbox",
    "email assistant",
    "AI drafts",
  ],
  openGraph: {
    title: "Slashy — AI-Native Email Client",
    description:
      "An intelligent email client that learns your writing style, drafts replies in your voice, and organizes your inbox with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
