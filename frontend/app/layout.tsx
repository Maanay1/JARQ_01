import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { JarqExperienceProvider } from "@/components/JarqExperience";
import { HapticProvider } from "@/components/ui/HapticProvider";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";
import { SiteHeader } from "@/components/home/SiteHeader";
import InstallBanner from "@/components/InstallBanner";
import PWARegister from "@/components/PWARegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "JARQ AI-репетитор",
  description: "Адаптивный AI-репетитор с памятью, личностями и голосовым режимом.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "JARQ",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#00e5ff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00e5ff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="JARQ" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <JarqExperienceProvider>
          <AuthProvider>
            <SiteHeader />
            {children}
            <HapticProvider />
            <PWARegister />
            <InstallBanner />
            <MobileBottomNav />
          </AuthProvider>
        </JarqExperienceProvider>
      </body>
    </html>
  );
}
