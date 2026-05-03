"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Flame, GraduationCap, Loader2, Sparkles, Target, Trophy } from "lucide-react";
import { UserProgress as UserProgressData, getUserProgress } from "@/lib/api";

type UserProgressProps = {
  userId?: string;
};

export function UserProgress({ userId = "00000000-0000-0000-0000-000000000000" }: UserProgressProps) {
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProgress() {
      try {
        const data = await getUserProgress(userId);
        if (isMounted) setProgress(data);
      } catch (caughtError) {
        if (isMounted) {
          setError(caughtError instanceof Error ? caughtError.message : "Не удалось загрузить прогресс.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadProgress();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const xpToNextLevel = useMemo(() => {
    if (!progress) return 0;
    return 100 - (progress.xp % 100);
  }, [progress]);

  const xpPercent = progress ? progress.xp % 100 : 0;

  return (
    <section className="border-t pt-4 jarq-border">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-coral">
            <Sparkles size={15} />
            Прогресс
          </div>
          <h2 className="mt-1 text-xl font-semibold">Твоя статистика</h2>
        </div>
        {isLoading ? <Loader2 className="animate-spin jarq-muted" size={20} /> : null}
      </div>

      {error ? <div className="mt-4 rounded-md bg-coral/15 p-3 text-sm">{error}</div> : null}

      {progress ? (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat icon={<GraduationCap size={18} />} label="Уровень" value={String(progress.level)} />
            <Stat icon={<Trophy size={18} />} label="XP" value={String(progress.xp)} />
            <Stat icon={<Flame size={18} />} label="Серия" value={`${progress.streak} дн.`} />
            <Stat icon={<Target size={18} />} label="Уроки" value={String(progress.completed_lessons)} />
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.12em] jarq-muted">
              <span>Следующий уровень</span>
              <span>осталось {xpToNextLevel} XP</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full jarq-soft">
              <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>

          <div className="mt-5 rounded-md bg-sky/15 p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] jarq-muted">JARQ рекомендует</div>
            <p className="mt-2 text-sm leading-6">{progress.jarq_recommendation}</p>
          </div>

          <div className="mt-5">
            <div className="text-sm font-semibold">Слабые темы</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {progress.weak_topics.length ? (
                progress.weak_topics.map((topic) => (
                  <span key={topic} className="rounded-full bg-coral/15 px-3 py-1 text-xs font-semibold">
                    {topic}
                  </span>
                ))
              ) : (
                <span className="text-sm jarq-muted">Слабых тем пока нет</span>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <AlertCircle size={16} />
              Последние ошибки
            </div>
            <div className="mt-2 space-y-2">
              {progress.latest_mistakes.length ? (
                progress.latest_mistakes.slice(0, 3).map((mistake) => (
                  <div key={mistake.id} className="rounded-md border p-3 jarq-border jarq-soft">
                    <div className="text-xs font-semibold jarq-muted">{mistake.subject ?? "Практика"}</div>
                    <div className="mt-1 text-sm">{mistake.mistake}</div>
                    {mistake.correction ? (
                      <div className="mt-1 text-sm font-semibold jarq-text">→ {mistake.correction}</div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-md p-3 text-sm jarq-muted jarq-soft">Ошибок пока нет.</div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md p-3 jarq-soft">
      <div className="flex items-center gap-2 jarq-muted">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}
