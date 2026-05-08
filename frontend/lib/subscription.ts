"use client";

export type SubscriptionPlan = "free" | "pro_monthly" | "pro_yearly";

export const FREE_DAILY_LESSON_LIMIT = 5;
export const FREE_UNLOCKED_LESSONS_PER_COURSE = 2;

const PLAN_KEY = "jarq-subscription-plan";
const DAILY_USAGE_KEY = "jarq-daily-lesson-usage";

export type DailyLessonUsage = {
  date: string;
  count: number;
};

export function getSubscriptionPlan(): SubscriptionPlan {
  if (typeof window === "undefined") return "free";
  const value = window.localStorage.getItem(PLAN_KEY);
  return value === "pro_monthly" || value === "pro_yearly" ? value : "free";
}

export function setSubscriptionPlan(plan: SubscriptionPlan) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAN_KEY, plan);
  window.dispatchEvent(new CustomEvent("jarq-subscription-change", { detail: plan }));
}

export function isProPlan(plan: SubscriptionPlan): boolean {
  return plan === "pro_monthly" || plan === "pro_yearly";
}

export function getTodayLessonUsage(): DailyLessonUsage {
  if (typeof window === "undefined") return { date: todayKey(), count: 0 };
  const currentDate = todayKey();
  const raw = window.localStorage.getItem(DAILY_USAGE_KEY);
  if (!raw) return { date: currentDate, count: 0 };
  try {
    const parsed = JSON.parse(raw) as DailyLessonUsage;
    return parsed.date === currentDate ? parsed : { date: currentDate, count: 0 };
  } catch {
    return { date: currentDate, count: 0 };
  }
}

export function incrementTodayLessonUsage() {
  if (typeof window === "undefined") return;
  const usage = getTodayLessonUsage();
  window.localStorage.setItem(DAILY_USAGE_KEY, JSON.stringify({ ...usage, count: usage.count + 1 }));
  window.dispatchEvent(new Event("jarq-lesson-usage-change"));
}

export function remainingFreeLessonsToday(): number {
  return Math.max(0, FREE_DAILY_LESSON_LIMIT - getTodayLessonUsage().count);
}

export function inferLessonNumber(lessonId: string, orderIndex?: number | null): number {
  if (typeof orderIndex === "number" && orderIndex > 0) return orderIndex;

  const knownOrder = [
    "english-beginner-alphabet-am",
    "english-beginner-alphabet-nz",
    "english-beginner-vowels",
    "english-beginner-numbers-1-10",
    "english-beginner-numbers-11-100",
    "english-beginner-colors",
    "english-beginner-greetings",
    "english-beginner-introductions",
    "english-beginner-body",
    "english-beginner-family",
    "english-beginner-days-months",
    "english-beginner-final",
    "programming-foundations-what-is-code",
    "programming-foundations-variables",
    "programming-foundations-conditions",
    "programming-foundations-loops",
    "programming-foundations-functions",
    "python-beginner-hello-world",
    "python-beginner-variables",
    "python-beginner-types",
  ];
  const index = knownOrder.indexOf(lessonId);
  return index >= 0 ? (index % 12) + 1 : 1;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
