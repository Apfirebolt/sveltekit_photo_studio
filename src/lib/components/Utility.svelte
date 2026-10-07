<script lang="ts">
  import Icon from "@iconify/svelte";
  import JSZip from "jszip";
  import ImageTracer from "imagetracerjs";
  import { onDestroy } from "svelte";
  import { filterCategories } from "$lib/utils/filters";
  import type { OutputFormat, RasterFormat, NamingMode, ResizeMode, WatermarkPos, FrameStyle, QueuedImage, Summary, Mode } from "$lib/types/utility";

  let appMode = $state<Mode>("bulk");  
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

  const allCanvasFilters = filterCategories.flatMap((cat) => cat.filters);

  let nextId = 0;
  let images = $state<QueuedImage[]>([]);
  let reduction = $state(30);
  let format = $state<OutputFormat>("jpeg");
  let naming = $state<NamingMode>("numeric");
  let prefix = $state("");
  let svgColors = $state(16);

  // Frame options
  let addFrame = $state(false);
  let frameStyle = $state<FrameStyle>("browser");
  let framePadding = $state(48);

  // Filter selection states
  let filterSearchQuery = $state("");
  let applyFilter = $state(false);
  let selectedFilterId = $state("normal");
  let feelingLucky = $state(false);

  // Other utility states
  let resizeMode = $state<ResizeMode>("none");
  let targetWidth = $state(1200);
  let targetHeight = $state(1200);
  let padColor = $state("#ffffff");

  let watermarkText = $state("");
  let watermarkPos = $state<WatermarkPos>("bottom-right");
  let watermarkOpacity = $state(50);

  let brightness = $state(100);
  let contrast = $state(100);

  let isDragging = $state(false);
  let isProcessing = $state(false);
  let progress = $state(0);
  let errorMessage = $state("");
  let summary = $state<Summary | null>(null);

  // Collage-specific states
  let collageCols = $state(2);
  let collageGap = $state(16);
  let collageBgColor = $state("#ffffff");
  let collagePadding = $state(24);  
  let collagePreviewUrl = $state("");

  const filteredCategories = $derived(
    filterCategories.map((cat) => ({
      ...cat,
      filters: cat.filters.filter((f) => f.name.toLowerCase().includes(filterSearchQuery.toLowerCase())),
    })).filter((cat) => cat.filters.length > 0)
  );

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const addFiles = (files: File[]) => {
    errorMessage = "";
    summary = null;
    const rejected: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        rejected.push(`${file.name} (not an image)`);
      } else if (file.size > MAX_FILE_MB * 1024 * 1024) {
        rejected.push(`${file.name} (over ${MAX_FILE_MB} MB)`);
      } else {
        images.push({ id: nextId++, file, previewUrl: URL.createObjectURL(file) });
      }
    }
    if (rejected.length > 0) errorMessage = `Skipped: ${rejected.join(", ")}`;
  };

  const handleFileInput = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    addFiles(Array.from(input.files ?? []));
    input.value = "";
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging = false;
    addFiles(Array.from(event.dataTransfer?.files ?? []));
  };

  const handleDragLeave = (event: DragEvent) => {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
      isDragging = false;
    }
  };

  const removeImage = (id: number) => {
    const target = images.find((image) => image.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    images = images.filter((image) => image.id !== id);
    summary = null;
  };

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    images = [];
    summary = null;
    errorMessage = "";
  };

  const alphaLabel = (index: number) => {
    let label = "";
    let value = index;
    do {
      label = String.fromCharCode(65 + (value % 26)) + label;
      value = Math.floor(value / 26) - 1;
    } while (value >= 0);
    return label;
  };

  const randomLabel = () =>
    Array.from(crypto.getRandomValues(new Uint8Array(4)), (byte) => byte.toString(16).padStart(2, "0")).join("");

  const sanitize = (value: string) => value.replace(/[\\/:*?"<>|]+/g, "_").trim();

  const extensionFor = (mimeType: string) =>
    mimeType === "image/jpeg" ? "jpg" : mimeType === "image/webp" ? "webp" : mimeType === "image/svg+xml" ? "svg" : "png";

  const makeName = (index: number, file: File, extension: string, used: Set<string>) => {
    const original = file.name.replace(/\.[^.]+$/, "") || file.name;
    const base =
      naming === "original" ? original : naming === "numeric" ? String(index + 1) : naming === "alpha" ? alphaLabel(index) : randomLabel();
    const candidate = sanitize(`${prefix}${base}`) || "image";

    let name = candidate;
    let suffix = 2;
    while (used.has(`${name}.${extension}`.toLowerCase())) name = `${candidate}_${suffix++}`;
    used.add(`${name}.${extension}`.toLowerCase());
    return `${name}.${extension}`;
  };

  const processCanvas = (bitmap: ImageBitmap, activeCssFilter?: string) => {
    let w = bitmap.width;
    let h = bitmap.height;
    let dx = 0;
    let dy = 0;
    let dw = w;
    let dh = h;

    let finalW = w;
    let finalH = h;

    if (resizeMode !== "none") {
      const tw = targetWidth || w;
      const th = targetHeight || h;

      if (resizeMode === "exact") {
        finalW = tw;
        finalH = th;
        dw = tw;
        dh = th;
      } else if (resizeMode === "fit") {
        const ratio = Math.min(tw / w, th / h);
        finalW = Math.round(w * ratio);
        finalH = Math.round(h * ratio);
        dw = finalW;
        dh = finalH;
      } else if (resizeMode === "fill") {
        finalW = tw;
        finalH = th;
        const ratio = Math.max(tw / w, th / h);
        dw = Math.round(w * ratio);
        dh = Math.round(h * ratio);
        dx = Math.round((tw - dw) / 2);
        dy = Math.round((th - dh) / 2);
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = finalW;
    canvas.height = finalH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available.");

    if (format === "jpeg" || resizeMode === "fill" || resizeMode === "exact") {
      ctx.fillStyle = padColor;
      ctx.fillRect(0, 0, finalW, finalH);
    }

    let filterString = "";
    if (activeCssFilter && activeCssFilter !== "none") filterString += `${activeCssFilter} `;
    if (brightness !== 100) filterString += `brightness(${brightness}%) `;
    if (contrast !== 100) filterString += `contrast(${contrast}%) `;
    if (filterString.trim()) ctx.filter = filterString.trim();

    ctx.drawImage(bitmap, dx, dy, dw, dh);
    ctx.filter = "none";

    if (watermarkText.trim()) {
      ctx.font = `${Math.max(12, Math.round(finalW * 0.03))}px sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity / 100})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${watermarkOpacity / 100})`;
      ctx.lineWidth = 2;

      const metrics = ctx.measureText(watermarkText);
      const textW = metrics.width;
      const padding = 20;

      let wx = padding;
      let wy = finalH - padding;

      if (watermarkPos === "bottom-right") {
        wx = finalW - textW - padding;
        wy = finalH - padding;
      } else if (watermarkPos === "top-right") {
        wx = finalW - textW - padding;
        wy = padding + 20;
      } else if (watermarkPos === "top-left") {
        wx = padding;
        wy = padding + 20;
      } else if (watermarkPos === "center") {
        wx = (finalW - textW) / 2;
        wy = finalH / 2;
      }

      ctx.strokeText(watermarkText, wx, wy);
      ctx.fillText(watermarkText, wx, wy);
    }

    return addFrame ? applyFrame(canvas) : canvas;
  };

  const traceToSvg = async (canvas: HTMLCanvasElement) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const scale = Math.min(1, SVG_TRACE_MAX_PX / Math.max(canvas.width, canvas.height));
    const source = document.createElement("canvas");
    source.width = Math.max(1, Math.round(canvas.width * scale));
    source.height = Math.max(1, Math.round(canvas.height * scale));
    const ctx = source.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available.");
    ctx.drawImage(canvas, 0, 0, source.width, source.height);

    const svg = ImageTracer.imagedataToSVG(ctx.getImageData(0, 0, source.width, source.height), {
      numberofcolors: svgColors,
      viewbox: true,
    });
    return new Blob([svg], { type: "image/svg+xml" });
  };

  // Re-generate preview whenever collage settings or images change
  $effect(() => {
    // 1. Read reactive variables synchronously so Svelte 5 tracks them
    const colsSetting = collageCols;
    const gapSetting = collageGap;
    const padSetting = collagePadding;
    const bgSetting = collageBgColor;
    const currentMode = appMode;
    const currentImages = images;

    if (currentMode !== "collage" || currentImages.length === 0) {
      if (collagePreviewUrl) URL.revokeObjectURL(collagePreviewUrl);
      collagePreviewUrl = "";
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const bitmaps = await Promise.all(currentImages.map((img) => createImageBitmap(img.file)));
        const cols = Math.min(colsSetting, bitmaps.length);
        const rows = Math.ceil(bitmaps.length / cols);

        const sampleW = bitmaps[0].width;
        const sampleH = bitmaps[0].height;
        const cellW = Math.round(sampleW / (cols > 1 ? 1.2 : 1));
        const cellH = Math.round(sampleH / (cols > 1 ? 1.2 : 1));

        const totalW = padSetting * 2 + cols * cellW + (cols - 1) * gapSetting;
        const totalH = padSetting * 2 + rows * cellH + (rows - 1) * gapSetting;

        const canvas = document.createElement("canvas");
        canvas.width = totalW;
        canvas.height = totalH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = bgSetting;
        ctx.fillRect(0, 0, totalW, totalH);

        bitmaps.forEach((bmp, index) => {
          const r = Math.floor(index / cols);
          const c = index % cols;
          const x = padSetting + c * (cellW + gapSetting);
          const y = padSetting + r * (cellH + gapSetting);

          ctx.save();
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 4;
          ctx.beginPath();
          ctx.roundRect(x, y, cellW, cellH, 12);
          ctx.fill();
          ctx.clip();

          const ratio = Math.max(cellW / bmp.width, cellH / bmp.height);
          const dw = bmp.width * ratio;
          const dh = bmp.height * ratio;
          const dx = x + (cellW - dw) / 2;
          const dy = y + (cellH - dh) / 2;

          ctx.drawImage(bmp, dx, dy, dw, dh);
          ctx.restore();
          bmp.close();
        });

        canvas.toBlob((blob) => {
          if (!isMounted || !blob) return;
          if (collagePreviewUrl) URL.revokeObjectURL(collagePreviewUrl);
          collagePreviewUrl = URL.createObjectURL(blob);
        }, "image/jpeg", 0.85);
      } catch (err) {
        console.error("Collage preview error:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  });

  const applyFrame = (src: HTMLCanvasElement) => {
    const w = src.width;
    const h = src.height;
    // Decoration sizes scale with image size so frames look the same at any resolution.
    const u = Math.max(0.5, Math.max(w, h) / 1000);
    const pad = Math.round(framePadding * u);

    const stage = (width: number, height: number, from: string, to = from) => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not available.");
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, from);
      gradient.addColorStop(1, to);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return { canvas, ctx };
    };

    const lift = (ctx: CanvasRenderingContext2D, blur: number, offsetY: number, alpha: number, draw: () => void) => {
      ctx.save();
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      ctx.shadowBlur = blur * u;
      ctx.shadowOffsetY = offsetY * u;
      draw();
      ctx.restore();
    };

    const place = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number | number[] = 0) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.clip();
      ctx.drawImage(src, x, y);
      ctx.restore();
    };

    switch (frameStyle) {
      case "browser": {
        const bar = 40 * u;
        const r = 12 * u;
        const { canvas, ctx } = stage(w + pad * 2, h + bar + pad * 2, "#4f46e5", "#9333ea");
        lift(ctx, 30, 15, 0.35, () => {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w, h + bar, r);
          ctx.fill();
        });
        ctx.fillStyle = "#f3f4f6";
        ctx.beginPath();
        ctx.roundRect(pad, pad, w, bar, [r, r, 0, 0]);
        ctx.fill();
        ["#ef4444", "#f59e0b", "#10b981"].forEach((color, index) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(pad + (20 + index * 20) * u, pad + bar / 2, 5 * u, 0, Math.PI * 2);
          ctx.fill();
        });
        place(ctx, pad, pad + bar, [0, 0, r, r]);
        return canvas;
      }
      case "iphone": {
        const bezel = 24 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#0f172a", "#334155");
        lift(ctx, 40, 20, 0.5, () => {
          ctx.fillStyle = "#1e293b";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, 44 * u);
          ctx.fill();
        });
        place(ctx, pad + bezel, pad + bezel, 28 * u);
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.roundRect(pad + bezel + w * 0.36, pad + bezel + 12 * u, w * 0.28, 26 * u, 13 * u);
        ctx.fill();
        return canvas;
      }
      case "android": {
        const bezel = 24 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#0f172a", "#334155");
        lift(ctx, 40, 20, 0.5, () => {
          ctx.fillStyle = "#1e293b";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, 44 * u);
          ctx.fill();
        });
        place(ctx, pad + bezel, pad + bezel, 28 * u);
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.roundRect(pad + bezel + w * 0.36, pad + bezel + 12 * u, w * 0.28, 26 * u, 13 * u);
        ctx.fill();
        return canvas;
      }
      case "ipad": {
        const bezel = 30 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#cbd5e1", "#94a3b8");
        lift(ctx, 36, 18, 0.4, () => {
          ctx.fillStyle = "#111827";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, 36 * u);
          ctx.fill();
        });
        place(ctx, pad + bezel, pad + bezel, 14 * u);
        ctx.fillStyle = "#374151";
        ctx.beginPath();
        ctx.arc(pad + bezel + w / 2, pad + bezel / 2, 4 * u, 0, Math.PI * 2);
        ctx.fill();
        return canvas;
      }
      case "circular": {
        const border = 16 * u;
        const diameter = Math.max(w, h);
        const size = diameter + border * 2 + pad * 2;
        const { canvas, ctx } = stage(size, size, "#3b82f6", "#1d4ed8");
        
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = diameter / 2;

        // Drop shadow lift
        lift(ctx, 35, 18, 0.4, () => {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius + border, 0, Math.PI * 2);
          ctx.fill();
        });

        // Outer circular border/bezel
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + border, 0, Math.PI * 2);
        ctx.fill();

        // Clip and place content into a circular viewport
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();
        
        // Place content centered within the circle
        place(ctx, centerX - w / 2, centerY - h / 2, 0);
        ctx.restore();

        return canvas;
      }
      case "aqua": {
        const bezel = 22 * u;
        const r = 16 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#06b6d4", "#14b8a6");
        lift(ctx, 35, 18, 0.4, () => {
          ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, r + bezel);
          ctx.fill();
        });
        ctx.fillStyle = "rgba(14, 165, 233, 0.5)";
        ctx.beginPath();
        ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, r + bezel);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(pad + bezel, pad + bezel, w, h, r);
        ctx.fill();
        place(ctx, pad + bezel, pad + bezel, r);
        return canvas;
      }
      case "sand": {
        const bezel = 24 * u;
        const r = 14 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#fde047", "#ca8a04");
        lift(ctx, 30, 15, 0.35, () => {
          ctx.fillStyle = "#fef3c7";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, r + bezel);
          ctx.fill();
        });
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.roundRect(pad + bezel * 0.5, pad + bezel * 0.5, w + bezel, h + bezel, r);
        ctx.fill();
        ctx.fillStyle = "#fffbeb";
        ctx.beginPath();
        ctx.roundRect(pad + bezel, pad + bezel, w, h, r);
        ctx.fill();
        place(ctx, pad + bezel, pad + bezel, r);
        return canvas;
      }
      case "marine": {
        const bezel = 20 * u;
        const r = 18 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#0369a1", "#0c4a6e");
        lift(ctx, 40, 20, 0.5, () => {
          ctx.fillStyle = "#0284c7";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, r + bezel);
          ctx.fill();
        });
        ctx.fillStyle = "#075985";
        ctx.beginPath();
        ctx.roundRect(pad + bezel, pad + bezel, w, h, r);
        ctx.fill();
        place(ctx, pad + bezel, pad + bezel, r);
        return canvas;
      }
      case "space": {
        const bezel = 24 * u;
        const r = 20 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#4c1d95", "#0f172a");
        lift(ctx, 45, 22, 0.55, () => {
          ctx.fillStyle = "#1e1b4b";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, r + bezel);
          ctx.fill();
        });
        // Sprinkle a few star dots in the bezel
        ctx.fillStyle = "#facc15";
        [[10, 15], [85, 20], [15, 80], [90, 85]].forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(pad + (w + bezel * 2) * (px / 100), pad + (h + bezel * 2) * (py / 100), 2 * u, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = "#09090b";
        ctx.beginPath();
        ctx.roundRect(pad + bezel, pad + bezel, w, h, r);
        ctx.fill();
        place(ctx, pad + bezel, pad + bezel, r);
        return canvas;
      }
      case "mars": {
        const bezel = 22 * u;
        const r = 12 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#ea580c", "#7c2d12");
        lift(ctx, 35, 18, 0.45, () => {
          ctx.fillStyle = "#9a3412";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, r + bezel);
          ctx.fill();
        });
        ctx.fillStyle = "#c2410c";
        ctx.beginPath();
        ctx.roundRect(pad + bezel, pad + bezel, w, h, r);
        ctx.fill();
        place(ctx, pad + bezel, pad + bezel, r);
        return canvas;
      }
      case "macbook": {
        const top = 36 * u;
        const side = 72 * u;
        const baseH = 30 * u;
        const { canvas, ctx } = stage(w + side * 2 + pad * 2, pad + top + h + 12 * u + baseH + pad, "#1e1b4b", "#312e81");
        const x = pad + side;
        const y = pad + top;
        lift(ctx, 35, 15, 0.4, () => {
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.roundRect(x - 12 * u, y - 12 * u, w + 24 * u, h + 24 * u, 12 * u);
          ctx.fill();
        });
        place(ctx, x, y);
        ctx.fillStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.roundRect(x - 60 * u, y + h + 12 * u, w + 120 * u, baseH, [0, 0, 8 * u, 8 * u]);
        ctx.fill();
        return canvas;
      }
      case "polaroid": {
        const edge = 28 * u;
        const bottom = 100 * u;
        const { canvas, ctx } = stage(w + edge * 2 + pad * 2, h + edge + bottom + pad * 2, "#e7e5e4", "#d6d3d1");
        lift(ctx, 28, 12, 0.3, () => {
          ctx.fillStyle = "#fafaf9";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + edge * 2, h + edge + bottom, 4 * u);
          ctx.fill();
        });
        place(ctx, pad + edge, pad + edge);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = u;
        ctx.strokeRect(pad + edge, pad + edge, w, h);
        return canvas;
      }
      case "gallery": {
        const wood = 28 * u;
        const mat = 40 * u;
        const frameW = w + (wood + mat) * 2;
        const frameH = h + (wood + mat) * 2;
        const { canvas, ctx } = stage(frameW + pad * 2, frameH + pad * 2, "#f5f5f4", "#e7e5e4");
        lift(ctx, 30, 14, 0.4, () => {
          const grain = ctx.createLinearGradient(pad, pad, pad + frameW, pad + frameH);
          grain.addColorStop(0, "#a16207");
          grain.addColorStop(1, "#713f12");
          ctx.fillStyle = grain;
          ctx.fillRect(pad, pad, frameW, frameH);
        });
        ctx.fillStyle = "#fafaf9";
        ctx.fillRect(pad + wood, pad + wood, frameW - wood * 2, frameH - wood * 2);
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 2 * u;
        ctx.strokeRect(pad + wood, pad + wood, frameW - wood * 2, frameH - wood * 2);
        place(ctx, pad + wood + mat, pad + wood + mat);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
        ctx.strokeRect(pad + wood + mat, pad + wood + mat, w, h);
        return canvas;
      }
      case "film": {
        const side = 64 * u;
        const edge = 22 * u;
        const stripW = w + side * 2;
        const stripH = h + edge * 2;
        const { canvas, ctx } = stage(stripW + pad * 2, stripH + pad * 2, "#27272a", "#18181b");
        lift(ctx, 24, 10, 0.5, () => {
          ctx.fillStyle = "#0a0a0a";
          ctx.fillRect(pad, pad, stripW, stripH);
        });
        const holeW = 22 * u;
        const holeH = 30 * u;
        ctx.fillStyle = "#e5e7eb";
        for (let y = pad + 16 * u; y + holeH <= pad + stripH - 8 * u; y += 52 * u) {
          ctx.beginPath();
          ctx.roundRect(pad + (side - holeW) / 2, y, holeW, holeH, 5 * u);
          ctx.roundRect(pad + side + w + (side - holeW) / 2, y, holeW, holeH, 5 * u);
          ctx.fill();
        }
        place(ctx, pad + side, pad + edge);
        return canvas;
      }
      case "forest": {
        const m = pad + 24 * u;
        const { canvas, ctx } = stage(w + m * 2, h + m * 2, "#0b2e0b", "#1a2e1a");
        place(ctx, m, m);
        const glow = (color: string, inset: number, width: number, blur: number) => {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = width * u;
          ctx.shadowColor = color;
          ctx.shadowBlur = blur * u;
          ctx.strokeRect(m - inset * u, m - inset * u, w + inset * 2 * u, h + inset * 2 * u);
          ctx.restore();
        };
        glow("#22c55e", 8, 5, 30);
        glow("#16a34a", 18, 3, 24);
        return canvas;
      }
      case "glossy": {
        const m = pad + 24 * u;
        const { canvas, ctx } = stage(w + m * 2, h + m * 2, "#1a1a1a", "#333333");
        place(ctx, m, m);
        const glow = (color: string, inset: number, width: number, blur: number) => {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = width * u;
          ctx.shadowColor = color;
          ctx.shadowBlur = blur * u;
          ctx.strokeRect(m - inset * u, m - inset * u, w + inset * 2 * u, h + inset * 2 * u);
          ctx.restore();
        };
        glow("#ffffff", 8, 5, 30);
        glow("#cccccc", 18, 3, 24);
        return canvas;
      }
      case "neon": {
        const m = pad + 24 * u;
        const { canvas, ctx } = stage(w + m * 2, h + m * 2, "#0b1020", "#1a0b2e");
        place(ctx, m, m);
        const glow = (color: string, inset: number, width: number, blur: number) => {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = width * u;
          ctx.shadowColor = color;
          ctx.shadowBlur = blur * u;
          ctx.strokeRect(m - inset * u, m - inset * u, w + inset * 2 * u, h + inset * 2 * u);
          ctx.restore();
        };
        glow("#22d3ee", 8, 5, 30);
        glow("#e879f9", 18, 3, 24);
        return canvas;
      }
      default: {
        const { canvas, ctx } = stage(w + pad * 2, h + pad * 2, "#ffffff");
        lift(ctx, 16, 6, 0.2, () => {
          ctx.drawImage(src, pad, pad);
        });
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = u;
        ctx.strokeRect(pad, pad, w, h);
        return canvas;
      }
    }
  };

  const generateCollageBlob = async () => {
    if (images.length === 0) return;

    // Load all images as Bitmaps
    const bitmaps = await Promise.all(images.map((img) => createImageBitmap(img.file)));
    
    // Determine grid dimensions
    const cols = Math.min(collageCols, bitmaps.length);
    const rows = Math.ceil(bitmaps.length / cols);

    // Assume uniform cell sizing based on the first image or max bounds
    const sampleW = bitmaps[0].width;
    const sampleH = bitmaps[0].height;
    const cellW = Math.round(sampleW / (cols > 1 ? 1.2 : 1));
    const cellH = Math.round(sampleH / (cols > 1 ? 1.2 : 1));

    const totalW = collagePadding * 2 + cols * cellW + (cols - 1) * collageGap;
    const totalH = collagePadding * 2 + rows * cellH + (rows - 1) * collageGap;

    const canvas = document.createElement("canvas");
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not available");

    // Fill background
    ctx.fillStyle = collageBgColor;
    ctx.fillRect(0, 0, totalW, totalH);

    // Draw each image into its grid slot
    bitmaps.forEach((bmp, index) => {
      const r = Math.floor(index / cols);
      const c = index % cols;
      const x = collagePadding + c * (cellW + collageGap);
      const y = collagePadding + r * (cellH + collageGap);

      // Draw rounded card container for each photo
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.roundRect(x, y, cellW, cellH, 12);
      ctx.fill();
      ctx.clip();

      // Cover fit inside cell
      const ratio = Math.max(cellW / bmp.width, cellH / bmp.height);
      const dw = bmp.width * ratio;
      const dh = bmp.height * ratio;
      const dx = x + (cellW - dw) / 2;
      const dy = y + (cellH - dh) / 2;

      ctx.drawImage(bmp, dx, dy, dw, dh);
      ctx.restore();
      bmp.close();
    });

    const quality = (100 - reduction) / 100;
    const blob = await canvasToBlob(canvas, MIME[format as RasterFormat] || "image/jpeg", quality);
    const originalBytes = images.reduce((total, item) => total + item.file.size, 0);
    const fileName = `${sanitize(prefix)}photo_collage.${extensionFor(blob.type)}`;

    downloadBlob(blob, fileName);
    summary = { count: 1, originalBytes, outputBytes: blob.size, fileName };
  };

  const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
    new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Image encoding failed."))), type, quality),
    );

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const pickFilterCss = () => {
    if (!applyFilter) return "none";
    if (feelingLucky) return allCanvasFilters[Math.floor(Math.random() * allCanvasFilters.length)].css;
    return allCanvasFilters.find((filter) => filter.id === selectedFilterId)?.css ?? "none";
  };

  const exportImages = async (queue: QueuedImage[], quality: number, originalBytes: number) => {
    const used = new Set<string>();
    const outputs: { name: string; blob: Blob }[] = [];

    for (const [index, item] of queue.entries()) {
      const bitmap = await createImageBitmap(item.file);
      const canvas = processCanvas(bitmap, pickFilterCss());
      bitmap.close();
      const blob =
        format === "svg"
          ? await traceToSvg(canvas)
          : await canvasToBlob(canvas, MIME[format as RasterFormat], quality);

      outputs.push({ name: makeName(index, item.file, extensionFor(blob.type), used), blob });
      progress = Math.round(((index + 1) / queue.length) * 100);
    }

    const outputBytes = outputs.reduce((total, output) => total + output.blob.size, 0);
    if (outputs.length === 1) {
      downloadBlob(outputs[0].blob, outputs[0].name);
      summary = { count: 1, originalBytes, outputBytes, fileName: outputs[0].name };
      return;
    }

    const zip = new JSZip();
    outputs.forEach((output) => zip.file(output.name, output.blob));
    const zipName = `${sanitize(prefix)}processed_images.zip`;
    downloadBlob(await zip.generateAsync({ type: "blob" }), zipName);
    summary = { count: outputs.length, originalBytes, outputBytes, fileName: zipName };
  };

  const exportPdf = async (queue: QueuedImage[], quality: number, originalBytes: number) => {
    const { jsPDF } = await import("jspdf");
    let pdf: InstanceType<typeof jsPDF> | null = null;

    for (const [index, item] of queue.entries()) {
      const bitmap = await createImageBitmap(item.file);
      const canvas = processCanvas(bitmap, pickFilterCss());
      bitmap.close();
      const { width, height } = canvas;
      const orientation = width >= height ? "landscape" : "portrait";
      const dataUrl = canvas.toDataURL("image/jpeg", quality);

      if (!pdf) pdf = new jsPDF({ orientation, unit: "px", format: [width, height], compress: true });
      else pdf.addPage([width, height], orientation);
      pdf.addImage(dataUrl, "JPEG", 0, 0, width, height, undefined, "FAST");
      progress = Math.round(((index + 1) / queue.length) * 100);
    }

    if (!pdf) return;
    const blob = pdf.output("blob");
    const fileName = `${sanitize(prefix)}images.pdf`;
    downloadBlob(blob, fileName);
    summary = { count: queue.length, originalBytes, outputBytes: blob.size, fileName };
  };

  const processAll = async () => {
    if (images.length === 0 || isProcessing) return;
    isProcessing = true;
    progress = 0;
    errorMessage = "";
    summary = null;

    const queue = [...images];
    const quality = (100 - reduction) / 100;
    const originalBytes = queue.reduce((total, item) => total + item.file.size, 0);

    try {
      if (format === "pdf") await exportPdf(queue, quality, originalBytes);
      else await exportImages(queue, quality, originalBytes);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Processing failed.";
    } finally {
      isProcessing = false;
    }
  };

  onDestroy(() => images.forEach((image) => URL.revokeObjectURL(image.previewUrl)));
