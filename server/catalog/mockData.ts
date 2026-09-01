import type { Product } from "../../shared/types.ts";
import { garmentImage } from "./garment.ts";

// A small hand-built catalog so the whole flow works with zero integrations.
// Swap this out for a real adapter (Shopify, Amazon PA-API, etc.) later.
// Each product uses a real demo photo (PHOTO map below), falling back to a
// generated SVG garment illustration (garment.ts) if no photo is mapped.
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

  // Indian / ethnic wear
  {
    id: "i1", title: "Cotton Kurta", brand: "Fabindia",
    priceCents: 4900, currency: "USD",
    productUrl: "https://example.com/p/i1", category: "tops",
    styleTags: ["indian", "casual", "festive"], colors: ["white", "sky"],
    sizesAvailable: ["S", "M", "L", "XL", "XXL"], shipDays: 4, rating: 4.6, source: "mock",
  },
  {
    id: "i2", title: "Embroidered Sherwani", brand: "Manyavar",
    priceCents: 24900, currency: "USD",
    productUrl: "https://example.com/p/i2", category: "outerwear",
    styleTags: ["indian", "formal", "festive"], colors: ["cream", "camel"],
    sizesAvailable: ["S", "M", "L", "XL"], shipDays: 7, rating: 4.8, source: "mock",
  },
  {
    id: "i3", title: "Silk Saree", brand: "Nalli",
    priceCents: 13900, currency: "USD",
    productUrl: "https://example.com/p/i3", category: "tops",
    styleTags: ["indian", "formal", "festive"], colors: ["red", "green"],
    sizesAvailable: ["Free"], shipDays: 5, rating: 4.7, source: "mock",
  },
  {
    id: "i4", title: "Georgette Lehenga", brand: "Biba",
    priceCents: 17900, currency: "USD",
    productUrl: "https://example.com/p/i4", category: "bottoms",
    styleTags: ["indian", "festive", "formal"], colors: ["red", "sky"],
    sizesAvailable: ["S", "M", "L", "XL"], shipDays: 6, rating: 4.5, source: "mock",
  },
  {
    id: "i5", title: "Nehru Jacket", brand: "Fabindia",
    priceCents: 8900, currency: "USD",
    productUrl: "https://example.com/p/i5", category: "outerwear",
    styleTags: ["indian", "smart-casual", "festive"], colors: ["navy", "charcoal"],
    sizesAvailable: ["S", "M", "L", "XL"], shipDays: 4, rating: 4.4, source: "mock",
  },
  {
    id: "i6", title: "Handcrafted Juttis", brand: "Needledust",
    priceCents: 5900, currency: "USD",
    productUrl: "https://example.com/p/i6", category: "shoes",
    styleTags: ["indian", "festive", "casual"], colors: ["camel", "red"],
    sizesAvailable: ["7", "8", "9", "10", "11"], shipDays: 5, rating: 4.3, source: "mock",
  },
];

// Real, license-friendly demo photos (Wikimedia Commons), one per product.
// Any product without an entry falls back to a generated SVG garment.
const PHOTO: Record<string, string> = {
  m1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Sweater_%28PSF%29.png/960px-Sweater_%28PSF%29.png",
  m2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Camisade_pu%C3%B1o_doble.jpg/960px-Camisade_pu%C3%B1o_doble.jpg",
  m3: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Chino_pants.jpg/960px-Chino_pants.jpg",
  m4: "https://commons.wikimedia.org/wiki/Special:FilePath/Blue%20Jeans.jpg?width=600",
  m5: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/WP_polo_shirt_FRONT_Merchandise_shots-24_cropped.jpg/960px-WP_polo_shirt_FRONT_Merchandise_shots-24_cropped.jpg",
  m6: "https://upload.wikimedia.org/wikipedia/commons/d/df/MA-1_Jacket_in_petrol.jpg",
  m7: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Albert_Reiss_LOC_ggbain-25651.jpg/960px-Albert_Reiss_LOC_ggbain-25651.jpg",
  m8: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Chelsea_boot%2C_black.jpg/960px-Chelsea_boot%2C_black.jpg",
  m9: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Reebok_Royal_Glide_Ripple_Clip_shoe.jpg/960px-Reebok_Royal_Glide_Ripple_Clip_shoe.jpg",
  m10: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Seto_linen_shirt_%28Saatse_Museum%29.jpg/960px-Seto_linen_shirt_%28Saatse_Museum%29.jpg",
  m11: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Man_with_pink_suit_and_purple_trousers.jpg/960px-Man_with_pink_suit_and_purple_trousers.jpg",
  m12: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Adidas_Helionic_Down_vest.jpg/960px-Adidas_Helionic_Down_vest.jpg",
  i1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Kurta_in_2010.jpg/960px-Kurta_in_2010.jpg",
  i2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Nawabs_of_Bhawalpur_in_Sherwani..jpg/960px-Nawabs_of_Bhawalpur_in_Sherwani..jpg",
  i3: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Sari_2.jpg/960px-Sari_2.jpg",
  i4: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Historical_1960s_Bridal_Lehenga_Design.png/960px-Historical_1960s_Bridal_Lehenga_Design.png",
  i5: "https://commons.wikimedia.org/wiki/Special:FilePath/Kurta%20churidar%20nehru%20vest.jpg?width=600",
  i6: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Punjabi_jutti_at_Dilli_Haat.jpg/960px-Punjabi_jutti_at_Dilli_Haat.jpg",
};

export const MOCK_PRODUCTS: Product[] = RAW.map((p) => ({
  ...p,
  imageUrl: PHOTO[p.id] ?? garmentImage(p.category, p.colors[0] ?? "navy"),
}));
