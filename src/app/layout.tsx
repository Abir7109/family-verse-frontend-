import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import ThemeProvider from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akhter's Family — FamilyVerse",
  description: "A modern luxury family legacy and memorial experience.",

  // Used to resolve relative OpenGraph/Twitter image URLs.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),

  // App icons
  icons: {
    icon: "/family-verse.png",
    apple: "/family-verse.png",
    shortcut: "/family-verse.png",
  },

  openGraph: {
    title: "Akhter's Family — FamilyVerse",
    description: "A modern luxury family legacy and memorial experience.",
    images: [
      {
        url: "/family-verse.png",
        width: 1024,
        height: 1024,
        alt: "FamilyVerse logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Akhter's Family — FamilyVerse",
    description: "A modern luxury family legacy and memorial experience.",
    images: ["/family-verse.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
