import { supabase } from "@/lib/supabase";

export type AdminProfile = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string | null;
  status: string | null;
  streak: number | null;
  total_xp: number | null;
  lessons_completed: number | null;
  source: string | null;
  last_seen: string | null;
  created_at: string | null;
};

export type AdminActivity = {
  id: string;
  user_id: string | null;
  action: string | null;
  lesson_id: string | null;
  score: number | null;
  time_spent: number | null;
  created_at: string | null;
};

export type AdminSubscription = {
  id: string;
  user_id: string | null;
  plan: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string | null;
};

export type AdminDataset = {
  profiles: AdminProfile[];
  activities: AdminActivity[];
  subscriptions: AdminSubscription[];
};

export async function loadAdminDataset(): Promise<AdminDataset> {
  if (!supabase) {
    throw new Error("Supabase не настроен.");
  }

  const [profilesResult, activitiesResult, subscriptionsResult] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("user_activity").select("*").order("created_at", { ascending: false }).limit(5000),
    supabase.from("subscriptions").select("*").order("created_at", { ascending: false }),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (activitiesResult.error) throw activitiesResult.error;
  if (subscriptionsResult.error) throw subscriptionsResult.error;

  return {
    profiles: (profilesResult.data ?? []).map(normalizeProfile),
    activities: (activitiesResult.data ?? []).map(normalizeActivity),
    subscriptions: (subscriptionsResult.data ?? []).map(normalizeSubscription),
  };
}

export function displayProfileName(profile: AdminProfile): string {
  return profile.name ?? profile.username ?? profile.email ?? `user-${profile.id.slice(0, 6)}`;
}

export function isActiveSubscription(subscription: AdminSubscription): boolean {
  if (!subscription.plan || subscription.plan === "free") return false;
  if (!subscription.current_period_end) return true;
  return new Date(subscription.current_period_end).getTime() > Date.now();
}

export function isProfileActive(profile: AdminProfile): boolean {
  if (profile.status === "blocked") return false;
  if (!profile.last_seen) return false;
  return new Date(profile.last_seen).getTime() >= Date.now() - 24 * 60 * 60 * 1000;
}

export function isProfileInactive(profile: AdminProfile): boolean {
  if (profile.status === "blocked") return false;
  if (!profile.last_seen) return true;
  return new Date(profile.last_seen).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000;
}

export function formatDate(value?: string | null): string {
  if (!value) return "нет данных";
  return new Intl.DateTimeFormat("ru", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "нет данных";
  return new Intl.DateTimeFormat("ru", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function normalizeProfile(raw: Record<string, unknown>): AdminProfile {
  return {
    id: String(raw.id ?? ""),
    name: stringOrNull(raw.name),
    username: stringOrNull(raw.username),
    email: stringOrNull(raw.email),
    avatar_url: stringOrNull(raw.avatar_url),
    role: stringOrNull(raw.role) ?? "user",
    status: stringOrNull(raw.status) ?? "active",
    streak: numberOrNull(raw.streak),
    total_xp: numberOrNull(raw.total_xp),
    lessons_completed: numberOrNull(raw.lessons_completed),
    source: stringOrNull(raw.source) ?? "direct",
    last_seen: stringOrNull(raw.last_seen),
    created_at: stringOrNull(raw.created_at),
  };
}

function normalizeActivity(raw: Record<string, unknown>): AdminActivity {
  return {
    id: String(raw.id ?? ""),
    user_id: stringOrNull(raw.user_id),
    action: stringOrNull(raw.action),
    lesson_id: stringOrNull(raw.lesson_id),
    score: numberOrNull(raw.score),
    time_spent: numberOrNull(raw.time_spent),
    created_at: stringOrNull(raw.created_at),
  };
}

function normalizeSubscription(raw: Record<string, unknown>): AdminSubscription {
  return {
    id: String(raw.id ?? ""),
    user_id: stringOrNull(raw.user_id),
    plan: stringOrNull(raw.plan) ?? "free",
    stripe_customer_id: stringOrNull(raw.stripe_customer_id),
    stripe_subscription_id: stringOrNull(raw.stripe_subscription_id),
    current_period_end: stringOrNull(raw.current_period_end),
    created_at: stringOrNull(raw.created_at),
  };
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
