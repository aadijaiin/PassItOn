import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClientNavBarWrapper } from "@/components/ClientNavBarWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pass It On",
  description: "By PassionWriters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This hook only works in client components, so wrap NavBar in a client component
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        style={{ fontFamily: 'Sora, sans-serif' }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientNavBarWrapper />
        {children}
      </body>
    </html>
  );
}

// Client component to conditionally render NavBar
