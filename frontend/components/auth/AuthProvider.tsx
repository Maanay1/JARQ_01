"use client";

import { Session, User } from "@supabase/supabase-js";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { processPendingReferral } from "@/lib/referral";
import { supabase } from "@/lib/supabase";

export type MentorAvatarId = "maanay" | "sensei" | "professor" | "robo_bot" | "tulpar" | "nomad" | "snow_leopard" | "astro";

export type JarqProfile = {
  id: string;
  username: string | null;
  selected_avatar_id: MentorAvatarId;
  role: string | null;
  learning_goal?: "english" | "programming" | "both" | null;
  learning_level?: string | null;
  daily_goal_minutes?: number | null;
};

type AuthContextValue = {
  isConfigured: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  profile: JarqProfile | null;
  selectedAvatarId: MentorAvatarId;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ error: string | null }>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<JarqProfile, "username" | "selected_avatar_id" | "learning_goal" | "learning_level" | "daily_goal_minutes">>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const DEFAULT_AVATAR: MentorAvatarId = "maanay";
const LOCAL_USER_ID = "local-user";
const ADMIN_ROLE_COOKIE = "jarq-admin-role";

function usernameStorageKey(userId: string) {
  return `jarq-profile-username:${userId}`;
}

function syncAdminRoleCookie(role?: string | null) {
  if (typeof document === "undefined") return;
  const normalizedRole = role === "admin" ? "admin" : "user";
  document.cookie = `${ADMIN_ROLE_COOKIE}=${normalizedRole}; path=/; max-age=2592000; SameSite=Lax`;
}

function clearAdminRoleCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<JarqProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = Boolean(supabase);

  const loadProfile = useCallback(async (user: User | null) => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }

    const savedAvatar = (window.localStorage.getItem("jarq-selected-avatar") as MentorAvatarId | null) ?? DEFAULT_AVATAR;
    const savedUsername = window.localStorage.getItem(usernameStorageKey(user.id));
    const fallbackUsername = savedUsername ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? "JARQ student";
    const baseProfile: JarqProfile = {
      id: user.id,
      username: fallbackUsername,
      selected_avatar_id: savedAvatar,
      role: "user",
    };

    const { data: existingProfile, error: selectError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!selectError && existingProfile) {
      const rawProfile = existingProfile as Record<string, unknown>;
      const normalizedProfile: JarqProfile = {
        id: String(rawProfile.id ?? user.id),
        username: normalizeString(rawProfile.username ?? rawProfile.name) ?? fallbackUsername,
        selected_avatar_id: normalizeAvatarId(rawProfile.selected_avatar_id ?? savedAvatar),
        role: normalizeString(rawProfile.role) ?? "user",
        learning_goal: normalizeLearningGoal(rawProfile.learning_goal),
        learning_level: normalizeString(rawProfile.learning_level),
        daily_goal_minutes: normalizeNumber(rawProfile.daily_goal_minutes),
      };
      setProfile(normalizedProfile);
      void touchProfile(user.id, user.email);
      void processPendingReferral(user, normalizedProfile.username);
      syncAdminRoleCookie(normalizedProfile.role);
      window.localStorage.setItem("jarq-selected-avatar", normalizedProfile.selected_avatar_id);
      if (normalizedProfile.username) window.localStorage.setItem(usernameStorageKey(user.id), normalizedProfile.username);
      return;
    }

    const { data: insertedProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        ...baseProfile,
        name: fallbackUsername,
        email: user.email ?? null,
        last_seen: new Date().toISOString(),
      })
      .select("id, username, selected_avatar_id")
      .single();

    if (insertError || !insertedProfile) {
      setProfile(baseProfile);
      void processPendingReferral(user, baseProfile.username);
      syncAdminRoleCookie(baseProfile.role);
      window.localStorage.setItem("jarq-selected-avatar", baseProfile.selected_avatar_id);
      if (baseProfile.username) window.localStorage.setItem(usernameStorageKey(user.id), baseProfile.username);
      return;
    }

    const normalizedProfile: JarqProfile = {
      id: insertedProfile.id,
      username: insertedProfile.username ?? fallbackUsername,
      selected_avatar_id: normalizeAvatarId(insertedProfile.selected_avatar_id),
      role: "user",
    };
    setProfile(normalizedProfile);
    void processPendingReferral(user, normalizedProfile.username);
    syncAdminRoleCookie(normalizedProfile.role);
    window.localStorage.setItem("jarq-selected-avatar", normalizedProfile.selected_avatar_id);
    if (normalizedProfile.username) window.localStorage.setItem(usernameStorageKey(user.id), normalizedProfile.username);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!supabase) {
        if (mounted) setIsLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      await loadProfile(data.session?.user ?? null);
      if (mounted) setIsLoading(false);
    }

    void init();
    if (!supabase) return () => {
      mounted = false;
    };

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadProfile(nextSession?.user ?? null);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signInWithOAuth = useCallback(async (provider: "google" | "github") => {
    if (!supabase) return { error: "Supabase не настроен." };
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) return;
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
    clearAdminRoleCookie();
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Pick<JarqProfile, "username" | "selected_avatar_id" | "learning_goal" | "learning_level" | "daily_goal_minutes">>) => {
      const user = session?.user;
      const normalizedUpdates = {
        ...updates,
        selected_avatar_id: updates.selected_avatar_id ? normalizeAvatarId(updates.selected_avatar_id) : undefined,
      };

      if (normalizedUpdates.selected_avatar_id) {
        window.localStorage.setItem("jarq-selected-avatar", normalizedUpdates.selected_avatar_id);
      }
      if (typeof normalizedUpdates.username === "string") {
        window.localStorage.setItem(usernameStorageKey(user?.id ?? LOCAL_USER_ID), normalizedUpdates.username);
      }

      const nextProfile: JarqProfile = {
        id: user?.id ?? LOCAL_USER_ID,
        username: normalizedUpdates.username ?? profile?.username ?? "JARQ student",
        selected_avatar_id: normalizedUpdates.selected_avatar_id ?? profile?.selected_avatar_id ?? DEFAULT_AVATAR,
        role: profile?.role ?? "user",
        learning_goal: normalizedUpdates.learning_goal ?? profile?.learning_goal ?? null,
        learning_level: normalizedUpdates.learning_level ?? profile?.learning_level ?? null,
        daily_goal_minutes: normalizedUpdates.daily_goal_minutes ?? profile?.daily_goal_minutes ?? null,
      };

      setProfile(nextProfile);

      if (!supabase || !user) return;
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...normalizedUpdates }, { onConflict: "id" })
        .select("*")
        .single();

      if (!error && data) {
        const rawProfile = data as Record<string, unknown>;
        const savedProfile = {
          id: String(rawProfile.id ?? user.id),
          username: normalizeString(rawProfile.username ?? rawProfile.name),
          selected_avatar_id: normalizeAvatarId(rawProfile.selected_avatar_id),
          role: normalizeString(rawProfile.role) ?? nextProfile.role,
          learning_goal: normalizeLearningGoal(rawProfile.learning_goal),
          learning_level: normalizeString(rawProfile.learning_level),
          daily_goal_minutes: normalizeNumber(rawProfile.daily_goal_minutes),
        };
        setProfile(savedProfile);
        syncAdminRoleCookie(savedProfile.role);
        if (savedProfile.username) window.localStorage.setItem(usernameStorageKey(user.id), savedProfile.username);
      }
    },
    [profile, session?.user],
  );

  const selectedAvatarId = profile?.selected_avatar_id ?? DEFAULT_AVATAR;

  const value = useMemo<AuthContextValue>(
    () => ({
      isConfigured,
      isLoading,
      session,
      user: session?.user ?? null,
      profile,
      selectedAvatarId,
      signInWithOAuth,
      signInWithEmail,
      signOut,
      updateProfile,
    }),
    [isConfigured, isLoading, profile, selectedAvatarId, session, signInWithEmail, signInWithOAuth, signOut, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

function normalizeAvatarId(value: unknown): MentorAvatarId {
  return value === "sensei" ||
    value === "professor" ||
    value === "robo_bot" ||
    value === "tulpar" ||
    value === "nomad" ||
    value === "snow_leopard" ||
    value === "astro" ||
    value === "maanay"
    ? value
    : DEFAULT_AVATAR;
}

function normalizeString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function normalizeLearningGoal(value: unknown): JarqProfile["learning_goal"] {
  return value === "english" || value === "programming" || value === "both" ? value : null;
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function touchProfile(userId: string, email?: string | null) {
  if (!supabase) return;
  await supabase
    .from("profiles")
    .update({ email: email ?? null, last_seen: new Date().toISOString() })
    .eq("id", userId);
}
