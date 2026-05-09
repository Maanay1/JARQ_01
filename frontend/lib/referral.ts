"use client";

import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { setSubscriptionPlan } from "@/lib/subscription";

export type ReferralFriend = {
  id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  status: "registered" | "first_lesson" | "active";
};

export type ReferralReward = {
  target: number;
  title: string;
  description: string;
};

export const referralRewards: ReferralReward[] = [
  { target: 1, title: "7 дней Pro", description: "Пригласи первого друга" },
  { target: 3, title: "1 месяц Pro", description: "Три друга в JARQ" },
  { target: 5, title: "3 месяца Pro", description: "Пять друзей учатся вместе" },
  { target: 10, title: "1 год Pro + Амбассадор", description: "Золотой статус JARQ" },
];

const REFERRAL_CODE_KEY = "jarq-referral-code";
const PENDING_REFERRAL_KEY = "jarq-pending-referral-code";
const LOCAL_FRIENDS_KEY = "jarq-referral-friends";
const PRO_BONUS_UNTIL_KEY = "jarq-pro-bonus-until";
const AMBASSADOR_KEY = "jarq-ambassador";
const NOTIFICATION_KEY = "jarq-referral-notification";

export function getReferralBaseUrl() {
  if (typeof window === "undefined") return "https://jarq-01-4z1x.vercel.app";
  return window.location.origin;
}

export function buildReferralLink(code: string) {
  return `${getReferralBaseUrl()}/join?ref=${encodeURIComponent(code)}`;
}

export function savePendingReferralCode(code: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_REFERRAL_KEY, code.trim().toUpperCase());
}

export function getPendingReferralCode() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PENDING_REFERRAL_KEY);
}

export function clearPendingReferralCode() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_REFERRAL_KEY);
}

export function generateReferralCode(name?: string | null) {
  const letters = (name ?? "MAANAY").replace(/[^a-zA-Zа-яА-Я]/g, "").slice(0, 4).toUpperCase().padEnd(4, "JQ");
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${letters}${digits}`;
}

export async function getOrCreateReferralCode(user: User | null, name?: string | null) {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(REFERRAL_CODE_KEY);
    if (saved) return saved;
  }

  if (supabase && user) {
    const { data: existing } = await supabase
      .from("referral_codes")
      .select("code")
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing?.code) {
      window.localStorage.setItem(REFERRAL_CODE_KEY, existing.code);
      return existing.code as string;
    }
  }

  const code = generateReferralCode(name);
  if (typeof window !== "undefined") window.localStorage.setItem(REFERRAL_CODE_KEY, code);

  if (supabase && user) {
    await supabase.from("referral_codes").insert({ user_id: user.id, code });
  }

  return code;
}

export async function processPendingReferral(user: User, displayName?: string | null) {
  const pendingCode = getPendingReferralCode();
  if (!pendingCode) return;
  const ownCode = await getOrCreateReferralCode(user, displayName);
  if (pendingCode === ownCode) {
    clearPendingReferralCode();
    return;
  }

  giveProBonus(3);

  if (supabase) {
    const { data: referrerCode } = await supabase
      .from("referral_codes")
      .select("user_id,total_referrals")
      .eq("code", pendingCode)
      .maybeSingle();

    const referrerId = typeof referrerCode?.user_id === "string" ? referrerCode.user_id : null;
    if (referrerId && referrerId !== user.id) {
      const { error } = await supabase.from("referrals").insert({
        referrer_id: referrerId,
        referred_id: user.id,
        referral_code: pendingCode,
      });
      if (!error) {
        const total = Number(referrerCode?.total_referrals ?? 0) + 1;
        await supabase.from("referral_codes").update({ total_referrals: total }).eq("code", pendingCode);
      }
    }
  }

  addLocalReferralFriend({
    id: user.id,
    name: displayName ?? user.email?.split("@")[0] ?? "Новый друг",
    avatar_url: typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null,
    created_at: new Date().toISOString(),
    status: "registered",
  });
  window.localStorage.setItem(NOTIFICATION_KEY, `🎉 Твой друг ${displayName ?? "присоединился"} в JARQ! +7 дней Pro добавлено`);
  clearPendingReferralCode();
}

export async function loadReferralFriends(user: User | null, code: string): Promise<ReferralFriend[]> {
  if (supabase && user) {
    const { data, error } = await supabase
      .from("referrals")
      .select("id,referred_id,created_at,reward_given")
      .eq("referrer_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((item, index) => ({
        id: String(item.id),
        name: `Друг ${index + 1}`,
        avatar_url: null,
        created_at: String(item.created_at),
        status: item.reward_given ? "active" : "registered",
      }));
    }
  }

  return loadLocalReferralFriends(code);
}

export async function loadReferralTotal(user: User | null, code?: string | null): Promise<number> {
  if (supabase && user) {
    const { data } = await supabase
      .from("referral_codes")
      .select("total_referrals")
      .eq("user_id", user.id)
      .maybeSingle();
    if (typeof data?.total_referrals === "number") return data.total_referrals;
  }
  return loadLocalReferralFriends(code ?? "").length;
}

export function giveProBonus(days: number) {
  if (typeof window === "undefined") return;
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  window.localStorage.setItem(PRO_BONUS_UNTIL_KEY, new Date(until).toISOString());
  setSubscriptionPlan("pro_monthly");
}

export function isAmbassador(totalReferrals: number) {
  if (totalReferrals >= 10) {
    if (typeof window !== "undefined") window.localStorage.setItem(AMBASSADOR_KEY, "true");
    return true;
  }
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AMBASSADOR_KEY) === "true";
}

export function popReferralNotification() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(NOTIFICATION_KEY);
  if (value) window.localStorage.removeItem(NOTIFICATION_KEY);
  return value;
}

function loadLocalReferralFriends(code: string): ReferralFriend[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(localFriendsKey(code));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ReferralFriend[];
  } catch {
    return [];
  }
}

function addLocalReferralFriend(friend: ReferralFriend) {
  const code = getPendingReferralCode() ?? "local";
  const friends = loadLocalReferralFriends(code);
  if (!friends.some((item) => item.id === friend.id)) {
    window.localStorage.setItem(localFriendsKey(code), JSON.stringify([friend, ...friends]));
  }
}

function localFriendsKey(code: string) {
  return `${LOCAL_FRIENDS_KEY}:${code || "local"}`;
}
