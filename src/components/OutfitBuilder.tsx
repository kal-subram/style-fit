import type { OutfitLook } from "../../shared/types.ts";

interface Props {
  looks: OutfitLook[];
  busy: boolean;
  onBuild: () => void;
}

function money(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

export function OutfitBuilder({ looks, busy, onBuild }: Props) {
  return (
    <div className="card">
      <div className="outfit-head">
        <h2>Outfit builder</h2>
        <button className="primary outfit-btn" onClick={onBuild} disabled={busy}>
          {busy ? "Assembling…" : "✨ Build complete outfits"}
        </button>
      </div>
      <p className="muted small">Coordinated head-to-toe looks assembled from your selected style.</p>

      {looks.length > 0 && (
        <div className="looks">
          {looks.map((look) => {
            const currency = look.items[0]?.currency ?? "USD";
            return (
              <div key={look.id} className="look">
                <div className="look-top">
                  <strong>{look.title}</strong>
                  <span className="price">{money(look.totalCents, currency)}</span>
                </div>
                <div className="look-items">
                  {look.items.map((p) => (
                    <a key={p.id} className="look-item" href={p.productUrl} target="_blank" rel="noreferrer">
                      <img src={p.imageUrl} alt={p.title} loading="lazy" />
                      <span className="look-item-title">{p.title}</span>
                      <span className="muted small">{money(p.priceCents, p.currency)}</span>
                    </a>
                  ))}
                </div>
                <p className="fit-reason">{look.rationale}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
