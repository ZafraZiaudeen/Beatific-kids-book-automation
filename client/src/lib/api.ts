type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider | null = null;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

export function setApiTokenProvider(provider: TokenProvider | null) {
  tokenProvider = provider;
}

export function resolveApiUrl(path: string) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");

  if (tokenProvider) {
    const token = await tokenProvider();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(resolveApiUrl(path), {
    ...init,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String(payload.message)
        : String(payload || "Request failed");
    throw new Error(message);
  }

  return payload as T;
}
