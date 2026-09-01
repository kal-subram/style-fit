import type { Product } from "../../shared/types.ts";

/** What an image provider is asked to depict. */
export interface ImageSpec {
  title: string;
  brand: string;
  category: string;
  color: string;
  styleTags: string[];
}

/**
 * The seam for product imagery. The default provider draws an SVG garment
 * (offline, free). A real generative provider (OpenAI gpt-image, Stability,
 * Replicate, …) implements the same interface to return on-model photos — see
 * server/images/generativeProvider.example.ts for a drop-in template.
 */
export interface ImageProvider {
  readonly id: string;
  readonly name: string;
  /** Return an image URL or data-URI depicting the garment. */
  generate(spec: ImageSpec): Promise<string>;
}

/** Turn a product into an ImageSpec. */
export function specForProduct(p: Product): ImageSpec {
  return {
    title: p.title,
    brand: p.brand,
    category: p.category,
    color: p.colors[0] ?? "neutral",
    styleTags: p.styleTags,
  };
}

/**
 * A photorealistic on-model prompt real providers can feed to an image model.
 * Kept here so every provider produces consistent imagery.
 */
export function promptForSpec(spec: ImageSpec): string {
  return [
    `Full-body e-commerce fashion photograph of a model wearing a ${spec.color} ${spec.title.toLowerCase()}`,
    `styled ${spec.styleTags.join(", ")}`,
    "neutral seamless studio background, soft even lighting, natural pose,",
    "sharp focus, high detail, no text, no watermark, catalog product photography",
  ].join(", ");
}
