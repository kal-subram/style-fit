import { useRef, useState } from "react";

interface Props {
  onAnalyze: (imageBase64: string, mediaType: string) => void;
  busy: boolean;
  previewUrl: string | null;
}

export function PhotoUpload({ onAnalyze, busy, previewUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ dataUrl: string; type: string } | null>(null);

  function onFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => setPending({ dataUrl: reader.result as string, type: file.type });
    reader.readAsDataURL(file);
  }

  const shownImage = pending?.dataUrl ?? previewUrl;

  return (
    <div className="card upload">
      <h2>1 · Upload your photo</h2>
      <p className="muted">
        A clear, full-body photo works best. Your photo is sent to the vision model
        only to estimate fit — nothing is stored.
      </p>

      <div
        className="dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) onFile(file);
        }}
      >
        {shownImage ? (
          <img src={shownImage} alt="upload preview" className="preview" />
        ) : (
          <span className="muted">Click or drop an image here</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />

      <button
        className="primary"
        disabled={!pending || busy}
        onClick={() => pending && onAnalyze(pending.dataUrl, pending.type)}
      >
        {busy ? "Analyzing…" : "Analyze fit"}
      </button>
    </div>
  );
}
