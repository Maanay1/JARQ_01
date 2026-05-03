import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LessonRunner } from "@/components/lessons/LessonRunner";
import { getLesson } from "@/lib/api";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = await getLesson(lessonId);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 jarq-text sm:px-6 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="lesson" className="relative z-10">
      <section className="mx-auto max-w-5xl">
        <Link
          href={lesson.course_id ? `/courses/${lesson.course_id}` : "/courses"}
          className="inline-flex items-center gap-2 text-sm font-semibold jarq-muted hover:text-cyan-200"
        >
          <ArrowLeft size={16} />
          Уроки
        </Link>

        <header className="mt-5 border-b pb-5 jarq-border">
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Интерактивный урок</div>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{lesson.title}</h1>
        </header>

        <LessonRunner lesson={lesson} />
      </section>
      </MotionPage>
    </main>
  );
}
