import { useEffect, useRef, useState } from "react";
import type {
  AnalysisResult,
  CatalogQuery,
  ChatMessage,
  Recommendation,
} from "../shared/types.ts";
import * as api from "./api.ts";
import { PhotoUpload } from "./components/PhotoUpload.tsx";
import { DimensionsCard } from "./components/DimensionsCard.tsx";
import { StylePicker } from "./components/StylePicker.tsx";
import { Filters } from "./components/Filters.tsx";
import { ProductGrid } from "./components/ProductGrid.tsx";
import { ChatPanel } from "./components/ChatPanel.tsx";
import { DressSplash } from "./components/DressSplash.tsx";
import { TryOnModal, type TryOnState } from "./components/TryOnModal.tsx";
import { OutfitBuilder } from "./components/OutfitBuilder.tsx";
import type { OutfitLook, Product } from "../shared/types.ts";

export function App() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [styleId, setStyleId] = useState<string | null>(null);
  const [query, setQuery] = useState<CatalogQuery>({ limit: 24 });
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

  const [analyzing, setAnalyzing] = useState(false);
  const [recommending, setRecommending] = useState(false);
  const [chatting, setChatting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tryOn, setTryOn] = useState<TryOnState | null>(null);
  const [looks, setLooks] = useState<OutfitLook[]>([]);
  const [buildingOutfit, setBuildingOutfit] = useState(false);

  // Guards against out-of-order recommend responses clobbering fresh ones.
  const recSeq = useRef(0);
  // Latest analysis, read inside the recommend effect without making every
  // measurement keystroke re-trigger a fetch.
  const analysisRef = useRef<AnalysisResult | null>(null);
  analysisRef.current = analysis;

  async function handleAnalyze(imageBase64: string, mediaType: string) {
    setError(null);
    setAnalyzing(true);
    setPreviewUrl(imageBase64);
    try {
      const result = await api.analyze(imageBase64, mediaType);
      setAnalysis(result);
      setStyleId(result.styleSuggestions[0]?.id ?? null);
      setChatLog([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  // Re-fetch recommendations when the chosen style or filters change. Editing
  // measurements does not re-fetch (they only inform ranking), so typing in the
  // dimensions card never storms the API.
  useEffect(() => {
    const current = analysisRef.current;
    if (!current || !styleId) return;
    const seq = ++recSeq.current;
    setRecommending(true);
    api
      .recommend(current, styleId, query)
      .then((res) => {
        if (seq === recSeq.current) setRecs(res.recommendations);
      })
      .catch((e) => seq === recSeq.current && setError(e instanceof Error ? e.message : "Recommend failed"))
      .finally(() => seq === recSeq.current && setRecommending(false));
  }, [styleId, query]);

  async function handleChat(text: string) {
    if (!analysis) return;
    const nextLog: ChatMessage[] = [...chatLog, { role: "user", content: text }];
    setChatLog(nextLog);
    setChatting(true);
    try {
      const res = await api.chat(nextLog, query, analysis);
      setChatLog([...nextLog, { role: "assistant", content: res.reply }]);
      if (res.queryUpdates) setQuery((q) => api.mergeQuery(q, res.queryUpdates));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chat failed");
    } finally {
      setChatting(false);
    }
  }

  // Clear any built looks when the chosen style changes.
  useEffect(() => {
    setLooks([]);
  }, [styleId]);

  async function handleBuildOutfit() {
    const current = analysisRef.current;
    if (!current || !styleId) return;
    setBuildingOutfit(true);
    try {
      const res = await api.buildOutfit(current, styleId, query);
      setLooks(res.looks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Outfit build failed");
    } finally {
      setBuildingOutfit(false);
    }
  }

  async function handleTryOn(product: Product) {
    setTryOn({ product, status: "loading" });
    try {
      const res = await api.tryOn(product.id, previewUrl ?? undefined);
      if (res.imageUrl) {
        setTryOn({ product, status: "done", imageUrl: res.imageUrl });
      } else {
        setTryOn({ product, status: "unavailable", message: res.message });
      }
    } catch (e) {
      setTryOn({ product, status: "error", message: e instanceof Error ? e.message : undefined });
    }
  }

  return (
    <div className="app">
      <header>
        <h1>StyleFit</h1>
        <p className="muted">Upload a photo → get your fit → shop a style. Works with any store.</p>
      </header>

      {error && <div className="banner error">{error}<button onClick={() => setError(null)}>×</button></div>}

      <div className="layout">
        <aside className="col-left">
          <PhotoUpload onAnalyze={handleAnalyze} busy={analyzing} previewUrl={previewUrl} />
          {analysis && <DimensionsCard analysis={analysis} onChange={setAnalysis} />}
        </aside>

        <main className="col-main">
          {!analysis && (
            <div className="card empty">
              <DressSplash />
              <p className="muted">Start by uploading a photo. We’ll estimate your fit, suggest styles, and pull shoppable pieces you can filter and refine by chat.</p>
            </div>
          )}
          {analysis && (
            <>
              <StylePicker styles={analysis.styleSuggestions} selectedId={styleId} onSelect={setStyleId} />
              <OutfitBuilder looks={looks} busy={buildingOutfit} onBuild={handleBuildOutfit} />
              <ProductGrid recommendations={recs} busy={recommending} onTryOn={handleTryOn} />
            </>
          )}
        </main>

        {analysis && (
          <aside className="col-right">
            <Filters query={query} onChange={setQuery} />
            <ChatPanel messages={chatLog} busy={chatting} onSend={handleChat} />
          </aside>
        )}
      </div>

      {tryOn && <TryOnModal state={tryOn} onClose={() => setTryOn(null)} />}
    </div>
  );
}
