import type { CatalogQuery, SortKey } from "../../shared/types.ts";

interface Props {
  query: CatalogQuery;
  onChange: (next: CatalogQuery) => void;
}

const CATEGORIES = ["tops", "bottoms", "outerwear", "shoes"];
const SORTS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Best match" },
  { key: "price_asc", label: "Price: low to high" },
  { key: "price_desc", label: "Price: high to low" },
  { key: "ship_fastest", label: "Ships soonest" },
  { key: "rating", label: "Top rated" },
];

export function Filters({ query, onChange }: Props) {
  const maxDollars = query.maxPriceCents != null ? query.maxPriceCents / 100 : "";

  function toggleCategory(cat: string) {
    const set = new Set(query.categories ?? []);
    set.has(cat) ? set.delete(cat) : set.add(cat);
    onChange({ ...query, categories: set.size ? [...set] : undefined });
  }

  return (
    <div className="card filters">
      <h3>Refine</h3>

      <div className="filter-row">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`pill ${query.categories?.includes(c) ? "on" : ""}`}
            onClick={() => toggleCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <label className="field">
        Max price (${maxDollars || "—"})
        <input
          type="range" min={20} max={300} step={5}
          value={typeof maxDollars === "number" ? maxDollars : 300}
          onChange={(e) => onChange({ ...query, maxPriceCents: Number(e.target.value) * 100 })}
        />
      </label>

      <label className="field">
        Ships within
        <select
          value={query.maxShipDays ?? ""}
          onChange={(e) =>
            onChange({ ...query, maxShipDays: e.target.value ? Number(e.target.value) : undefined })
          }
        >
          <option value="">Any time</option>
          <option value="2">2 days</option>
          <option value="4">4 days</option>
          <option value="7">1 week</option>
        </select>
      </label>

      <label className="field">
        Sort by
        <select
          value={query.sort ?? "relevance"}
          onChange={(e) => onChange({ ...query, sort: e.target.value as SortKey })}
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </label>

      <button className="link" onClick={() => onChange({ limit: query.limit, styles: query.styles })}>
        Clear filters
      </button>
    </div>
  );
}
