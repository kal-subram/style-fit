import { client, MODEL, textOf, parseJson } from "./claude.ts";
import type { AnalysisResult } from "../shared/types.ts";

const SYSTEM = `You are a professional fashion fit consultant and image analyst.
You receive one photo of a person and estimate their body proportions and clothing
sizes so an e-commerce app can recommend well-fitting clothes.

Reality check you MUST respect:
- A single uncalibrated photo cannot give exact measurements. Estimate proportions
  and likely size RANGES, and reflect your uncertainty honestly in "confidence".
- If the photo has a visible reference (a door, a standard object) use it; otherwise
  say so in "notes" and keep confidence modest (<= 0.6).
- Never guess demographic attributes beyond what is needed for fit. Describe build,
  not identity.
- If no person is clearly visible, return confidence 0 and explain in "notes".

Return ONLY a JSON object with this exact shape (no prose, no code fence):
{
  "buildDescription": string,
  "measurements": { "heightCm"?: number, "chestCm"?: number, "waistCm"?: number, "hipsCm"?: number, "shoulderCm"?: number, "inseamCm"?: number },
  "recommendedSizes": { "tops"?: string, "bottoms"?: string, "dresses"?: string, "shoes"?: string },
  "confidence": number,               // 0-1
  "complementaryColors": string[],    // colors that flatter this person
  "styleSuggestions": [               // 3-5 styles that would suit them
    { "id": string, "name": string, "description": string, "why": string }
  ],
  "notes": string                     // caveats about accuracy
}
Style ids must be lowercase kebab-case (e.g. "smart-casual", "streetwear").`;

export async function analyzePhoto(imageBase64: string, mediaType: string): Promise<AnalysisResult> {
  // Strip a data-URL prefix if the client sent one.
  const data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
              data,
            },
          },
          { type: "text", text: "Analyze this photo and return the JSON described in the system prompt." },
        ],
      },
    ],
  });

  if (message.stop_reason === "refusal") {
    throw new Error("The model declined to analyze this image. Try a clearer, appropriate full-body photo.");
  }

  const result = parseJson<AnalysisResult>(textOf(message));
  // Defensive defaults so the frontend never has to null-check core fields.
  result.styleSuggestions ??= [];
  result.complementaryColors ??= [];
  result.measurements ??= {};
  result.recommendedSizes ??= {};
  return result;
}
