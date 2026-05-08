const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function resolveApiUrl(path: string): string {
  if (path.startsWith("http")) return path;
  if (!API_BASE_URL) return path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(resolveApiUrl(path), init);
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : `Network request failed: ${path}`, 0);
  }

  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText || `Request failed: ${path}`;
    try {
      const parsed = JSON.parse(errorText) as { detail?: unknown; error?: unknown; message?: unknown };
      const detail = parsed.detail ?? parsed.error ?? parsed.message;
      if (typeof detail === "string") message = detail;
    } catch {
      // Keep plain text errors readable.
    }
    throw new ApiError(message, response.status);
  }

  return response.json();
}
