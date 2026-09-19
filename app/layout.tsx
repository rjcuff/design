import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileFooter } from "@/app/components/mobile-footer";
import { Sidebar } from "@/app/components/sidebar";
import { Providers } from "@/app/components/providers";
import { Topbar } from "@/app/components/topbar";
import { siteConfig } from "@/app/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.title,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.href }],
  creator: siteConfig.author.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.title,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@ryancuff_",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-canvas text-text min-h-full font-sans">
        <Providers>
          {/* Fixed bar, fixed sidebar under it, and the content offset past
              both. pt-14 matches the bar height, ml-64 the sidebar width. */}
          <Topbar />
          <Sidebar />
          <main className="px-6 pt-14 pb-12 md:ml-64 md:min-h-screen md:px-10 lg:px-16">
            <div className="py-10">{children}</div>
          </main>
          <MobileFooter />
        </Providers>
      </body>
    </html>
  );
}
