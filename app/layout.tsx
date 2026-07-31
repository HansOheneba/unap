import type { Metadata } from "next";
import { Space_Grotesk, Sora, Geist } from "next/font/google";
import "./globals.css";
import ConditionalNav from "@/components/layout/conditional-nav";
import { CollectionsNavProvider } from "@/components/layout/collections-nav-provider";
import SiteChrome from "@/components/layout/site-chrome";
import ToastHost from "@/components/ui/toast-host";
import { getAnnouncementBanner } from "@/lib/api/announcements";
import { listCollections } from "@/lib/api/catalog";
import { toCollectionNavItems } from "@/lib/collections-nav";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Unapologetic",
  description: "A Global Movement. Est. 2024.",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/favicon/apple-touch-icon.png" },
    other: [{ rel: "manifest", url: "/favicon/site.webmanifest" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [banner, collections] = await Promise.all([
    getAnnouncementBanner().catch(() => ({
      isEnabled: false,
      rotationIntervalMs: 4000,
      backgroundColor: "#18181b",
      textColor: "#ffffff",
      messages: [],
    })),
    listCollections().catch(() => []),
  ]);
  const collectionNav = toCollectionNavItems(collections);
  const bannerEnabled = banner.isEnabled && banner.messages.length > 0;

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        spaceGrotesk.variable,
        sora.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <CollectionsNavProvider items={collectionNav}>
          <SiteChrome banner={banner} collectionNav={collectionNav} />
          <ConditionalNav bannerEnabled={bannerEnabled}>
            {children}
          </ConditionalNav>
          <ToastHost />
        </CollectionsNavProvider>
      </body>
    </html>
  );
}
