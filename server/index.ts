import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzePhoto } from "./vision.ts";
import { rankProducts, chat } from "./stylist.ts";
import { searchAll, listAdapters } from "./catalog/registry.ts";
import type {
  AnalyzeRequest,
  ChatRequest,
  RecommendRequest,
  RecommendResponse,
  CatalogQuery,
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
  res.json({ ok: true, adapters: listAdapters().map((a) => ({ id: a.id, name: a.name })) });
});

// 1. Photo -> dimensions, sizes, style suggestions.
app.post("/api/analyze", asyncHandler(async (req, res) => {
  const { imageBase64, mediaType } = req.body as AnalyzeRequest;
  if (!imageBase64) {
    res.status(400).json({ error: "imageBase64 is required" });
    return;
  }
  const analysis = await analyzePhoto(imageBase64, mediaType ?? "image/jpeg");
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
  const recommendations = await rankProducts(analysis, style?.name ?? styleId, products);
  const payload: RecommendResponse = { recommendations, sources };
  res.json(payload);
}));

// 3. Chat refinement -> reply + filter patch.
app.post("/api/chat", asyncHandler(async (req, res) => {
  const { messages, currentQuery, analysis } = req.body as ChatRequest;
  const result = await chat(messages, currentQuery ?? {}, analysis);
  res.json(result);
}));

const port = Number(process.env.API_PORT ?? 8787);
app.listen(port, () => {
  console.log(`[stylefit] API listening on http://localhost:${port}`);
});
