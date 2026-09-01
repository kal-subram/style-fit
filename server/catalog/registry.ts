import type { CatalogQuery, Product } from "../../shared/types.ts";
import type { CatalogAdapter } from "./adapter.ts";
import { MockCatalogAdapter } from "./mockAdapter.ts";

// Register adapters here. To plug in a real store, implement CatalogAdapter
// and add an instance to this list — nothing else in the app changes.
const adapters: CatalogAdapter[] = [new MockCatalogAdapter()];

export function listAdapters(): CatalogAdapter[] {
  return adapters;
}

/** Fan out the query to every adapter and merge results. Failures in one
 *  adapter don't sink the others. */
export async function searchAll(query: CatalogQuery): Promise<{ products: Product[]; sources: string[] }> {
  const settled = await Promise.allSettled(adapters.map((a) => a.search(query)));
  const products: Product[] = [];
  const sources: string[] = [];
  settled.forEach((res, i) => {
    if (res.status === "fulfilled") {
      products.push(...res.value);
      sources.push(adapters[i].id);
    } else {
      console.error(`[catalog] adapter ${adapters[i].id} failed:`, res.reason);
    }
  });
  return { products, sources };
}
