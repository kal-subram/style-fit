/**
 * TEMPLATE — a real on-model image provider. Not wired in by default.
 *
 * To enable AI-generated product photos:
 *   1. Pick a provider and install its SDK (example uses OpenAI's Images API):
 *        npm install openai
 *   2. Copy this file to `openaiProvider.ts`, uncomment the body.
 *   3. Register it in `server/images/index.ts`:
 *        import { OpenAIImageProvider } from "./openaiProvider.ts";
 *        const providers = [new SvgImageProvider(), new OpenAIImageProvider()];
 *   4. Run with: STYLEFIT_IMAGE_PROVIDER=openai OPENAI_API_KEY=sk-... npm run dev
 *
 * Claude/Anthropic has no image generation, which is why this uses a separate
 * provider. Generated images are cached per product id by the registry, so each
 * catalog item is generated at most once per process. Cost is per image — see
 * the chosen provider's pricing before enabling for large catalogs.
 */
import type { ImageProvider, ImageSpec } from "./provider.ts";
import { promptForSpec } from "./provider.ts";

export class OpenAIImageProvider implements ImageProvider {
  readonly id = "openai";
  readonly name = "OpenAI gpt-image-1";

  async generate(_spec: ImageSpec): Promise<string> {
    // const OpenAI = (await import("openai")).default;
    // const client = new OpenAI(); // reads OPENAI_API_KEY
    // const res = await client.images.generate({
    //   model: "gpt-image-1",
    //   prompt: promptForSpec(_spec),
    //   size: "1024x1536", // 2:3, close to the 3:4 card
    //   n: 1,
    // });
    // const b64 = res.data[0].b64_json;
    // return `data:image/png;base64,${b64}`;
    void promptForSpec; // silence unused import in the template
    throw new Error("OpenAIImageProvider is a template — see the file header to enable it.");
  }
}
