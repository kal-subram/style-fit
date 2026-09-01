import type { StyleSuggestion } from "../../shared/types.ts";

interface Props {
  styles: StyleSuggestion[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StylePicker({ styles, selectedId, onSelect }: Props) {
  return (
    <div className="card">
      <h2>3 · Pick a style</h2>
      <div className="grid styles">
        {styles.map((s) => (
          <button
            key={s.id}
            className={`style-tile ${selectedId === s.id ? "selected" : ""}`}
            onClick={() => onSelect(s.id)}
          >
            <strong>{s.name}</strong>
            <span className="muted small">{s.description}</span>
            <span className="why">{s.why}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
