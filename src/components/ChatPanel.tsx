import { useState } from "react";
import type { ChatMessage } from "../../shared/types.ts";

interface Props {
  messages: ChatMessage[];
  busy: boolean;
  onSend: (text: string) => void;
}

const SUGGESTIONS = ["Something cheaper", "Ships this week", "More formal", "Add some green"];

export function ChatPanel({ messages, busy, onSend }: Props) {
  const [text, setText] = useState("");

  function send(value: string) {
    const trimmed = value.trim();
    if (!trimmed || busy) return;
    onSend(trimmed);
    setText("");
  }

  return (
    <div className="card chat">
      <h3>Refine by chat</h3>
      <div className="chat-log">
        {messages.length === 0 && (
          <p className="muted small">Tell me how to adjust — price, occasion, color, shipping…</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>{m.content}</div>
        ))}
        {busy && <div className="bubble assistant muted">…</div>}
      </div>

      <div className="chat-suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="pill" onClick={() => send(s)} disabled={busy}>{s}</button>
        ))}
      </div>

      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <input
          value={text}
          placeholder="e.g. under $80 and ready to wear to a wedding"
          onChange={(e) => setText(e.target.value)}
        />
        <button className="primary" type="submit" disabled={busy}>Send</button>
      </form>
    </div>
  );
}
