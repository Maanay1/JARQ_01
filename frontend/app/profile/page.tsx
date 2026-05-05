import { Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";
import { MaaniyCharacter } from "@/components/MaaniyCharacter";

export default function ProfilePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-6 jarq-text sm:px-6 md:py-8 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        <section className="mx-auto max-w-3xl">
          <div className="rounded-3xl p-5 text-center jarq-glass">
            <MaaniyCharacter size="sm" showBubble message="Профиль ученика готов к прокачке." className="mx-auto" />
            <div className="mx-auto mt-4 grid h-20 w-20 place-items-center rounded-full bg-cyan-300 text-slate-950">
              <UserRound size={36} />
            </div>
            <h1 className="mt-4 text-3xl font-semibold">Ученик JARQ</h1>
            <p className="mt-2 jarq-muted">Новичок · 240 XP · 3 дня стрика</p>
          </div>

          <div className="mt-5 grid gap-3">
            {["Английский: Beginner", "Программирование: Основы", "Любимый наставник: Маанай"].map((item) => (
              <div key={item} className="rounded-2xl p-4 font-semibold jarq-glass">
                {item}
              </div>
            ))}
          </div>

          <Link href="/courses" className="button-lift mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 text-base font-bold text-slate-950">
            <Settings size={18} />
            Продолжить обучение
          </Link>
        </section>
      </MotionPage>
    </main>
  );
}
