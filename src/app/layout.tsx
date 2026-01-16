import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import AnalyticsProvider from "@/components/analytics-provider";

export const metadata: Metadata = {
  title: "adidab - All Day I Dream About Bitcoin",
  description:
    "A premium daily Bitcoin ritual for newcomers and daily checkers. Live price, essential tools, and clear learning paths.",
  metadataBase: new URL("https://adidab.com"),
  openGraph: {
    title: "adidab - All Day I Dream About Bitcoin",
    description:
      "A premium daily Bitcoin ritual for newcomers and daily checkers. Live price, essential tools, and clear learning paths.",
    type: "website",
    url: "https://adidab.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "adidab - All Day I Dream About Bitcoin",
    description:
      "A premium daily Bitcoin ritual for newcomers and daily checkers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AnalyticsProvider>
          <div className="min-h-screen">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
