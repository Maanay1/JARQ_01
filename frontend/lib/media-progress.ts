"use client";

import { FREE_DAILY_LESSON_LIMIT, getSubscriptionPlan, isProPlan } from "@/lib/subscription";

export const FREE_DAILY_VIDEO_LIMIT = 3;
export const FREE_PODCAST_LIMIT = 5;

const VIDEO_USAGE_KEY = "jarq-media-video-usage";
const VOCABULARY_KEY = "jarq-media-vocabulary";

export type VocabularyItem = {
  id: string;
  word: string;
  translation: string;
  example: string;
  source_video_id: string;
  learned: boolean;
  created_at: string;
};

export function canUseUnlimitedMedia(): boolean {
  return isProPlan(getSubscriptionPlan());
}

export function getTodayVideoUsage(): number {
  if (typeof window === "undefined") return 0;
  const today = todayKey();
  const raw = window.localStorage.getItem(VIDEO_USAGE_KEY);
  if (!raw) return 0;
  try {
    const parsed = JSON.parse(raw) as { date: string; count: number };
    return parsed.date === today ? parsed.count : 0;
  } catch {
    return 0;
  }
}

export function incrementTodayVideoUsage(): number {
  if (typeof window === "undefined") return 0;
  const nextCount = getTodayVideoUsage() + 1;
  window.localStorage.setItem(VIDEO_USAGE_KEY, JSON.stringify({ date: todayKey(), count: nextCount }));
  return nextCount;
}

export function remainingVideosToday(): number {
  if (canUseUnlimitedMedia()) return FREE_DAILY_LESSON_LIMIT;
  return Math.max(0, FREE_DAILY_VIDEO_LIMIT - getTodayVideoUsage());
}

export function loadLocalVocabulary(): VocabularyItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(VOCABULARY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as VocabularyItem[];
  } catch {
    return [];
  }
}

export function saveLocalVocabulary(items: VocabularyItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VOCABULARY_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("jarq-vocabulary-change"));
}

export function addLocalVocabulary(item: Omit<VocabularyItem, "id" | "created_at" | "learned">): VocabularyItem {
  const nextItem: VocabularyItem = {
    ...item,
    id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    learned: false,
    created_at: new Date().toISOString(),
  };
  const items = loadLocalVocabulary();
  const exists = items.some((current) => current.word.toLowerCase() === nextItem.word.toLowerCase() && current.source_video_id === nextItem.source_video_id);
  const nextItems = exists ? items : [nextItem, ...items];
  saveLocalVocabulary(nextItems);
  return nextItem;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
