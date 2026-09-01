import type { Recommendation } from "../../shared/types.ts";

interface Props {
  recommendations: Recommendation[];
  busy: boolean;
}

function price(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
}

export function ProductGrid({ recommendations, busy }: Props) {
  if (busy) return <div className="card"><p className="muted">Finding pieces that fit…</p></div>;
  if (recommendations.length === 0) {
    return <div className="card"><p className="muted">No matches. Loosen a filter or ask the assistant.</p></div>;
  }

  return (
    <div className="grid products">
      {recommendations.map(({ product: p, fitReason }) => (
        <a key={p.id} className="product" href={p.productUrl} target="_blank" rel="noreferrer">
          <div className="product-img" style={{ backgroundImage: `url(${p.imageUrl})` }} />
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
