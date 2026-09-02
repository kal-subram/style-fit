// Types shared between the Express backend and the React frontend.

/** Body measurements the vision model estimates from a photo. All in cm, all
 *  optional because a single uncalibrated photo yields ranges, not truth. */
export interface Measurements {
  heightCm?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  shoulderCm?: number;
  inseamCm?: number;
}

/** Letter/number sizes the model maps the measurements onto. */
export interface RecommendedSizes {
  tops?: string; // e.g. "M" / "40R"
  bottoms?: string; // e.g. "32x30"
  dresses?: string;
  shoes?: string;
}

export interface StyleSuggestion {
  id: string;
  name: string; // e.g. "Smart casual"
  description: string;
  why: string; // why it suits this person
}

/** Result of analyzing the uploaded photo. */
export interface AnalysisResult {
  buildDescription: string;
  measurements: Measurements;
  recommendedSizes: RecommendedSizes;
  /** 0-1 model self-reported confidence in the measurements. */
  confidence: number;
  complementaryColors: string[];
  styleSuggestions: StyleSuggestion[];
  /** Caveats surfaced to the user (e.g. "no reference object, sizes are rough"). */
  notes: string;
}

// ---- Catalog layer ---------------------------------------------------------

export interface Product {
  id: string;
  title: string;
  brand: string;
  priceCents: number;
  currency: string; // ISO 4217, e.g. "USD"
  imageUrl: string;
  productUrl: string;
  category: string; // e.g. "tops", "bottoms", "outerwear", "shoes"
  styleTags: string[];
  colors: string[];
  sizesAvailable: string[];
  shipDays: number; // estimated days to deliver
  rating: number; // 0-5
  source: string; // which adapter produced this
}

export type SortKey = "relevance" | "price_asc" | "price_desc" | "ship_fastest" | "rating";

/** Normalized query every catalog adapter accepts. */
export interface CatalogQuery {
  styles?: string[];
  categories?: string[];
  colors?: string[];
  keywords?: string[];
  maxPriceCents?: number;
  minPriceCents?: number;
  maxShipDays?: number;
  sizes?: string[];
  sort?: SortKey;
  limit?: number;
}

/** A ranked product plus the stylist's reason it fits this user. */
export interface Recommendation {
  product: Product;
  fitReason: string;
}

// ---- API request/response payloads ----------------------------------------

export interface AnalyzeRequest {
  /** data URL or bare base64 of the uploaded image. */
  imageBase64: string;
  mediaType: string; // e.g. "image/jpeg"
}

export interface RecommendRequest {
  analysis: AnalysisResult;
  styleId: string;
  query: CatalogQuery;
}

export interface RecommendResponse {
  recommendations: Recommendation[];
  /** Adapters that were queried. */
  sources: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  /** Filters currently applied in the UI, so the model can amend them. */
  currentQuery: CatalogQuery;
  analysis?: AnalysisResult;
}

export interface ChatResponse {
  reply: string;
  /** Partial query the model wants merged into currentQuery, if any. */
  queryUpdates?: Partial<CatalogQuery>;
}

export interface TryOnRequest {
  productId: string;
  /** The shopper's photo (data URL), if available, for a real generator. */
  userImageBase64?: string;
}

export interface TryOnResponse {
  /** Generated on-model image URL, or null if unavailable. */
  imageUrl: string | null;
  /** Explanation shown when imageUrl is null. */
  message?: string;
}
