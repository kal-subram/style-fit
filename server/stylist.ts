import { getClient, MODEL, textOf, parseJson } from "./claude.ts";
import type {
  AnalysisResult,
  CatalogQuery,
  ChatMessage,
  ChatResponse,
  Product,
  Recommendation,
} from "../shared/types.ts";

/**
 * Ask the stylist to rank the candidate products for this person + style and
 * write a one-line fit reason for each. Products are pre-filtered by the
 * catalog; the model reorders and explains, it does not invent items.
 */
export async function rankProducts(
  analysis: AnalysisResult,
  styleName: string,
  products: Product[],
): Promise<Recommendation[]> {
  if (products.length === 0) return [];

  const slim = products.map((p) => ({
    id: p.id, title: p.title, brand: p.brand, category: p.category,
    styleTags: p.styleTags, colors: p.colors, priceCents: p.priceCents,
    shipDays: p.shipDays, rating: p.rating,
  }));

  const message = await getClient().messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: `You are a personal stylist. Given a person's build, recommended sizes,
complementary colors, a chosen style, and a list of candidate products, rank the
products best-first for this person and write a concise (<= 20 word) fit reason for
each referencing their build, size, or coloring. Only use product ids from the list.
Return ONLY JSON: [{ "id": string, "fitReason": string }] ordered best-first.`,
    messages: [
      {
        role: "user",
        content: JSON.stringify({
          build: analysis.buildDescription,
          recommendedSizes: analysis.recommendedSizes,
          complementaryColors: analysis.complementaryColors,
          chosenStyle: styleName,
          products: slim,
        }),
      },
    ],
  });

  const ranked = parseJson<{ id: string; fitReason: string }[]>(textOf(message));
  const byId = new Map(products.map((p) => [p.id, p]));
  const out: Recommendation[] = [];
  for (const r of ranked) {
    const product = byId.get(r.id);
    if (product) out.push({ product, fitReason: r.fitReason });
  }
  // Append any products the model omitted so nothing silently disappears.
  const seen = new Set(out.map((r) => r.product.id));
  for (const p of products) {
    if (!seen.has(p.id)) out.push({ product: p, fitReason: "" });
  }
  return out;
}

/**
 * Conversational refinement. The model replies in natural language AND emits a
 * structured `queryUpdates` patch the frontend merges into the active filters.
 */
export async function chat(
  messages: ChatMessage[],
  currentQuery: CatalogQuery,
  analysis?: AnalysisResult,
): Promise<ChatResponse> {
  const system = `You are a shopping assistant for a clothing app. The user refines
what they're browsing in plain language ("cheaper", "something for a wedding",
"ships this week", "more green", "under $80"). Interpret their request and produce
a JSON patch for the search filters, plus a short friendly reply.

Filter schema (all optional, only include keys you want to CHANGE):
{
  "styles"?: string[],        // kebab-case style tags
  "categories"?: string[],    // "tops" | "bottoms" | "outerwear" | "shoes"
  "colors"?: string[],
  "keywords"?: string[],
  "maxPriceCents"?: number,   // dollars * 100
  "minPriceCents"?: number,
  "maxShipDays"?: number,
  "sizes"?: string[],
  "sort"?: "relevance" | "price_asc" | "price_desc" | "ship_fastest" | "rating"
}
To CLEAR a filter, set it to null. Prices are in cents.

Return ONLY JSON: { "reply": string, "queryUpdates": { ...patch... } }.
${analysis ? `\nContext — the shopper's recommended sizes: ${JSON.stringify(analysis.recommendedSizes)}; complementary colors: ${analysis.complementaryColors.join(", ")}.` : ""}
Current filters: ${JSON.stringify(currentQuery)}.`;

  const message = await getClient().messages.create({
    model: MODEL,
    max_tokens: 2000,
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  return parseJson<ChatResponse>(textOf(message));
}
