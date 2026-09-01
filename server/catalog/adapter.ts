import type { CatalogQuery, Product } from "../../shared/types.ts";

/**
 * A CatalogAdapter is the single seam that makes StyleFit e-commerce-agnostic.
 * Any backend — Amazon, Shopify, a marketplace API, a local CSV — implements
 * this interface and registers itself. The rest of the app only ever sees
 * normalized `Product`s and speaks the normalized `CatalogQuery`.
 */
export interface CatalogAdapter {
  /** Stable id, e.g. "mock", "shopify", "amazon-paapi". */
  readonly id: string;
  /** Human-readable name shown in the UI. */
  readonly name: string;
  /** Return products matching the query. Adapters should honor as many query
   *  fields as their backend supports and ignore the rest. */
  search(query: CatalogQuery): Promise<Product[]>;
}
