import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { CheckoutButton } from "@/components/subscription/CheckoutButton";
import { ExperienceControls } from "@/components/ui/ExperienceControls";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { MotionPage } from "@/components/ui/MotionPage";

export default function SubscriptionCancelPage() {
  const losses = ["Уроки после второго снова закрыты", "5 уроков в день максимум", "Голосовой режим останется демо", "Без сертификата и офлайн режима"];

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-20 jarq-text">
      <FuturisticBackground />
      <ExperienceControls />
      <MotionPage variant="courses" className="relative z-10">
        <section className="mx-auto max-w-xl rounded-[36px] p-6 liquid-glass">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold jarq-muted hover:text-cyan-100">
            <ArrowLeft size={16} />
            Вернуться
          </Link>
          <div className="mt-6 grid h-16 w-16 place-items-center rounded-[26px] bg-purple-400/15 text-purple-100">
            <Lock size={30} />
          </div>
          <h1 className="mt-5 text-4xl font-black">Передумал? Ничего страшного</h1>
          <p className="mt-3 text-sm leading-6 jarq-muted">Можно продолжать бесплатно, но Pro откроет полный темп обучения.</p>
          <div className="mt-6 space-y-3">
            {losses.map((item) => (
              <div key={item} className="rounded-[22px] border border-white/[0.08] bg-slate-950/45 p-4 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CheckoutButton
              plan="pro_monthly"
              label="Всё же попробовать Pro"
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID}
              paymentLink={process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PAYMENT_LINK}
            />
          </div>
        </section>
      </MotionPage>
    </main>
  );
}
