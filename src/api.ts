import type {
  AnalysisResult,
  CatalogQuery,
  ChatMessage,
  ChatResponse,
  RecommendResponse,
  TryOnResponse,
} from "../shared/types.ts";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(detail.error ?? `Request to ${path} failed`);
  }
  return res.json() as Promise<T>;
}

export interface Health {
  ok: boolean;
  demo: boolean;
  imageProvider: string;
  adapters: { id: string; name: string }[];
}

export async function health(): Promise<Health> {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error("health check failed");
  return res.json() as Promise<Health>;
}

export function analyze(imageBase64: string, mediaType: string): Promise<AnalysisResult> {
  return post("/api/analyze", { imageBase64, mediaType });
}

export function recommend(
  analysis: AnalysisResult,
  styleId: string,
  query: CatalogQuery,
): Promise<RecommendResponse> {
  return post("/api/recommend", { analysis, styleId, query });
}

export function chat(
  messages: ChatMessage[],
  currentQuery: CatalogQuery,
  analysis?: AnalysisResult,
): Promise<ChatResponse> {
  return post("/api/chat", { messages, currentQuery, analysis });
}

export function tryOn(productId: string, userImageBase64?: string): Promise<TryOnResponse> {
  return post("/api/tryon", { productId, userImageBase64 });
}

/** Merge a chat filter patch into the active query. `null` clears a field. */
export function mergeQuery(base: CatalogQuery, patch?: Partial<CatalogQuery>): CatalogQuery {
  if (!patch) return base;
  const next: CatalogQuery = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) delete (next as Record<string, unknown>)[key];
    else (next as Record<string, unknown>)[key] = value;
  }
  return next;
}
