import Anthropic from "@anthropic-ai/sdk";

export const MODEL = process.env.STYLEFIT_MODEL ?? "claude-opus-5";

// Zero-arg constructor resolves ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN, or an
// `ant auth login` profile — see the .env.example.
export const client = new Anthropic();

/** Pull the concatenated text out of a Messages response. */
export function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

/**
 * The models reliably return JSON when asked, but occasionally wrap it in prose
 * or a ```json fence. Extract the first balanced JSON object/array and parse it.
 */
export function parseJson<T>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error(`No JSON found in model output: ${raw.slice(0, 200)}`);
  const open = candidate[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  for (let i = start; i < candidate.length; i++) {
    if (candidate[i] === open) depth++;
    else if (candidate[i] === close) {
      depth--;
      if (depth === 0) return JSON.parse(candidate.slice(start, i + 1)) as T;
    }
  }
  throw new Error(`Unbalanced JSON in model output: ${raw.slice(0, 200)}`);
}
