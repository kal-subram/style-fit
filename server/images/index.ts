import type { Product } from "../../shared/types.ts";
import type { ImageProvider } from "./provider.ts";
import { specForProduct } from "./provider.ts";
import { SvgImageProvider } from "./svgProvider.ts";

// Register image providers here. To add on-model AI photos, implement
// ImageProvider (see generativeProvider.example.ts), add it to this list, and
// select it with STYLEFIT_IMAGE_PROVIDER=<id>.
const providers: ImageProvider[] = [new SvgImageProvider()];

const selectedId = process.env.STYLEFIT_IMAGE_PROVIDER ?? "svg";
const active: ImageProvider =
  providers.find((p) => p.id === selectedId) ?? providers[0];

export function activeImageProvider(): ImageProvider {
  return active;
}

// Cache generated images by product id so we never pay to regenerate the same
// item within a process. The SVG provider is cheap, but real providers are not.
const cache = new Map<string, string>();

/**
 * Return an image for a product using the active provider. Falls back to the
 * product's baseline image (the SVG set in mockData) if generation fails, so a
 * flaky image API never breaks the catalog.
 */
export async function imageForProduct(product: Product): Promise<string> {
  // The baseline is already an SVG garment, so skip work when SVG is active.
  if (active.id === "svg") return product.imageUrl;

  const cached = cache.get(product.id);
  if (cached) return cached;

  try {
    const url = await active.generate(specForProduct(product));
    cache.set(product.id, url);
    return url;
  } catch (err) {
    console.error(`[images] ${active.id} failed for ${product.id}:`, err);
    return product.imageUrl; // graceful fallback to the SVG baseline
  }
}

/** Enrich a list of products with provider-generated images (concurrently). */
export async function withImages(products: Product[]): Promise<Product[]> {
  if (active.id === "svg") return products; // baseline already correct
  return Promise.all(
    products.map(async (p) => ({ ...p, imageUrl: await imageForProduct(p) })),
  );
}