</script>

<div class="space-y-6">
  <!-- Dropzone -->
  <div
    role="presentation"
    ondragenter={(event) => { event.preventDefault(); isDragging = true; }}
    ondragover={(event) => event.preventDefault()}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    class="rounded-3xl border-2 border-dashed p-8 text-center shadow-sm transition {isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white'}"
  >
    <Icon icon="mdi:image-multiple-outline" class="mx-auto h-14 w-14 text-gray-400" />
    <p class="mt-2 text-base font-bold text-dark">Drag & drop multiple images here</p>
    <p class="font-mono text-xs text-gray-400">Up to {MAX_FILE_MB} MB per image</p>
    <label class="mt-3 inline-block cursor-pointer rounded-xl bg-primary px-8 py-3 text-xs font-semibold text-light shadow transition hover:bg-primary-dark">
      Select Images
      <input type="file" multiple accept="image/*" onchange={handleFileInput} class="hidden" />
    </label>
  </div>

  {#if errorMessage}
    <p role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">{errorMessage}</p>
  {/if}

  {#if images.length > 0}
    <!-- Preview Grid -->
    <section class="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-dark">
          {images.length} image{images.length === 1 ? "" : "s"} selected
          <span class="font-mono text-xs font-normal text-gray-500">({formatBytes(images.reduce((total, image) => total + image.file.size, 0))})</span>
        </h3>
        <button type="button" onclick={clearImages} class="cursor-pointer text-xs font-semibold text-red-500 hover:underline">Clear all</button>
      </div>
      <ul class="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4 md:grid-cols-6">
        {#each images as image (image.id)}
          <li class="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <img src={image.previewUrl} alt={image.file.name} class="aspect-square w-full object-cover" />
            <button
              type="button"
              onclick={() => removeImage(image.id)}
              aria-label="Remove {image.file.name}"
              class="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Icon icon="mdi:close" class="text-sm" />
            </button>
            <p class="truncate px-2 py-1 text-[10px] text-gray-600" title={image.file.name}>{image.file.name}</p>
            <p class="px-2 pb-1 font-mono text-[10px] text-gray-400">{formatBytes(image.file.size)}</p>
          </li>
        {/each}
      </ul>
    </section>

    <!-- Controls Panel -->
    <section class="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-xs shadow-xs md:grid-cols-2">
      <!-- Compression & Format -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <h4 class="font-bold text-dark">Export & Quality</h4>
        <div class="space-y-1">
          <label for="bulk-reduction" class="block font-semibold text-gray-700">Quality reduction: {reduction}%</label>
          <input id="bulk-reduction" type="range" min="0" max="95" bind:value={reduction} disabled={format === "svg"} class="w-full cursor-pointer accent-primary disabled:opacity-50" />
        </div>
        {#if format === "svg"}
          <div class="space-y-1">
            <label for="svg-colors" class="block font-semibold text-gray-700">SVG colors: {svgColors}</label>
            <input id="svg-colors" type="range" min="2" max="64" bind:value={svgColors} class="w-full cursor-pointer accent-primary" />
            <p class="text-[11px] text-gray-500">Photos are traced into vector shapes, so more colors means more detail and larger files.</p>
          </div>
        {/if}
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="bulk-format" class="block font-semibold text-gray-700">Format</label>
            <select id="bulk-format" bind:value={format} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark">
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
              <option value="png">PNG</option>
              <option value="pdf">PDF</option>
              <option value="svg">SVG (traced vector)</option>
            </select>
          </div>
          <div>
            <label for="bulk-naming" class="block font-semibold text-gray-700">Naming</label>
            <select id="bulk-naming" bind:value={naming} disabled={format === "pdf"} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark disabled:opacity-50">
              <option value="numeric">Numbers</option>
              <option value="alpha">Letters</option>
              <option value="random">Random</option>
              <option value="original">Original</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Smart Resizing -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <h4 class="font-bold text-dark">Smart Resizing</h4>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="resize-mode" class="block font-semibold text-gray-700">Mode</label>
            <select id="resize-mode" bind:value={resizeMode} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark">
              <option value="none">Original Size</option>
              <option value="fit">Fit Within Bounds</option>
              <option value="fill">Fill Canvas (Pad)</option>
              <option value="exact">Exact Stretch</option>
            </select>
          </div>
          {#if resizeMode !== "none"}
            <div>
              <label for="pad-color" class="block font-semibold text-gray-700">Padding Color</label>
              <input id="pad-color" type="color" bind:value={padColor} class="h-9 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-1" />
            </div>
          {/if}
        </div>
        {#if resizeMode !== "none"}
          <div class="grid grid-cols-2 gap-2">
            <input type="number" bind:value={targetWidth} placeholder="Max Width (px)" class="rounded-xl border border-gray-200 bg-white p-2" />
            <input type="number" bind:value={targetHeight} placeholder="Max Height (px)" class="rounded-xl border border-gray-200 bg-white p-2" />
          </div>
        {/if}
      </div>

      <!-- Filter Selection & Search -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-dark">Preset Filters</h4>
          <label class="flex cursor-pointer items-center gap-1.5 font-semibold text-dark">
            <input type="checkbox" bind:checked={applyFilter} class="rounded accent-primary" />
            Apply a filter
          </label>
        </div>

        {#if applyFilter}
          <label class="flex w-fit cursor-pointer items-center gap-1.5 font-semibold text-primary">
            <input type="checkbox" bind:checked={feelingLucky} class="rounded accent-primary" />
            🎲 I'm Feeling Lucky
          </label>

          {#if !feelingLucky}
            <div class="space-y-2">
              <input
                type="text"
                bind:value={filterSearchQuery}
                placeholder="🔍 Search filters..."
                class="w-full rounded-xl border border-gray-200 bg-white p-2 text-dark"
              />
              <select bind:value={selectedFilterId} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark">
                {#each filteredCategories as category}
                  <optgroup label={category.name}>
                    {#each category.filters as filter}
                      <option value={filter.id}>{filter.name}</option>
                    {/each}
                  </optgroup>
                {/each}
              </select>
            </div>
          {:else}
            <p class="rounded-xl border border-primary/30 bg-primary/5 p-3 text-center text-primary font-medium">
              ✨ Random canvas filters will be applied to each image automatically upon export!
            </p>
          {/if}
        {/if}
      </div>

      <!-- Frames -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-dark">Frames</h4>
          <label class="flex cursor-pointer items-center gap-1.5 font-semibold text-dark">
            <input type="checkbox" bind:checked={addFrame} class="rounded accent-primary" />
            Add a frame
          </label>
        </div>
        {#if addFrame}
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="frame-style" class="block font-semibold text-gray-700">Style</label>
              <select id="frame-style" bind:value={frameStyle} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark">
                {#each FRAME_OPTIONS as option}
                  <option value={option.id}>{option.label}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="frame-pad" class="block font-semibold text-gray-700">Margin: {framePadding}</label>
              <input id="frame-pad" type="range" min="8" max="100" bind:value={framePadding} class="w-full cursor-pointer accent-primary" />
            </div>
          </div>
          <p class="text-[11px] text-gray-500">Applied after resizing, filter and watermark, and works with every output format.</p>
        {/if}
      </div>

      <!-- Watermarking & Adjustments -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <h4 class="font-bold text-dark">Watermark & Adjustments</h4>
        <input type="text" bind:value={watermarkText} placeholder="© Watermark text (optional)" class="w-full rounded-xl border border-gray-200 bg-white p-2" />
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <span class="text-gray-500">Brightness: {brightness}%</span>
            <input type="range" min="50" max="150" bind:value={brightness} class="w-full accent-primary" />
          </div>
          <div class="space-y-1">
            <span class="text-gray-500">Contrast: {contrast}%</span>
            <input type="range" min="50" max="150" bind:value={contrast} class="w-full accent-primary" />
          </div>
        </div>
      </div>
    </section>

    <div class="space-y-6">

    {#if images.length > 0}
        <!-- Mode Switcher Tabs -->
        <div class="flex rounded-xl bg-gray-100 p-1 border border-gray-200">
            <button
                type="button"
                onclick={() => appMode = "bulk"}
                class="flex-1 rounded-lg py-2 text-xs font-bold transition {appMode === 'bulk' ? 'bg-white text-dark shadow-xs' : 'text-gray-500 hover:text-dark'}"
            >
                ⚡ Bulk Processor ({images.length} images)
            </button>
            <button
                type="button"
                onclick={() => appMode = "collage"}
                class="flex-1 rounded-lg py-2 text-xs font-bold transition {appMode === 'collage' ? 'bg-white text-dark shadow-xs' : 'text-gray-500 hover:text-dark'}"
            >
                🖼️ Grid Collage Maker
            </button>
        </div>

        {#if appMode === "collage"}
        <!-- Collage Options Panel -->
        <section class="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 text-xs shadow-xs">
            <h4 class="font-bold text-dark text-sm">Collage Layout Settings</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                    <label for="collage-cols" class="block font-semibold text-gray-700">Columns: {collageCols}</label>
                    <input id="collage-cols" type="range" min="1" max="5" bind:value={collageCols} class="w-full cursor-pointer accent-primary" />
                </div>
                <div>
                    <label for="collage-gap" class="block font-semibold text-gray-700">Grid Gap: {collageGap}px</label>
                    <input id="collage-gap" type="range" min="0" max="48" bind:value={collageGap} class="w-full cursor-pointer accent-primary" />
                </div>
                <div>
                    <label for="collage-pad" class="block font-semibold text-gray-700">Padding: {collagePadding}px</label>
                    <input id="collage-pad" type="range" min="0" max="64" bind:value={collagePadding} class="w-full cursor-pointer accent-primary" />
                </div>
                <div>
                    <label for="collage-bg" class="block font-semibold text-gray-700">Background</label>
                    <input id="collage-bg" type="color" bind:value={collageBgColor} class="h-9 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-1" />
                </div>
            </div>

            <!-- Live Collage Preview Container -->
            <div class="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4">
            {#if collagePreviewUrl}
                <img src={collagePreviewUrl} alt="Collage Live Preview" class="max-h-80 w-auto rounded-lg shadow-md object-contain" />
            {:else}
                <div class="flex flex-col items-center gap-2 text-gray-400">
                <Icon icon="mdi:loading" class="animate-spin text-2xl" />
                <span>Rendering live preview...</span>
                </div>
            {/if}
            </div>

            <button
            type="button"
            onclick={generateCollageBlob}
            disabled={isProcessing}
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-light shadow transition hover:bg-primary-dark disabled:opacity-60"
            >
            <Icon icon="mdi:collage" class="text-base" />
            Generate & Download Collage
            </button>
        </section>
         
        {:else}
      <!-- Your existing Bulk Control Sections here -->
        {/if}
    {/if}
    </div>

    <!-- Action Section -->
    <div class="space-y-3">
      <button
        type="button"
        onclick={processAll}
        disabled={isProcessing}
        class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-light shadow transition hover:bg-primary-dark disabled:opacity-60"
      >
        <Icon icon={isProcessing ? "mdi:loading" : "mdi:folder-zip-outline"} class={isProcessing ? "animate-spin text-base" : "text-base"} />
        {isProcessing ? `Processing ${progress}%` : format === "pdf" ? "Combine into PDF & Download" : "Process & Download All"}
      </button>

      {#if isProcessing}
        <div class="h-2 overflow-hidden rounded-full bg-gray-200">
          <div class="h-full bg-primary transition-all" style="width: {progress}%"></div>
        </div>
      {/if}

      {#if summary}
        {@const change = summary.originalBytes > 0 ? Math.round((1 - summary.outputBytes / summary.originalBytes) * 100) : 0}
        <p class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          Saved <strong>{summary.fileName}</strong> ({summary.count} image{summary.count === 1 ? "" : "s"}):
          {formatBytes(summary.originalBytes)} → {formatBytes(summary.outputBytes)}
          ({Math.abs(change)}% {change >= 0 ? "smaller" : "larger"})
        </p>
      {/if}
    </div>
  {/if}
</div>