"use client";

import { CtaSection } from "@/components/home/CtaSection";
import { DemoChatSection } from "@/components/home/DemoChatSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PersonaPreviewSection } from "@/components/home/PersonaPreviewSection";
import { IntroScreen } from "@/components/IntroScreen";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";
import { useJarqExperience } from "@/components/JarqExperience";

export function HomePage() {
  const { theme } = useJarqExperience();
  const isNight = theme === "night";

  return (
    <main className={`relative min-h-screen overflow-hidden ${isNight ? "text-white" : "text-slate-950"}`}>
      <FuturisticBackground />
      <IntroScreen />
      <ExperienceControls />
      <MotionPage variant="home" className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <PersonaPreviewSection />
        <DemoChatSection />
        <CtaSection />
      </MotionPage>
    </main>
  );
}
