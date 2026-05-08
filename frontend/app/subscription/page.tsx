import Link from "next/link";
import { Check, Crown, Sparkles, Star } from "lucide-react";
import { CheckoutButton } from "@/components/subscription/CheckoutButton";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";

const plans = [
  {
    id: "free" as const,
    name: "Бесплатный",
    price: "0 сом",
    period: "/месяц",
    description: "Для старта и знакомства с Маанаем.",
    features: ["Первые 2 урока каждого курса", "5 уроков в день максимум", "Базовый чат с Маанаем", "Просмотр прогресса"],
    cta: "Начать",
  },
  {
    id: "pro_monthly" as const,
    name: "Pro",
    price: "990 сом",
    period: "/месяц",
    description: "Все возможности JARQ без ограничений.",
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PAYMENT_LINK,
    features: ["Все уроки без ограничений", "Безлимитные уроки в день", "Голосовой режим", "Скачать сертификат", "Офлайн режим", "Приоритетный AI ответ"],
    cta: "Получить Pro",
  },
  {
    id: "pro_yearly" as const,
    name: "Pro Годовой",
    price: "7900 сом",
    period: "/год",
    description: "Экономия 30% и красивый значок в профиле.",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PAYMENT_LINK,
    features: ["Всё из Pro", "Экономия 30%", "Золотой значок в профиле", "Лучший вариант для expo demo"],
    cta: "Взять годовой",
  },
];

export default function SubscriptionPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-20 jarq-text sm:px-6 sm:py-28 lg:px-8">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        <section className="mx-auto max-w-6xl">
          <Link href="/courses" className="button-lift inline-flex min-h-10 items-center rounded-full px-4 text-sm font-bold jarq-soft jarq-muted hover:text-cyan-100">
            ← Назад к урокам
          </Link>

          <header className="mx-auto mt-8 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200 jarq-soft">
              <Sparkles size={16} />
              JARQ Pro
            </div>
            <h1 className="jarq-title-gradient mt-5 text-4xl font-black leading-tight sm:text-6xl">
              Учись без лимитов с Маанаем
            </h1>
            <p className="mt-5 text-base leading-7 jarq-muted sm:text-lg">
              Бесплатный план даёт хороший старт. Pro открывает все уроки, голос, офлайн и приоритетный AI ответ.
            </p>
          </header>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`relative overflow-hidden rounded-[32px] border p-6 backdrop-blur-xl ${
                  plan.popular
                    ? "border-cyan-300 bg-cyan-300/10 shadow-[0_0_50px_rgba(34,211,238,0.22)]"
                    : "border-white/[0.08] bg-slate-950/60"
                }`}
              >
                {plan.popular ? (
                  <div className="absolute right-5 top-5 rounded-full bg-cyan-300 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-950">
                    Популярный
                  </div>
                ) : null}
                <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-gradient-to-br from-cyan-300 to-purple-400 text-slate-950">
                  {plan.id === "free" ? <Star size={24} /> : <Crown size={24} />}
                </div>
                <h2 className="mt-5 text-2xl font-black">{plan.name}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 jarq-muted">{plan.description}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="pb-1 text-sm font-bold jarq-muted">{plan.period}</span>
                </div>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm font-semibold">
                      <Check className="mt-0.5 shrink-0 text-cyan-200" size={17} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-7">
                  <CheckoutButton plan={plan.id} label={plan.cta} priceId={plan.priceId} paymentLink={plan.paymentLink} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </MotionPage>
    </main>
  );
}
