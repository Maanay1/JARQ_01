"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowRight, Loader2 } from "lucide-react";
import { hapticTap } from "@/components/ui/HapticProvider";
import { SubscriptionPlan, setSubscriptionPlan } from "@/lib/subscription";

type CheckoutButtonProps = {
  plan: SubscriptionPlan;
  label: string;
  priceId?: string;
  paymentLink?: string;
  className?: string;
};

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

type StripeWithRedirect = {
  redirectToCheckout?: (options: {
    mode: "subscription";
    lineItems: Array<{ price: string; quantity: number }>;
    successUrl: string;
    cancelUrl: string;
  }) => Promise<{ error?: { message?: string } }>;
};

export function CheckoutButton({ plan, label, priceId, paymentLink, className }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    hapticTap();
    if (plan === "free") {
      setSubscriptionPlan("free");
      window.location.href = "/courses";
      return;
    }

    if (paymentLink) {
      window.location.href = paymentLink;
      return;
    }

    if (!stripePromise || !priceId) {
      setSubscriptionPlan(plan);
      window.location.href = `/subscription/success?plan=${plan}&demo=true`;
      return;
    }

    setIsLoading(true);
    const stripe = await stripePromise;
    if (!stripe) {
      setIsLoading(false);
      return;
    }

    const origin = window.location.origin;
    const redirectToCheckout = (stripe as StripeWithRedirect).redirectToCheckout;
    if (!redirectToCheckout) {
      setSubscriptionPlan(plan);
      window.location.href = `/subscription/success?plan=${plan}&demo=true`;
      return;
    }

    const result = await redirectToCheckout({
      mode: "subscription",
      lineItems: [{ price: priceId, quantity: 1 }],
      successUrl: `${origin}/subscription/success?plan=${plan}`,
      cancelUrl: `${origin}/subscription/cancel`,
    });

    if (result.error) {
      setIsLoading(false);
      alert(result.error.message ?? "Stripe Checkout не открылся.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={
        className ??
        "elastic-tap inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-cyan-300 px-5 text-base font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.22)] disabled:opacity-60"
      }
    >
      {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
      {label}
    </button>
  );
}
