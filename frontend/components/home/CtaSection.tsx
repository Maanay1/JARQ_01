import Link from "next/link";
import { MessageCircle, Sparkles, Zap } from "lucide-react";

export function CtaSection() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/reels"
        className="button-lift mx-auto mb-5 flex max-w-6xl min-w-0 flex-col gap-4 overflow-hidden rounded-[32px] border border-cyan-300/25 bg-slate-950/60 p-5 text-white shadow-[0_0_44px_rgba(34,211,238,0.16)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[24px] bg-cyan-300 text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.35)]">
            <Zap size={26} />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Новый режим</span>
            <span className="mt-1 block text-2xl font-black leading-tight">JARQ Reels — учись за 60 секунд</span>
          </span>
        </div>
        <span className="inline-flex min-h-12 items-center justify-center rounded-[22px] bg-white/10 px-5 text-sm font-black text-cyan-100">
          Открыть Reels
        </span>
      </Link>

      <div className="mx-auto flex max-w-6xl min-w-0 flex-col items-stretch gap-5 rounded-xl p-4 sm:rounded-2xl sm:p-6 md:flex-row md:items-center md:justify-between jarq-glass">
        <div className="min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Готово</div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight">Начни первый урок</h2>
          <p className="mt-2 text-sm leading-6 jarq-muted">
            Выбери курс, ответь на короткое задание, и JARQ подстроится под тебя.
          </p>
        </div>
        <div className="grid gap-3 sm:flex sm:flex-row">
          <Link
            href="/chat"
            className="button-lift inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold ring-1 transition hover:bg-white/15 jarq-soft jarq-text"
          >
            Открыть AI-чат
            <MessageCircle size={17} />
          </Link>
          <Link
            href="/courses"
            className="button-lift inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.35)] transition hover:bg-cyan-200"
          >
            Начать первый урок
            <Sparkles size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
