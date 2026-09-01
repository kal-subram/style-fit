// Canned stand-ins for the Claude-backed functions, used in demo mode so the
// full app runs with no API key. Deterministic and offline.
import type {
  AnalysisResult,
  CatalogQuery,
  ChatMessage,
  ChatResponse,
  Product,
  Recommendation,
  SortKey,
} from "../shared/types.ts";

/** A plausible fixed analysis. Style ids match the mock catalog's styleTags so
 *  recommendations return real items. */
export function mockAnalyze(): AnalysisResult {
  return {
    buildDescription:
      "Average, athletic build with balanced shoulder-to-waist ratio and medium frame.",
    measurements: {
      heightCm: 178,
      chestCm: 100,
      waistCm: 84,
      hipsCm: 98,
      shoulderCm: 46,
      inseamCm: 81,
    },
    recommendedSizes: { tops: "M", bottoms: "32x32", shoes: "10" },
    confidence: 0.55,
    complementaryColors: ["navy", "olive", "charcoal", "white"],
    styleSuggestions: [
      { id: "smart-casual", name: "Smart casual", description: "Polished but relaxed everyday wear.", why: "Flatters a balanced frame and works across occasions." },
      { id: "minimalist", name: "Minimalist", description: "Clean lines, neutral palette, few pieces.", why: "Your proportions carry simple silhouettes well." },
      { id: "streetwear", name: "Streetwear", description: "Relaxed, layered, sneaker-forward.", why: "Room for relaxed fits without overwhelming your frame." },
      { id: "classic", name: "Classic", description: "Timeless tailored staples.", why: "Structured pieces suit your shoulder-to-waist ratio." },
      { id: "indian", name: "Indian / Ethnic", description: "Kurtas, sherwanis, sarees, and festive ethnic wear.", why: "Flowing, structured ethnic silhouettes complement your frame for festive occasions." },
    ],
    notes:
      "Demo mode: this is a sample analysis, not derived from your photo. Add an ANTHROPIC_API_KEY for a real vision-based estimate.",
  };
}

/** Rank by rating and attach a templated fit reason. No model call. */
export function mockRankProducts(
  analysis: AnalysisResult,
  styleName: string,
  products: Product[],
): Recommendation[] {
  const sizeFor = (category: string) =>
    category === "shoes"
      ? analysis.recommendedSizes.shoes
      : category === "bottoms"
        ? analysis.recommendedSizes.bottoms
        : analysis.recommendedSizes.tops;

  return [...products]
    .sort((a, b) => b.rating - a.rating)
    .map((p) => {
      const size = sizeFor(p.category);
      const color = p.colors.find((c) => analysis.complementaryColors.includes(c));
      const bits = [`${styleName} pick`];
      if (size && p.sizesAvailable.includes(size)) bits.push(`available in your ${size}`);
      if (color) bits.push(`${color} suits your coloring`);
      return { product: p, fitReason: bits.join(" · ") };
    });
}

const COLORS = [
  "black", "white", "navy", "blue", "green", "olive", "sage", "charcoal",
  "grey", "gray", "brown", "camel", "cream", "sand", "stone", "indigo", "red",
];

const CATEGORY_WORDS: Record<string, string> = {
  shoe: "shoes", sneaker: "shoes", boot: "shoes",
  jacket: "outerwear", coat: "outerwear", bomber: "outerwear", vest: "outerwear", outerwear: "outerwear",
  pant: "bottoms", jean: "bottoms", trouser: "bottoms", chino: "bottoms", bottom: "bottoms",
  shirt: "tops", tee: "tops", "t-shirt": "tops", sweater: "tops", top: "tops",
};

const STYLE_WORDS: Record<string, string> = {
  formal: "formal", classic: "classic", casual: "casual", street: "streetwear",
  minimal: "minimalist", smart: "smart-casual", preppy: "preppy", resort: "resort", rugged: "rugged",
  indian: "indian", ethnic: "indian", festive: "indian", kurta: "indian",
  saree: "indian", sari: "indian", sherwani: "indian", lehenga: "indian",
  jutti: "indian", diwali: "indian",
};

/** Heuristic natural-language -> filter patch. Mirrors what the model does,
 *  well enough for a live demo. */
export function mockChat(
  messages: ChatMessage[],
  currentQuery: CatalogQuery,
): ChatResponse {
  const text = (messages.filter((m) => m.role === "user").at(-1)?.content ?? "").toLowerCase();
  const updates: Partial<CatalogQuery> = {};
  const changed: string[] = [];

  // Price
  const under = text.match(/under \$?(\d+)|\$(\d+)\b|below \$?(\d+)/);
  if (under) {
    const dollars = Number(under[1] ?? under[2] ?? under[3]);
    updates.maxPriceCents = dollars * 100;
    changed.push(`under $${dollars}`);
  } else if (/\bcheaper|cheap|budget|affordable\b/.test(text)) {
    const base = currentQuery.maxPriceCents ?? 20000;
    updates.maxPriceCents = Math.max(3000, Math.round(base * 0.6));
    changed.push(`cheaper (under $${Math.round(updates.maxPriceCents / 100)})`);
  } else if (/\bpremium|high[- ]?end|splurge|luxury\b/.test(text)) {
    updates.minPriceCents = 12000;
    changed.push("more premium");
  }

  // Shipping
  if (/\btoday|tomorrow|overnight|1[- ]day|next[- ]day\b/.test(text)) {
    updates.maxShipDays = 2; changed.push("fast shipping");
  } else if (/\bthis week|within a week|a week|fast|soon|quick\b/.test(text)) {
    updates.maxShipDays = 4; changed.push("ships this week");
  }

  // Colors
  const colors = COLORS.filter((c) => new RegExp(`\\b${c}\\b`).test(text));
  if (colors.length) {
    updates.colors = colors.map((c) => (c === "gray" ? "grey" : c));
    changed.push(colors.join("/"));
  }

  // Category
  for (const [word, cat] of Object.entries(CATEGORY_WORDS)) {
    if (text.includes(word)) {
      updates.categories = [...new Set([...(updates.categories ?? []), cat])];
    }
  }
  if (updates.categories) changed.push(updates.categories.join("/"));

  // Style
  const styles = new Set<string>();
  for (const [word, style] of Object.entries(STYLE_WORDS)) {
    if (text.includes(word)) styles.add(style);
  }
  if (styles.size) { updates.styles = [...styles]; changed.push([...styles].join("/")); }

  // Sort
  const sort: SortKey | undefined =
    /cheapest|low to high|price low/.test(text) ? "price_asc"
    : /most expensive|high to low/.test(text) ? "price_desc"
    : /fastest|soonest/.test(text) ? "ship_fastest"
    : /best rated|top rated|highest rated/.test(text) ? "rating"
    : undefined;
  if (sort) { updates.sort = sort; changed.push(`sorted by ${sort.replace("_", " ")}`); }

  const reply = changed.length
    ? `Done — updated to ${changed.join(", ")}. (Demo mode: rule-based, no AI call.)`
    : "I couldn't map that to a filter in demo mode. Try price, color, category, or shipping — e.g. \"navy tops under $80 that ship this week\".";

  return { reply, queryUpdates: Object.keys(updates).length ? updates : undefined };
}
