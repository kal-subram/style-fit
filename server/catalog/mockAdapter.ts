import type { CatalogQuery, Product, SortKey } from "../../shared/types.ts";
import type { CatalogAdapter } from "./adapter.ts";
import { MOCK_PRODUCTS } from "./mockData.ts";

function matchesAny(haystack: string[], needles?: string[]): boolean {
  if (!needles || needles.length === 0) return true;
  const lower = haystack.map((h) => h.toLowerCase());
  return needles.some((n) => lower.includes(n.toLowerCase()));
}

function matchesKeywords(p: Product, keywords?: string[]): boolean {
  if (!keywords || keywords.length === 0) return true;
  const blob = `${p.title} ${p.brand} ${p.category} ${p.styleTags.join(" ")} ${p.colors.join(" ")}`.toLowerCase();
  // OR semantics keeps results forgiving for loose natural-language queries.
  return keywords.some((k) => blob.includes(k.toLowerCase()));
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  relevance: (a, b) => b.rating - a.rating,
  price_asc: (a, b) => a.priceCents - b.priceCents,
  price_desc: (a, b) => b.priceCents - a.priceCents,
  ship_fastest: (a, b) => a.shipDays - b.shipDays,
  rating: (a, b) => b.rating - a.rating,
};

/** Reference adapter over an in-memory catalog. Honors every query field. */
export class MockCatalogAdapter implements CatalogAdapter {
  readonly id = "mock";
  readonly name = "Demo Catalog";

  async search(query: CatalogQuery): Promise<Product[]> {
    let results = MOCK_PRODUCTS.filter((p) => {
      if (!matchesAny(p.styleTags, query.styles)) return false;
      if (query.categories?.length && !query.categories.includes(p.category)) return false;
      if (!matchesAny(p.colors, query.colors)) return false;
      if (!matchesKeywords(p, query.keywords)) return false;
      if (query.maxPriceCents != null && p.priceCents > query.maxPriceCents) return false;
      if (query.minPriceCents != null && p.priceCents < query.minPriceCents) return false;
      if (query.maxShipDays != null && p.shipDays > query.maxShipDays) return false;
      if (!matchesAny(p.sizesAvailable, query.sizes)) return false;
      return true;
    });

    results = results.sort(sorters[query.sort ?? "relevance"]);
    return results.slice(0, query.limit ?? 24);
  }
}
