import { garmentImage } from "../catalog/garment.ts";
import type { ImageProvider, ImageSpec } from "./provider.ts";

/** Default provider: an offline, free SVG garment illustration. */
export class SvgImageProvider implements ImageProvider {
  readonly id = "svg";
  readonly name = "SVG garment illustration";

  async generate(spec: ImageSpec): Promise<string> {
    return garmentImage(spec.category, spec.color);
  }
}
