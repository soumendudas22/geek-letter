import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

/**
 * Inter — clean, modern sans-serif for body text.
 * Conveys professionalism and readability.
 */
const inter = Inter({
  variable: "--font-sans-var",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Playfair Display — elegant serif for headings.
 * Conveys authority, editorial quality, and premium feel.
 */
const playfair = Playfair_Display({
  variable: "--font-serif-var",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Geek Letter — Ideas Worth Sharing",
    template: "%s | Geek Letter",
  },
  description:
    "Join thousands of curious minds. Get in-depth articles on technology, design, and building meaningful products — delivered to your inbox.",
  keywords: ["newsletter", "blog", "technology", "design", "insights"],
  openGraph: {
    type: "website",
    title: "Geek Letter — Ideas Worth Sharing",
    description:
      "Join thousands of curious minds. Get in-depth articles on technology, design, and building meaningful products.",
    siteName: "Geek Letter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geek Letter — Ideas Worth Sharing",
    description:
      "Join thousands of curious minds. Get in-depth articles on technology, design, and building meaningful products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors closeButton position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
