import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { JarqExperienceProvider } from "@/components/JarqExperience";
import { HapticProvider } from "@/components/ui/HapticProvider";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";
import { SiteHeader } from "@/components/home/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "JARQ AI-репетитор",
  description: "Адаптивный AI-репетитор с памятью, личностями и голосовым режимом.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <JarqExperienceProvider>
          <AuthProvider>
            <SiteHeader />
            {children}
            <HapticProvider />
            <MobileBottomNav />
          </AuthProvider>
        </JarqExperienceProvider>
      </body>
    </html>
  );
}
