import type { AnalysisResult, Measurements } from "../../shared/types.ts";

interface Props {
  analysis: AnalysisResult;
  onChange: (next: AnalysisResult) => void;
}

const FIELDS: { key: keyof Measurements; label: string }[] = [
  { key: "heightCm", label: "Height" },
  { key: "chestCm", label: "Chest" },
  { key: "waistCm", label: "Waist" },
  { key: "hipsCm", label: "Hips" },
  { key: "shoulderCm", label: "Shoulder" },
  { key: "inseamCm", label: "Inseam" },
];

export function DimensionsCard({ analysis, onChange }: Props) {
  const { measurements, recommendedSizes, confidence } = analysis;

  function setMeasurement(key: keyof Measurements, value: string) {
    const num = value === "" ? undefined : Number(value);
    onChange({ ...analysis, measurements: { ...measurements, [key]: num } });
  }

  const pct = Math.round(confidence * 100);

  return (
    <div className="card">
      <h2>2 · Your estimated fit</h2>
      <p className="muted">{analysis.buildDescription}</p>

      <div className="confidence">
        <span>Confidence</span>
        <div className="bar"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
        <span>{pct}%</span>
      </div>

      <p className="muted small">Estimates from one photo are approximate — tweak any value.</p>

      <div className="grid measurements">
        {FIELDS.map((f) => (
          <label key={f.key} className="field">
            {f.label} (cm)
            <input
              type="number"
              value={measurements[f.key] ?? ""}
              onChange={(e) => setMeasurement(f.key, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="sizes">
        {recommendedSizes.tops && <span className="chip">Tops {recommendedSizes.tops}</span>}
        {recommendedSizes.bottoms && <span className="chip">Bottoms {recommendedSizes.bottoms}</span>}
        {recommendedSizes.dresses && <span className="chip">Dress {recommendedSizes.dresses}</span>}
        {recommendedSizes.shoes && <span className="chip">Shoe {recommendedSizes.shoes}</span>}
      </div>

      {analysis.complementaryColors.length > 0 && (
        <p className="muted small">Colors that suit you: {analysis.complementaryColors.join(", ")}</p>
      )}
      {analysis.notes && <p className="muted small note">⚠ {analysis.notes}</p>}
    </div>
  );
}
