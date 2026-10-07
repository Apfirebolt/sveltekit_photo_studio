import type { RasterFormat, FrameStyle } from "$lib/types/utility";

const MAX_FILE_MB = 25;
const SVG_TRACE_MAX_PX = 1000;
const FRAME_OPTIONS: { id: FrameStyle; label: string }[] = [
  { id: "browser", label: "Browser Window" },
  { id: "iphone", label: "iPhone Bezel" },
  { id: "android", label: "Android Device" },
  { id: "ipad", label: "iPad Bezel" },
  { id: "macbook", label: "MacBook Pro" },
  { id: "polaroid", label: "Polaroid Print" },
  { id: "gallery", label: "Gallery Wood Frame" },
  { id: "film", label: "Film Strip" },
  { id: "neon", label: "Neon Glow" },
  { id: "border", label: "Clean White Border" },
  { id: "forest", label: "Forest Frame" },
  { id: "glossy", label: "Glossy Frame" },
  { id: "circular", label: "Circular Frame" },
  { id: "aqua", label: "Aqua Frame" },
  { id: "marine", label: "Marine Frame" },
  { id: "sand", label: "Sand Frame" },
  { id: "mars", label: "Mars Frame" },
  { id: "space", label: "Space Frame" },

  // add more frame options
];

const MIME: Record<RasterFormat, string> = {
  jpeg: "image/jpeg",
  webp: "image/webp",
  png: "image/png",
};

export { MAX_FILE_MB, SVG_TRACE_MAX_PX, FRAME_OPTIONS, MIME };
