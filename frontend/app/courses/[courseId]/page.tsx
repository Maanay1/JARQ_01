import Link from "next/link";
import { ArrowLeft, CheckCircle2, Play } from "lucide-react";
import { getCourseLessons } from "@/lib/api";
import { getLearningTrack } from "@/lib/learning-paths";
import { LearningPath } from "@/components/courses/LearningPath";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";
import { FreeLessonCounter } from "@/components/subscription/FreeLessonCounter";

type CourseLessonsPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseLessonsPage({ params }: CourseLessonsPageProps) {
  const { courseId } = await params;
  const track = getLearningTrack(courseId);
  const lessons = track ? [] : await getCourseLessons(courseId);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-20 jarq-text sm:px-6 sm:py-6 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        {track ? (
          <LearningPath track={track} />
        ) : (
          <section className="mx-auto max-w-5xl min-w-0">
            <Link href="/courses" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold jarq-muted hover:text-cyan-200">
              <ArrowLeft size={16} />
              Курсы
            </Link>

            <header className="mt-5 min-w-0 border-b pb-5 jarq-border">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">{courseId}</div>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Карта уроков</h1>
            </header>

            <div className="mt-6">
              <FreeLessonCounter />
            </div>

            <div className="mt-6 grid min-w-0 gap-3">
              {lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  href={`/lesson/${lesson.id}`}
                  className="button-lift group grid min-w-0 gap-4 rounded-xl p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/60 md:grid-cols-[56px_minmax(0,1fr)_auto] md:rounded-2xl jarq-glass"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-md bg-cyan-300/20 font-semibold text-cyan-100">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] jarq-muted">
                      {lesson.tasks.length || 1} заданий
                      <CheckCircle2 size={14} className="text-cyan-200" />
                    </div>
                    <h2 className="mt-1 text-lg font-semibold">{lesson.title}</h2>
                    <p className="mt-1 text-sm leading-6 jarq-muted">
                      {lesson.content ?? "Практикуйся, получай обратную связь и зарабатывай XP."}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950 md:w-auto md:min-h-10">
                      <Play size={16} />
                      {index >= 2 ? "Pro" : "Старт"}
                    </span>
                  </div>
                </Link>
              ))}
              {!lessons.length ? (
                <div className="rounded-2xl p-6 text-sm jarq-muted jarq-glass">
                  Пока нет уроков в этом курсе. Демо-уроки появятся здесь после наполнения Supabase.
                </div>
              ) : null}
            </div>
          </section>
        )}
      </MotionPage>
    </main>
  );
}
