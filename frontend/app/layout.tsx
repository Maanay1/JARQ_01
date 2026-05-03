import type { Metadata } from "next";
import { JarqExperienceProvider } from "@/components/JarqExperience";
import "./globals.css";

export const metadata: Metadata = {
  title: "JARQ AI-репетитор",
  description: "Адаптивный AI-репетитор с памятью, личностями и голосовым режимом.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <JarqExperienceProvider>{children}</JarqExperienceProvider>
      </body>
    </html>
  );
}
