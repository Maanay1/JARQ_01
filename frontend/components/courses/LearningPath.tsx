import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Flame, LockKeyhole, Play, Star, Trophy } from "lucide-react";
import { LearningTrack, userLevelFromXp } from "@/lib/learning-paths";

type LearningPathProps = {
  track: LearningTrack;
};

export function LearningPath({ track }: LearningPathProps) {
  const totalXp = track.levels.reduce((sum, level) => sum + Math.round((level.xp * level.progress) / 100), 0);
  const totalProgress = Math.round(track.levels.reduce((sum, level) => sum + level.progress, 0) / track.levels.length);

  return (
    <section className="mx-auto max-w-6xl min-w-0">
      <Link href="/courses" className="button-lift inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold jarq-soft jarq-muted hover:text-cyan-100">
        <ArrowLeft size={16} />
        Выбор направления
      </Link>

      <header className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200 jarq-soft">
            <Star size={15} />
            Игровой путь JARQ
          </div>
          <h1 className="jarq-title-gradient mt-4 text-4xl font-semibold leading-tight sm:text-6xl">{track.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 jarq-muted sm:text-lg">{track.description}</p>
        </div>

        <div className="rounded-2xl p-5 jarq-glass">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] jarq-muted">Твой ранг</div>
              <div className="mt-1 text-2xl font-semibold jarq-text">{userLevelFromXp(totalXp)}</div>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300/20 text-cyan-100">
              <Trophy size={25} />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="XP" value={String(totalXp)} />
            <Stat label="Стрик" value="3 дня" icon={<Flame size={16} />} />
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] jarq-muted">
              <span>Прогресс курса</span>
              <span>{totalProgress}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${track.accent}`}
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="relative mt-10 pb-8">
        <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/70 via-purple-300/40 to-transparent md:block" />
        <div className="grid gap-5">
          {track.levels.map((level, index) => {
            const Icon = level.icon;
            const isLeft = index % 2 === 0;
            return (
              <article
                key={level.id}
                className="page-enter-courses relative grid min-w-0 gap-4 md:grid-cols-[1fr_80px_1fr] md:items-center"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className={isLeft ? "md:order-1" : "md:order-3"}>{isLeft ? <LevelCard track={track} level={level} index={index} Icon={Icon} /> : null}</div>
                <div className="relative order-1 flex justify-start md:order-2 md:justify-center">
                  <div className={`grid h-16 w-16 place-items-center rounded-2xl border shadow-[0_0_45px_rgba(34,211,238,0.16)] backdrop-blur-xl ${level.locked ? "border-purple-300/25 bg-purple-400/10 text-purple-100" : "border-cyan-300/45 bg-cyan-300/20 text-cyan-100"}`}>
                    {level.locked ? <LockKeyhole size={23} /> : <Icon size={25} />}
                  </div>
                </div>
                <div className={isLeft ? "md:order-3" : "md:order-1"}>{!isLeft ? <LevelCard track={track} level={level} index={index} Icon={Icon} /> : null}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LevelCard({
  track,
  level,
  index,
  Icon,
}: {
  track: LearningTrack;
  level: LearningTrack["levels"][number];
  index: number;
  Icon: LearningTrack["levels"][number]["icon"];
}) {
  const href = lessonHref(track.id, index);
  const lessonLinks = levelLessonLinks(track.id, index);

  return (
    <div className="button-lift min-w-0 rounded-2xl p-5 transition hover:border-cyan-300/60 jarq-glass">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] jarq-muted">
            Уровень {index + 1}
            {level.locked ? <span className="text-purple-200">скоро</span> : null}
          </div>
          <h2 className="mt-2 text-xl font-semibold jarq-text">{level.title}</h2>
          <p className="mt-2 text-sm leading-6 jarq-muted">{level.description}</p>
        </div>
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${track.accent} text-slate-950`}>
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] jarq-muted">
          <span>{level.locked ? "Демо доступно" : "Прогресс"}</span>
          <span>+{level.xp} XP</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${track.accent}`}
            style={{ width: `${level.progress}%` }}
          />
        </div>
      </div>

      <Link
        href={href}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
      >
        <Play size={16} />
        Начать уровень
      </Link>

      <div className="mt-3 grid gap-2">
        {lessonLinks.map((lessonItem) => (
          <Link
            key={lessonItem.href}
            href={lessonItem.href}
            className="inline-flex min-h-10 items-center justify-between gap-2 rounded-xl border border-white/[0.08] px-3 text-xs font-bold jarq-soft hover:border-cyan-300"
          >
            <span>{lessonItem.title}</span>
            <Play size={13} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-xl p-3 jarq-soft">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] jarq-muted">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold jarq-text">{value}</div>
    </div>
  );
}

function lessonHref(trackId: LearningTrack["id"], index: number): string {
  return levelLessonLinks(trackId, index)[0]?.href ?? "/courses";
}

function levelLessonLinks(trackId: LearningTrack["id"], index: number): Array<{ title: string; href: string }> {
  const english = [
    [
      ["Алфавит A-M", "/lesson/english-beginner-alphabet-am"],
      ["Алфавит N-Z", "/lesson/english-beginner-alphabet-nz"],
      ["Гласные", "/lesson/english-beginner-vowels"],
    ],
    [
      ["TO BE", "/lesson/english-elementary-to-be"],
      ["Местоимения", "/lesson/english-elementary-pronouns"],
      ["Present Simple", "/lesson/english-elementary-present-simple"],
    ],
    [
      ["Past Simple", "/lesson/english-pre-past-regular"],
      ["Future Simple", "/lesson/english-pre-future-simple"],
      ["Question words", "/lesson/english-pre-question-words"],
    ],
    [["Idioms demo", "/lesson/english-pre-hobbies"]],
    [["Business demo", "/lesson/english-elementary-shopping"]],
    [["Speaking demo", "/lesson/english-pre-present-perfect"]],
    [["Final demo", "/lesson/english-beginner-final"]],
  ];
  const programming = [
    [
      ["Что такое код", "/lesson/programming-foundations-what-is-code"],
      ["Переменные", "/lesson/programming-foundations-variables"],
      ["Условия", "/lesson/programming-foundations-conditions"],
    ],
    [
      ["Hello World", "/lesson/python-beginner-hello-world"],
      ["Переменные", "/lesson/python-beginner-variables"],
      ["Типы данных", "/lesson/python-beginner-types"],
    ],
    [
      ["Input", "/lesson/python-beginner-input"],
      ["Math", "/lesson/python-beginner-math"],
      ["If/else", "/lesson/python-beginner-if"],
    ],
    [["Web demo", "/lesson/programming-foundations-functions"]],
    [["JavaScript logic", "/lesson/programming-foundations-conditions"]],
    [["Python loops", "/lesson/python-beginner-for"]],
    [["Mini project", "/lesson/python-beginner-project-guess-number"]],
  ];
  const list = trackId === "english" ? english : programming;
  return (list[index] ?? list[0]).map(([title, href]) => ({ title, href }));
}
