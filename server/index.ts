import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzePhoto } from "./vision.ts";
import { rankProducts, chat } from "./stylist.ts";
import { mockAnalyze, mockRankProducts, mockChat } from "./mockAI.ts";
import { DEMO_MODE } from "./claude.ts";
import { searchAll, listAdapters } from "./catalog/registry.ts";
import { withImages, activeImageProvider } from "./images/index.ts";
import type {
  AnalyzeRequest,
  ChatRequest,
  RecommendRequest,
  RecommendResponse,
  CatalogQuery,
  TryOnRequest,
  TryOnResponse,
} from "../shared/types.ts";

const app = express();
app.use(cors());
// Photos as base64 get large; lift the body limit.
app.use(express.json({ limit: "15mb" }));

const asyncHandler =
  (fn: (req: express.Request, res: express.Response) => Promise<void>) =>
  (req: express.Request, res: express.Response) => {
    fn(req, res).catch((err) => {
      console.error(err);
      res.status(500).json({ error: err instanceof Error ? err.message : "Internal error" });
    });
  };

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    demo: DEMO_MODE,
    imageProvider: activeImageProvider().id,
    adapters: listAdapters().map((a) => ({ id: a.id, name: a.name })),
  });
});

// 1. Photo -> dimensions, sizes, style suggestions.
app.post("/api/analyze", asyncHandler(async (req, res) => {
  const { imageBase64, mediaType } = req.body as AnalyzeRequest;
  if (!imageBase64) {
    res.status(400).json({ error: "imageBase64 is required" });
    return;
  }
  const analysis = DEMO_MODE
    ? mockAnalyze()
    : await analyzePhoto(imageBase64, mediaType ?? "image/jpeg");
  res.json(analysis);
}));

// 2. Style + filters -> ranked, explained product recommendations.
app.post("/api/recommend", asyncHandler(async (req, res) => {
  const { analysis, styleId, query } = req.body as RecommendRequest;
  const style = analysis?.styleSuggestions.find((s) => s.id === styleId);
  // Seed the catalog query with the chosen style unless the caller overrode it.
  const effectiveQuery: CatalogQuery = {
    ...query,
    styles: query.styles?.length ? query.styles : styleId ? [styleId] : undefined,
  };
  const { products, sources } = await searchAll(effectiveQuery);
  // Attach provider imagery (SVG by default; on-model photos if a generative
  // provider is configured) to just the products we're about to show.
  const imaged = await withImages(products);
  const styleName = style?.name ?? styleId;
  const recommendations = DEMO_MODE
    ? mockRankProducts(analysis, styleName, imaged)
    : await rankProducts(analysis, styleName, imaged);
  const payload: RecommendResponse = { recommendations, sources };
  res.json(payload);
}));

// 3. Chat refinement -> reply + filter patch.
app.post("/api/chat", asyncHandler(async (req, res) => {
  const { messages, currentQuery, analysis } = req.body as ChatRequest;
  const result = DEMO_MODE
    ? mockChat(messages, currentQuery ?? {})
    : await chat(messages, currentQuery ?? {}, analysis);
  res.json(result);
}));

// Virtual try-on. A real build would send the shopper's photo + the garment to
// an image-generation model (Claude has none — same seam as ImageProvider). In
// the demo we return a pre-generated on-model image, mapped by product id.
// Add more by dropping <id>.png into public/tryon/ and listing it here.
const TRYON_IMAGES: Record<string, string> = {
  i3: "/tryon/i3.png", // Silk Saree
};

app.post("/api/tryon", asyncHandler(async (req, res) => {
  const { productId } = req.body as TryOnRequest;
  const imageUrl = TRYON_IMAGES[productId] ?? null;
  // Simulate generation latency so the UX matches a real model call.
  await new Promise((r) => setTimeout(r, imageUrl ? 1400 : 200));
  const payload: TryOnResponse = imageUrl
    ? { imageUrl }
    : { imageUrl: null, message: "Virtual try-on isn't available for this item in the demo yet." };
  res.json(payload);
}));

const port = Number(process.env.API_PORT ?? 8787);
app.listen(port, () => {
  console.log(`[stylefit] API listening on http://localhost:${port}`);
  console.log(`[stylefit] mode: ${DEMO_MODE ? "DEMO (canned responses, no API key)" : "LIVE (Claude)"}`);
  console.log(`[stylefit] images: ${activeImageProvider().name}`);
});
