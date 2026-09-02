import type { Product } from "../../shared/types.ts";

export interface TryOnState {
  product: Product;
  status: "loading" | "done" | "unavailable" | "error";
  imageUrl?: string;
  message?: string;
}

interface Props {
  state: TryOnState;
  onClose: () => void;
}

export function TryOnModal({ state, onClose }: Props) {
  const { product, status, imageUrl, message } = state;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <strong>Virtual try-on</strong>
            <div className="muted small">{product.title} · {product.brand}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body">
          {status === "loading" && (
            <div className="tryon-loading">
              <div className="spinner" />
              <p className="muted">Generating your try-on…</p>
            </div>
          )}
          {status === "done" && imageUrl && (
            <img className="tryon-image" src={imageUrl} alt={`Try-on: ${product.title}`} />
          )}
          {status === "unavailable" && <p className="muted">{message}</p>}
          {status === "error" && <p className="muted">{message ?? "Something went wrong generating the try-on."}</p>}
        </div>
      </div>
    </div>
  );
}
