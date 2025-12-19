import type { Metadata } from "next";
import { headers } from "next/headers";
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

async function resolveMetadataBase() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  // Fallback for deployments where NEXT_PUBLIC_SITE_URL isn't set.
  // WhatsApp/Facebook scrapers need absolute URLs for og:image.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";

  if (host) return new URL(`${proto}://${host}`);
  return new URL("http://localhost:3000");
}

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = await resolveMetadataBase();

  return {
    title: "Akhter's Family — FamilyVerse",
    description: "A modern luxury family legacy and memorial experience.",

    // Used to resolve relative OpenGraph/Twitter image URLs.
    metadataBase,

    // App icons
    icons: {
      icon: "/family-verse.png",
      apple: "/family-verse.png",
      shortcut: "/family-verse.png",
    },

    openGraph: {
      type: "website",
      url: metadataBase,
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
}

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
