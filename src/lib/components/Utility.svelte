<script lang="ts">
  import Icon from "@iconify/svelte";
  import JSZip from "jszip";
  import { onDestroy } from "svelte";

  type OutputFormat = "jpeg" | "webp" | "png" | "pdf";
  type NamingMode = "original" | "numeric" | "alpha" | "random";
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

  const renderToCanvas = (bitmap: ImageBitmap, opaque: boolean) => {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available in this browser.");
    if (opaque) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0);
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
      const canvas = renderToCanvas(bitmap, format === "jpeg");
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
    const zipName = `${sanitize(prefix)}compressed_images.zip`;
    downloadBlob(await zip.generateAsync({ type: "blob" }), zipName);
    summary = { count: outputs.length, originalBytes, outputBytes, fileName: zipName };
  };

  const exportPdf = async (queue: QueuedImage[], quality: number, originalBytes: number) => {
    const { jsPDF } = await import("jspdf");
    let pdf: InstanceType<typeof jsPDF> | null = null;

    for (const [index, item] of queue.entries()) {
      const bitmap = await createImageBitmap(item.file);
      const canvas = renderToCanvas(bitmap, true);
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

  const compressAll = async () => {
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
      errorMessage = error instanceof Error ? error.message : "Compression failed.";
    } finally {
      isProcessing = false;
    }
  };

  onDestroy(() => images.forEach((image) => URL.revokeObjectURL(image.previewUrl)));
</script>

<div class="space-y-6">
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

    <section class="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-xs shadow-xs md:grid-cols-2">
      <div class="space-y-1">
        <label for="bulk-reduction" class="block font-semibold text-gray-700">
          Quality reduction: {reduction}% <span class="font-normal text-gray-500">(output quality {100 - reduction}%)</span>
        </label>
        <input id="bulk-reduction" type="range" min="0" max="95" bind:value={reduction} class="w-full cursor-pointer accent-primary" />
        {#if format === "png"}
          <p class="text-[11px] text-amber-600">PNG is lossless, so quality reduction has no effect on it.</p>
        {/if}
      </div>

      <div class="space-y-1">
        <label for="bulk-format" class="block font-semibold text-gray-700">Output format</label>
        <select id="bulk-format" bind:value={format} class="w-full rounded-xl border border-gray-200 bg-gray-50 p-2 font-medium text-dark">
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
          <option value="png">PNG</option>
          <option value="pdf">PDF (all images in one file)</option>
        </select>
      </div>

      <div class="space-y-1">
        <label for="bulk-naming" class="block font-semibold text-gray-700">File naming</label>
        <select id="bulk-naming" bind:value={naming} disabled={format === "pdf"} class="w-full rounded-xl border border-gray-200 bg-gray-50 p-2 font-medium text-dark disabled:opacity-50">
          <option value="numeric">Numbers (1, 2, 3...)</option>
          <option value="alpha">Letters (A, B, C...)</option>
          <option value="random">Random names</option>
          <option value="original">Keep original names</option>
        </select>
      </div>

      <div class="space-y-1">
        <label for="bulk-prefix" class="block font-semibold text-gray-700">Name prefix (optional)</label>
        <input id="bulk-prefix" type="text" bind:value={prefix} placeholder="e.g. holiday_" class="w-full rounded-xl border border-gray-200 bg-gray-50 p-2 text-dark" />
      </div>
    </section>

    <div class="space-y-3">
      <button
        type="button"
        onclick={compressAll}
        disabled={isProcessing}
        class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-light shadow transition hover:bg-primary-dark disabled:opacity-60"
      >
        <Icon icon={isProcessing ? "mdi:loading" : "mdi:folder-zip-outline"} class={isProcessing ? "animate-spin text-base" : "text-base"} />
        {isProcessing ? `Processing ${progress}%` : format === "pdf" ? "Combine into PDF & Download" : "Compress & Download"}
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
