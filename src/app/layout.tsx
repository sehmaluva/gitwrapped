import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: "GitHub Wrapped 2025 - Your Year in Code",
  description:
    "Discover your coding journey this year. See your commits, pull requests, favorite languages, and more in a beautiful, shareable format.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "GitHub Wrapped 2025",
    description: "Your Year in Code - See your GitHub stats in a beautiful format",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Wrapped 2025",
    description: "Your Year in Code - See your GitHub stats in a beautiful format",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
