"use client";

import { Session, User } from "@supabase/supabase-js";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type MentorAvatarId = "maanay" | "sensei" | "professor" | "robo_bot";

export type JarqProfile = {
  id: string;
  username: string | null;
  selected_avatar_id: MentorAvatarId;
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
  updateProfile: (updates: Partial<Pick<JarqProfile, "username" | "selected_avatar_id">>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const DEFAULT_AVATAR: MentorAvatarId = "maanay";

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
    const fallbackUsername = user.user_metadata?.name ?? user.email?.split("@")[0] ?? "JARQ student";
    const baseProfile: JarqProfile = {
      id: user.id,
      username: fallbackUsername,
      selected_avatar_id: savedAvatar,
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(baseProfile, { onConflict: "id" })
      .select("id, username, selected_avatar_id")
      .single();

    if (error || !data) {
      setProfile(baseProfile);
      window.localStorage.setItem("jarq-selected-avatar", baseProfile.selected_avatar_id);
      return;
    }

    const normalizedProfile: JarqProfile = {
      id: data.id,
      username: data.username,
      selected_avatar_id: normalizeAvatarId(data.selected_avatar_id),
    };
    setProfile(normalizedProfile);
    window.localStorage.setItem("jarq-selected-avatar", normalizedProfile.selected_avatar_id);
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
        redirectTo: `${window.location.origin}/profile`,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) return;
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/profile`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Pick<JarqProfile, "username" | "selected_avatar_id">>) => {
      const user = session?.user;
      const normalizedUpdates = {
        ...updates,
        selected_avatar_id: updates.selected_avatar_id ? normalizeAvatarId(updates.selected_avatar_id) : undefined,
      };

      if (normalizedUpdates.selected_avatar_id) {
        window.localStorage.setItem("jarq-selected-avatar", normalizedUpdates.selected_avatar_id);
      }

      const nextProfile: JarqProfile = {
        id: user?.id ?? "local-user",
        username: normalizedUpdates.username ?? profile?.username ?? "JARQ student",
        selected_avatar_id: normalizedUpdates.selected_avatar_id ?? profile?.selected_avatar_id ?? DEFAULT_AVATAR,
      };

      setProfile(nextProfile);

      if (!supabase || !user) return;
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...normalizedUpdates }, { onConflict: "id" })
        .select("id, username, selected_avatar_id")
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          username: data.username,
          selected_avatar_id: normalizeAvatarId(data.selected_avatar_id),
        });
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
  return value === "sensei" || value === "professor" || value === "robo_bot" || value === "maanay" ? value : DEFAULT_AVATAR;
}
