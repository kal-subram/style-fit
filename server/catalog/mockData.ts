import type { Product } from "../../shared/types.ts";
import { garmentImage } from "./garment.ts";

// A small hand-built catalog so the whole flow works with zero integrations.
// Swap this out for a real adapter (Shopify, Amazon PA-API, etc.) later.
// Product images are generated garment illustrations (see garment.ts), so every
// card shows the actual garment tinted to its color — no external photos.
const RAW: Omit<Product, "imageUrl">[] = [
  {
    id: "m1", title: "Merino Crew Sweater", brand: "Northwell",
    priceCents: 8900, currency: "USD",
    productUrl: "https://example.com/p/m1", category: "tops",
    styleTags: ["smart-casual", "minimalist", "classic"], colors: ["navy", "charcoal"],
    sizesAvailable: ["S", "M", "L", "XL"], shipDays: 2, rating: 4.6, source: "mock",
  },
  {
    id: "m2", title: "Oxford Button-Down Shirt", brand: "Halden",
    priceCents: 6500, currency: "USD",
    productUrl: "https://example.com/p/m2", category: "tops",
    styleTags: ["smart-casual", "classic", "preppy"], colors: ["white", "light blue"],
    sizesAvailable: ["S", "M", "L", "XL"], shipDays: 3, rating: 4.4, source: "mock",
  },
  {
    id: "m3", title: "Slim Stretch Chinos", brand: "Meridian",
    priceCents: 7200, currency: "USD",
    productUrl: "https://example.com/p/m3", category: "bottoms",
    styleTags: ["smart-casual", "minimalist", "classic"], colors: ["stone", "olive", "navy"],
    sizesAvailable: ["30x30", "32x30", "32x32", "34x32"], shipDays: 2, rating: 4.5, source: "mock",
  },
  {
    id: "m4", title: "Raw Denim Straight Jeans", brand: "Ironside",
    priceCents: 11800, currency: "USD",
    productUrl: "https://example.com/p/m4", category: "bottoms",
    styleTags: ["streetwear", "casual", "rugged"], colors: ["indigo"],
    sizesAvailable: ["30x30", "32x32", "34x32", "36x34"], shipDays: 5, rating: 4.7, source: "mock",
  },
  {
    id: "m5", title: "Oversized Graphic Tee", brand: "Halftone",
    priceCents: 3400, currency: "USD",
    productUrl: "https://example.com/p/m5", category: "tops",
    styleTags: ["streetwear", "casual"], colors: ["black", "cream"],
    sizesAvailable: ["S", "M", "L", "XL", "XXL"], shipDays: 1, rating: 4.2, source: "mock",
  },
  {
    id: "m6", title: "Technical Bomber Jacket", brand: "Vantage",
    priceCents: 15900, currency: "USD",
    productUrl: "https://example.com/p/m6", category: "outerwear",
    styleTags: ["streetwear", "smart-casual", "minimalist"], colors: ["black", "sage"],
    sizesAvailable: ["S", "M", "L", "XL"], shipDays: 4, rating: 4.6, source: "mock",
  },
  {
    id: "m7", title: "Wool Overcoat", brand: "Cromwell",
    priceCents: 24900, currency: "USD",
    productUrl: "https://example.com/p/m7", category: "outerwear",
    styleTags: ["classic", "formal", "minimalist"], colors: ["camel", "charcoal"],
    sizesAvailable: ["S", "M", "L", "XL"], shipDays: 7, rating: 4.8, source: "mock",
  },
  {
    id: "m8", title: "Leather Chelsea Boots", brand: "Ashford",
    priceCents: 18500, currency: "USD",
    productUrl: "https://example.com/p/m8", category: "shoes",
    styleTags: ["smart-casual", "classic", "formal"], colors: ["brown", "black"],
    sizesAvailable: ["8", "9", "10", "11", "12"], shipDays: 3, rating: 4.5, source: "mock",
  },
  {
    id: "m9", title: "Retro Court Sneakers", brand: "Baseline",
    priceCents: 9900, currency: "USD",
    productUrl: "https://example.com/p/m9", category: "shoes",
    styleTags: ["streetwear", "casual", "minimalist"], colors: ["white", "green"],
    sizesAvailable: ["8", "9", "10", "11", "12", "13"], shipDays: 2, rating: 4.4, source: "mock",
  },
  {
    id: "m10", title: "Linen Camp Shirt", brand: "Costa",
    priceCents: 5900, currency: "USD",
    productUrl: "https://example.com/p/m10", category: "tops",
    styleTags: ["casual", "resort", "minimalist"], colors: ["sand", "sky"],
    sizesAvailable: ["S", "M", "L", "XL"], shipDays: 6, rating: 4.1, source: "mock",
  },
  {
    id: "m11", title: "Tailored Wool Trousers", brand: "Cromwell",
    priceCents: 13500, currency: "USD",
    productUrl: "https://example.com/p/m11", category: "bottoms",
    styleTags: ["formal", "classic", "smart-casual"], colors: ["charcoal", "navy"],
    sizesAvailable: ["30x30", "32x30", "32x32", "34x32", "36x34"], shipDays: 4, rating: 4.6, source: "mock",
  },
  {
    id: "m12", title: "Quilted Liner Vest", brand: "Vantage",
    priceCents: 8800, currency: "USD",
    productUrl: "https://example.com/p/m12", category: "outerwear",
    styleTags: ["casual", "smart-casual", "rugged"], colors: ["olive", "black"],
    sizesAvailable: ["S", "M", "L", "XL"], shipDays: 3, rating: 4.3, source: "mock",
  },
];

export const MOCK_PRODUCTS: Product[] = RAW.map((p) => ({
  ...p,
  imageUrl: garmentImage(p.category, p.colors[0] ?? "navy"),
}));
