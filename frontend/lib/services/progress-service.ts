import { apiRequest } from "@/lib/services/api-client";
import { UserMistake, UserProgress } from "@/lib/types";

export async function getUserProgress(userId: string): Promise<UserProgress> {
  return apiRequest<UserProgress>(`/users/${userId}/progress`, { cache: "no-store" });
}

export async function getUserMistakes(userId: string): Promise<UserMistake[]> {
  return apiRequest<UserMistake[]>(`/users/${userId}/mistakes`, { cache: "no-store" });
}

export async function addUserXp(userId: string, amount = 10): Promise<UserProgress> {
  return apiRequest<UserProgress>(`/users/${userId}/xp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
}

export async function updateUserStreak(userId: string, increment = 1): Promise<UserProgress> {
  return apiRequest<UserProgress>(`/users/${userId}/streak`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ increment }),
  });
}
