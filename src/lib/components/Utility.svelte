<script lang="ts">
  import Icon from "@iconify/svelte";
  import JSZip from "jszip";
  import { onDestroy } from "svelte";

  type OutputFormat = "jpeg" | "webp" | "png" | "pdf";
  type NamingMode = "original" | "numeric" | "alpha" | "random";
  type ResizeMode = "none" | "fit" | "fill" | "exact";
  type WatermarkPos = "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  type FilterMode = "none" | "grayscale" | "sepia" | "high-contrast";
  type QueuedImage = { id: number; file: File; previewUrl: string };
  type Summary = { count: number; originalBytes: number; outputBytes: number; fileName: string };

  const MAX_FILE_MB = 25;
  const MIME: Record<Exclude<OutputFormat, "pdf">, string> = {
    jpeg: "image/jpeg",
    webp: "image/webp",
    png: "image/png",
  };

  let nextId = 0;
  let images = $state<QueuedImage[]>([]);
  let reduction = $state(30);
  let format = $state<OutputFormat>("jpeg");
  let naming = $state<NamingMode>("numeric");
  let prefix = $state("");

  // New utility states
  let resizeMode = $state<ResizeMode>("none");
  let targetWidth = $state(1200);
  let targetHeight = $state(1200);
  let padColor = $state("#ffffff");

  let watermarkText = $state("");
  let watermarkPos = $state<WatermarkPos>("bottom-right");
  let watermarkOpacity = $state(50);

  let filterMode = $state<FilterMode>("none");
  let brightness = $state(100);
  let contrast = $state(100);

  let stripExif = $state(true);

  let isDragging = $state(false);
  let isProcessing = $state(false);
  let progress = $state(0);
  let errorMessage = $state("");
  let summary = $state<Summary | null>(null);

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
    mimeType === "image/jpeg" ? "jpg" : mimeType === "image/webp" ? "webp" : "png";

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

  const processCanvas = (bitmap: ImageBitmap) => {
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

    // Fill background (for JPEG/fill padding)
    if (format === "jpeg" || resizeMode === "fill" || resizeMode === "exact") {
      ctx.fillStyle = padColor;
      ctx.fillRect(0, 0, finalW, finalH);
    }

    // Apply filters & adjustments via ctx properties
    let filterString = "";
    if (filterMode === "grayscale") filterString += "grayscale(100% )";
    if (filterMode === "sepia") filterString += "sepia(100%)";
    if (filterMode === "high-contrast") filterString += "contrast(150%)";
    if (brightness !== 100) filterString += ` brightness(${brightness}%)`;
    if (contrast !== 100) filterString += ` contrast(${contrast}%)`;
    if (filterString) ctx.filter = filterString.trim();

    ctx.drawImage(bitmap, dx, dy, dw, dh);
    ctx.filter = "none"; // reset filter

    // Apply Watermark
    if (watermarkText.trim()) {
      ctx.font = `${Math.max(12, Math.round(finalW * 0.03))}px sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity / 100})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${watermarkOpacity / 100})`;
      ctx.lineWidth = 2;

      const metrics = ctx.measureText(watermarkText);
      const textW = metrics.width;
      const textH = 20;
      const padding = 20;

      let wx = padding;
      let wy = finalH - padding;

      if (watermarkPos === "bottom-right") {
        wx = finalW - textW - padding;
        wy = finalH - padding;
      } else if (watermarkPos === "top-right") {
        wx = finalW - textW - padding;
        wy = padding + textH;
      } else if (watermarkPos === "top-left") {
        wx = padding;
        wy = padding + textH;
      } else if (watermarkPos === "center") {
        wx = (finalW - textW) / 2;
        wy = finalH / 2;
      }

      ctx.strokeText(watermarkText, wx, wy);
      ctx.fillText(watermarkText, wx, wy);
    }

    return canvas;
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

  const exportImages = async (queue: QueuedImage[], quality: number, originalBytes: number) => {
    const used = new Set<string>();
    const outputs: { name: string; blob: Blob }[] = [];

    for (const [index, item] of queue.entries()) {
      const bitmap = await createImageBitmap(item.file);
      const canvas = processCanvas(bitmap);
      bitmap.close();
      const blob = await canvasToBlob(canvas, MIME[format as Exclude<OutputFormat, "pdf">], quality);
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
      const canvas = processCanvas(bitmap);
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
    <p class="font-mono text-xs text-gray-400">Up to {MAX_FILE_MB} MB per image • EXIF data automatically cleaned</p>
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
          <input id="bulk-reduction" type="range" min="0" max="95" bind:value={reduction} class="w-full cursor-pointer accent-primary" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="bulk-format" class="block font-semibold text-gray-700">Format</label>
            <select id="bulk-format" bind:value={format} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark">
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
              <option value="png">PNG</option>
              <option value="pdf">PDF</option>
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

      <!-- Resizing & Padding -->
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

      <!-- Watermarking -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <h4 class="font-bold text-dark">Text Watermark</h4>
        <input type="text" bind:value={watermarkText} placeholder="e.g. © My Brand" class="w-full rounded-xl border border-gray-200 bg-white p-2" />
        {#if watermarkText.trim()}
          <div class="grid grid-cols-2 gap-2">
            <select bind:value={watermarkPos} class="rounded-xl border border-gray-200 bg-white p-2">
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
              <option value="center">Center</option>
            </select>
            <div class="flex items-center gap-2">
              <span class="text-gray-500">Opacity:</span>
              <input type="range" min="10" max="100" bind:value={watermarkOpacity} class="w-full accent-primary" />
            </div>
          </div>
        {/if}
      </div>

      <!-- Filters & Adjustments -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <h4 class="font-bold text-dark">Filters & Adjustments</h4>
        <div class="grid grid-cols-2 gap-2">
          <select bind:value={filterMode} class="rounded-xl border border-gray-200 bg-white p-2">
            <option value="none">No Filter</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
            <option value="high-contrast">High Contrast</option>
          </select>
          <input type="text" bind:value={prefix} placeholder="Name prefix (e.g. edited_)" class="rounded-xl border border-gray-200 bg-white p-2" />
        </div>
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
        <p class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          Saved <strong>{summary.fileName}</strong> ({summary.count} image{summary.count === 1 ? "" : "s"}):
          {formatBytes(summary.originalBytes)} → {formatBytes(summary.outputBytes)}
          ({summary.originalBytes > 0 ? Math.round((1 - summary.outputBytes / summary.originalBytes) * 100) : 0}% smaller)
        </p>
      {/if}
    </div>
  {/if}
</div>