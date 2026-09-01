import type { Recommendation } from "../../shared/types.ts";

interface Props {
  recommendations: Recommendation[];
  busy: boolean;
}

function price(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

// Neutral placeholder shown if a product image fails to load (as an <img> src,
// so no CSS url() parsing issues). URL-encoded SVG, no parentheses.
const FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="#232733"/><text x="150" y="205" fill="#9aa0ac" font-family="sans-serif" font-size="16" text-anchor="middle">no image</text></svg>',
  );

export function ProductGrid({ recommendations, busy }: Props) {
  if (busy) return <div className="card"><p className="muted">Finding pieces that fit…</p></div>;
  if (recommendations.length === 0) {
    return <div className="card"><p className="muted">No matches. Loosen a filter or ask the assistant.</p></div>;
  }

  return (
    <div className="grid products">
      {recommendations.map(({ product: p, fitReason }) => (
        <a key={p.id} className="product" href={p.productUrl} target="_blank" rel="noreferrer">
          <img
            className="product-img"
            src={p.imageUrl}
            alt={p.title}
            loading="lazy"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK;
            }}
          />
          <div className="product-body">
            <div className="product-top">
              <strong>{p.title}</strong>
              <span className="price">{price(p.priceCents, p.currency)}</span>
            </div>
            <span className="muted small">{p.brand}</span>
            <div className="product-meta">
              <span>★ {p.rating.toFixed(1)}</span>
              <span>{p.shipDays}-day ship</span>
            </div>
            {fitReason && <p className="fit-reason">{fitReason}</p>}
          </div>
        </a>
      ))}
    </div>
  );
}
