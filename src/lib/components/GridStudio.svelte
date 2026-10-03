<script lang="ts">
  import Icon from "@iconify/svelte";
  import JSZip from "jszip";
  import saveAs from "file-saver";
  import { fade, scale } from "svelte/transition";

  let {
    rawImageObj,
    originalImageSrc,
    onSelectTile,
  }: {
    rawImageObj: HTMLImageElement | null;
    originalImageSrc: string;
    onSelectTile?: (tileDataUrl: string, label: string) => void;
  } = $props();

  let gridMode = $state<"overlay" | "tiles">("overlay");
  let rows = $state(4);
  let cols = $state(4);
  let gridColor = $state("rgba(0, 0, 0, 0.5)");
  let gridLineStyle = $state<"dashed" | "solid">("dashed");
  let showDiagonals = $state(true);
  let showRuleOfThirds = $state(false);
  let showGoldenSpiral = $state(false);
  let isGrayscale = $state(false);
  let isFlipped = $state(false);
  let showCoordinates = $state(true);

  // Side-by-Side Split View
  let isSplitView = $state(false);

  // Workspace Brightness & Contrast Sub-Adjustments
  let gridBrightness = $state(100);
  let gridContrast = $state(100);

  // Single Tile Zoom & Edit Modal State
  let isTileModalOpen = $state(false);
  let activeTileIndex = $state<number | null>(null);
  let activeTileDataUrl = $state<string>("");
  let tileBrightness = $state(100);
  let tileContrast = $state(100);

  // Aspect Ratio & Cropping State
  let aspectRatio = $state<"free" | "1:1" | "4:3" | "16:9" | "golden">("free");
  let croppedImageObj = $state<HTMLImageElement | null>(null);
  let croppedImageSrc = $state("");

  // Frame States
  let selectedFrame = $state<
    "none" | "fire" | "smoke" | "golden" | "neon" | "mosaic" | "square"
  >("none");
  let frameThickness = $state(25);

  let gridPieces = $state<string[]>([]);

  let imageContainerRef = $state<HTMLDivElement | null>(null);
  let isLineToolActive = $state(false);
  let tempLineStart = $state<{ x: number; y: number } | null>(null);
  let customLines = $state<
    Array<{ x1: number; y1: number; x2: number; y2: number }>
  >([]);

  const colLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
  ];

  const updateCroppedImage = () => {
    if (!rawImageObj) return;

    if (aspectRatio === "free") {
      croppedImageObj = rawImageObj;
      croppedImageSrc = originalImageSrc;
      return;
    }

    const srcW = rawImageObj.width;
    const srcH = rawImageObj.height;
    let targetRatio = 1;

    if (aspectRatio === "1:1") targetRatio = 1;
    else if (aspectRatio === "4:3") targetRatio = 4 / 3;
    else if (aspectRatio === "16:9") targetRatio = 16 / 9;
    else if (aspectRatio === "golden") targetRatio = 1.618;

    let cropW = srcW;
    let cropH = srcH;

    if (srcW / srcH > targetRatio) {
      cropW = srcH * targetRatio;
    } else {
      cropH = srcW / targetRatio;
    }

    const startX = (srcW - cropW) / 2;
    const startY = (srcH - cropH) / 2;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = cropW;
    canvas.height = cropH;

    ctx.drawImage(
      rawImageObj,
      startX,
      startY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH,
    );

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    croppedImageSrc = dataUrl;

    const img = new Image();
    img.onload = () => {
      croppedImageObj = img;
    };
    img.src = dataUrl;
  };

  const splitImage = () => {
    if (!croppedImageObj) return;
    const pieces: string[] = [];
    const tileWidth = croppedImageObj.width / cols;
    const tileHeight = croppedImageObj.height / rows;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = tileWidth;
    canvas.height = tileHeight;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.clearRect(0, 0, tileWidth, tileHeight);
        ctx.drawImage(
          croppedImageObj,
          c * tileWidth,
          r * tileHeight,
          tileWidth,
          tileHeight,
          0,
          0,
          tileWidth,
          tileHeight,
        );
        pieces.push(canvas.toDataURL("image/jpeg", 0.95));
      }
    }
    gridPieces = pieces;
  };

  const openTileModal = (index: number) => {
    activeTileIndex = index;
    activeTileDataUrl = gridPieces[index];
    tileBrightness = 100;
    tileContrast = 100;
    isTileModalOpen = true;
  };

  const handleImageClick = (e: MouseEvent) => {
    if (!isLineToolActive || !imageContainerRef) return;
    const imgEl = imageContainerRef.querySelector("img");
    if (!imgEl) return;
    const imgRect = imgEl.getBoundingClientRect();

    if (
      e.clientX < imgRect.left ||
      e.clientX > imgRect.right ||
      e.clientY < imgRect.top ||
      e.clientY > imgRect.bottom
    )
      return;

    let x = ((e.clientX - imgRect.left) / imgRect.width) * 100;
    if (isFlipped) x = 100 - x;
    const y = ((e.clientY - imgRect.top) / imgRect.height) * 100;

    if (!tempLineStart) {
      tempLineStart = { x, y };
    } else {
      customLines = [
        ...customLines,
        { x1: tempLineStart.x, y1: tempLineStart.y, x2: x, y2: y },
      ];
      tempLineStart = null;
    }
  };

  const downloadSingleTile = (
    pieceDataUrl: string,
    index: number,
    customB = 100,
    customC = 100,
  ) => {
    const colLabel = colLetters[index % cols];
    const rowLabel = Math.floor(index / cols) + 1;

    if (customB === 100 && customC === 100) {
      const link = document.createElement("a");
      link.download = `tile_${colLabel}${rowLabel}.jpg`;
      link.href = pieceDataUrl;
      link.click();
      return;
    }

    // Render with custom tile adjustments if edited in modal
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = `brightness(${customB}%) contrast(${customC}%)`;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `tile_${colLabel}${rowLabel}_edited.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    };
    img.src = pieceDataUrl;
  };

  const downloadGridWithOverlay = () => {
    if (!croppedImageObj) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = croppedImageObj.width;
    canvas.height = croppedImageObj.height;

    ctx.save();
    if (isFlipped) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.filter = `brightness(${gridBrightness}%) contrast(${gridContrast}%)`;
    ctx.drawImage(croppedImageObj, 0, 0);
    ctx.restore();

    if (selectedFrame === "mosaic") {
      const tileSize = Math.max(10, Math.floor(croppedImageObj.width / 40));
      const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
      for (let x = 0; x < croppedImageObj.width; x += tileSize) {
        for (let t = 0; t < frameThickness; t += tileSize) {
          ctx.fillStyle =
            colors[
              (Math.floor(x / tileSize) + Math.floor(t / tileSize)) %
                colors.length
            ];
          ctx.fillRect(x, t, tileSize, tileSize);
          ctx.fillRect(
            x,
            croppedImageObj.height - frameThickness + t,
            tileSize,
            tileSize,
          );
        }
      }
      for (let y = 0; y < croppedImageObj.height; y += tileSize) {
        for (let t = 0; t < frameThickness; t += tileSize) {
          ctx.fillStyle =
            colors[
              (Math.floor(y / tileSize) + Math.floor(t / tileSize)) %
                colors.length
            ];
          ctx.fillRect(t, y, tileSize, tileSize);
          ctx.fillRect(
            croppedImageObj.width - frameThickness + t,
            y,
            tileSize,
            tileSize,
          );
        }
      }
    } else if (selectedFrame === "square") {
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 4;
      ctx.strokeRect(
        10,
        10,
        croppedImageObj.width - 20,
        croppedImageObj.height - 20,
      );
      ctx.lineWidth = 2;
      ctx.strokeRect(
        18,
        18,
        croppedImageObj.width - 36,
        croppedImageObj.height - 36,
      );
    } else if (selectedFrame !== "none") {
      ctx.save();
      ctx.lineWidth = frameThickness * (croppedImageObj.width / 600);
      if (selectedFrame === "fire") ctx.strokeStyle = "#ea580c";
      else if (selectedFrame === "smoke") {
        ctx.strokeStyle = "#6b7280";
        ctx.setLineDash([15, 10]);
      } else if (selectedFrame === "golden") ctx.strokeStyle = "#eab308";
      else ctx.strokeStyle = "#3b82f6";

      ctx.strokeRect(
        ctx.lineWidth / 2,
        ctx.lineWidth / 2,
        croppedImageObj.width - ctx.lineWidth,
        croppedImageObj.height - ctx.lineWidth,
      );
      ctx.restore();
    }

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = Math.max(2, Math.floor(croppedImageObj.width / 400));
    if (gridLineStyle === "dashed") ctx.setLineDash([10, 6]);

    const cellW = croppedImageObj.width / cols;
    const cellH = croppedImageObj.height / rows;

    for (let c = 1; c < cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, croppedImageObj.height);
      ctx.stroke();
    }
    for (let r = 1; r < rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(croppedImageObj.width, r * cellH);
      ctx.stroke();
    }

    if (showDiagonals) {
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(croppedImageObj.width, croppedImageObj.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(croppedImageObj.width, 0);
      ctx.lineTo(0, croppedImageObj.height);
      ctx.stroke();
    }

    if (customLines.length > 0) {
      ctx.setLineDash([]);
      ctx.strokeStyle = "#9333ea";
      ctx.lineWidth = Math.max(3, Math.floor(croppedImageObj.width / 350));
      customLines.forEach((line) => {
        const px1 = (line.x1 / 100) * croppedImageObj.width;
        const py1 = (line.y1 / 100) * croppedImageObj.height;
        const px2 = (line.x2 / 100) * croppedImageObj.width;
        const py2 = (line.y2 / 100) * croppedImageObj.height;
        ctx.beginPath();
        ctx.moveTo(px1, py1);
        ctx.lineTo(px2, py2);
        ctx.stroke();
      });
    }

    const link = document.createElement("a");
    link.download = `artist_grid_pro_${rows}x${cols}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  const downloadAllZip = async () => {
    if (gridPieces.length === 0) return;
    const zip = new JSZip();
    const folder = zip.folder("grid_tiles");
    gridPieces.forEach((piece, i) => {
      folder?.file(
        `tile_${colLetters[i % cols]}${Math.floor(i / cols) + 1}.jpg`,
        piece.replace(/^data:image\/(png|jpeg);base64,/, ""),
        { base64: true },
      );
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "image_grid_slices.zip");
  };

  $effect(() => {
    if (rawImageObj) {
      aspectRatio;
      updateCroppedImage();
    }
  });

  $effect(() => {
    if (croppedImageObj) {
      rows;
      cols;
      splitImage();
    }
  });
</script>

<div class="space-y-6">
  <!-- Controls Panel -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs"
  >
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700"
        >Rows: {rows}</label
      >
      <input
        type="range"
        bind:value={rows}
        min="1"
        max="20"
        class="w-full accent-primary cursor-pointer"
      />
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700"
        >Columns: {cols}</label
      >
      <input
        type="range"
        bind:value={cols}
        min="1"
        max="20"
        class="w-full accent-primary cursor-pointer"
      />
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700"
        >Crop Ratio</label
      >
      <select
        bind:value={aspectRatio}
        class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-dark"
      >
        <option value="free">Freeform (Original)</option>
        <option value="1:1">1:1 Square</option>
        <option value="4:3">4:3 Standard</option>
        <option value="16:9">16:9 Widescreen</option>
        <option value="golden">Golden Ratio (1.618)</option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700"
        >Line Color</label
      >
      <select
        bind:value={gridColor}
        class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-dark"
      >
        <option value="rgba(0, 0, 0, 0.5)">Black</option>
        <option value="rgba(255, 255, 255, 0.7)">White</option>
        <option value="rgba(239, 68, 68, 0.7)">Red</option>
        <option value="rgba(59, 130, 246, 0.7)">Blue</option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700"
        >Line Style</label
      >
      <select
        bind:value={gridLineStyle}
        class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-dark"
      >
        <option value="dashed">Dashed Lines</option>
        <option value="solid">Solid Lines</option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700"
        >Photo Frame</label
      >
      <select
        bind:value={selectedFrame}
        class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-dark"
      >
        <option value="none">No Frame</option>
        <option value="mosaic">🧩 Mosaic Tile Frame</option>
        <option value="square">🔲 Double Square Frame</option>
        <option value="fire">🔥 Fire Frame</option>
        <option value="smoke">💨 Smoke Frame</option>
        <option value="golden">✨ Golden Vintage Frame</option>
        <option value="neon">⚡ Neon Glow Frame</option>
      </select>
    </div>
  </div>

  <!-- Workspace Exposure & Contrast Adjustments Bar -->
  <div
    class="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
  >
    <div>
      <div class="flex justify-between font-semibold mb-1 text-gray-700">
        <span>Workspace Brightness: {gridBrightness}%</span>
        {#if gridBrightness !== 100}
          <button
            type="button"
            onclick={() => (gridBrightness = 100)}
            class="text-primary hover:underline">Reset</button
          >
        {/if}
      </div>
      <input
        type="range"
        bind:value={gridBrightness}
        min="50"
        max="180"
        class="w-full accent-primary cursor-pointer"
      />
    </div>
    <div>
      <div class="flex justify-between font-semibold mb-1 text-gray-700">
        <span>Workspace Contrast: {gridContrast}%</span>
        {#if gridContrast !== 100}
          <button
            type="button"
            onclick={() => (gridContrast = 100)}
            class="text-primary hover:underline">Reset</button
          >
        {/if}
      </div>
      <input
        type="range"
        bind:value={gridContrast}
        min="50"
        max="180"
        class="w-full accent-primary cursor-pointer"
      />
    </div>
  </div>

  <!-- Artist Advanced Tools Toolbar -->
  <div
    class="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs"
  >
    <div class="flex flex-wrap items-center gap-4">
      <label
        class="flex items-center gap-1.5 font-medium cursor-pointer text-gray-700"
      >
        <input
          type="checkbox"
          bind:checked={isGrayscale}
          class="rounded accent-primary w-4 h-4"
        />
        <span>Value Study (B&W)</span>
      </label>
      <label
        class="flex items-center gap-1.5 font-medium cursor-pointer text-gray-700"
      >
        <input
          type="checkbox"
          bind:checked={isFlipped}
          class="rounded accent-primary w-4 h-4"
        />
        <span>Mirror View (Flip H)</span>
      </label>
      <label
        class="flex items-center gap-1.5 font-medium cursor-pointer text-gray-700"
      >
        <input
          type="checkbox"
          bind:checked={showCoordinates}
          class="rounded accent-primary w-4 h-4"
        />
        <span>Grid Labels (A1, B2)</span>
      </label>
      <label
        class="flex items-center gap-1.5 font-medium cursor-pointer text-purple-700 font-semibold"
      >
        <input
          type="checkbox"
          bind:checked={isSplitView}
          class="rounded accent-purple-600 w-4 h-4"
        />
        <span>Split View (Side-by-Side)</span>
      </label>
    </div>

    <div class="flex items-center gap-3">
      <span class="font-mono text-gray-500"
        >Total Cells: <strong class="text-dark">{cols * rows}</strong></span
      >
    </div>
  </div>

  <!-- Mode & Export Bar -->
  <div
    class="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs"
  >
    <div class="flex gap-2">
      <button
        type="button"
        onclick={() => (gridMode = "overlay")}
        class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {gridMode ===
        'overlay'
          ? 'bg-primary text-light shadow-sm'
          : 'bg-gray-100 text-dark hover:bg-gray-200'}"
      >
        ✏️ Grid Overlay Mode
      </button>
      <button
        type="button"
        onclick={() => (gridMode = "tiles")}
        class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {gridMode ===
        'tiles'
          ? 'bg-primary text-light shadow-sm'
          : 'bg-gray-100 text-dark hover:bg-gray-200'}"
      >
        📦 Sliced Tiles Mode
      </button>
    </div>

    <div class="flex items-center gap-4 flex-wrap">
      <label
        class="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-gray-700"
      >
        <input
          type="checkbox"
          bind:checked={showDiagonals}
          class="rounded accent-primary w-4 h-4"
        />
        <span>Center Diagonals</span>
      </label>
      <label
        class="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-gray-700"
      >
        <input
          type="checkbox"
          bind:checked={showRuleOfThirds}
          class="rounded accent-primary w-4 h-4"
        />
        <span>Rule of Thirds</span>
      </label>
      <button
        type="button"
        onclick={downloadGridWithOverlay}
        class="bg-primary hover:bg-primary-dark text-light font-semibold py-2 px-4 rounded-xl shadow transition text-xs flex items-center gap-1.5 cursor-pointer"
      >
        <Icon icon="mdi:download" class="text-sm" /> Save Grid & Lines
      </button>
    </div>
  </div>

  <!-- Overlay Mode Workspace (Single or Split View) -->
  {#if gridMode === "overlay"}
    <div
      class="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center"
    >
      <div
        class="w-full max-w-4xl flex justify-between items-center mb-3 bg-gray-50 p-3 rounded-xl border border-gray-200"
      >
        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={() => {
              isLineToolActive = !isLineToolActive;
              tempLineStart = null;
            }}
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer {isLineToolActive
              ? 'bg-purple-600 text-white animate-pulse'
              : 'bg-white text-dark border border-gray-200 hover:bg-gray-100'}"
          >
            📏 Custom Line Tool: {isLineToolActive ? "ON" : "OFF"}
          </button>
          {#if tempLineStart}
            <span class="text-[11px] text-purple-600 font-semibold"
              >Click second point...</span
            >
          {/if}
        </div>
        {#if customLines.length > 0}
          <button
            type="button"
            onclick={() => (customLines = [])}
            class="text-xs text-red-500 font-semibold cursor-pointer"
            >Clear Lines ({customLines.length})</button
          >
        {/if}
      </div>

      <div
        class="w-full grid {isSplitView
          ? 'grid-cols-1 md:grid-cols-2 gap-4'
          : 'flex justify-center'}"
      >
        {#if isSplitView}
          <div
            class="bg-gray-50 rounded-2xl p-3 border border-gray-200 flex flex-col items-center shadow-inner"
          >
            <span
              class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2"
              >Clean Reference Photo</span
            >
            <div
              class="relative w-full flex justify-center bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 p-2"
            >
              <img
                src={croppedImageSrc}
                alt="Clean Reference"
                class="max-h-[460px] w-auto object-contain block transition-all duration-300"
                style="filter: {isGrayscale
                  ? 'grayscale(100%) contrast(125%)'
                  : 'none'} brightness({gridBrightness}%) contrast({gridContrast}%); transform: {isFlipped
                  ? 'scaleX(-1)'
                  : 'scaleX(1)'}"
              />
            </div>
          </div>
        {/if}

        <div
          class="{isSplitView
            ? ''
            : 'max-w-2xl w-full'} flex flex-col items-center"
        >
          {#if isSplitView}
            <span
              class="text-[11px] font-bold text-primary uppercase tracking-wider mb-2"
              >Grid & Annotation View</span
            >
          {/if}

          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="relative w-full flex justify-center bg-gray-100 rounded-2xl overflow-hidden shadow-md border border-gray-200 select-none {isLineToolActive
              ? 'cursor-crosshair'
              : 'cursor-default'}"
            onclick={handleImageClick}
            bind:this={imageContainerRef}
          >
            <img
              src={croppedImageSrc}
              alt="Reference Cropped"
              class="max-h-[460px] w-auto object-contain block pointer-events-none transition-all duration-300"
              style="filter: {isGrayscale
                ? 'grayscale(100%) contrast(125%)'
                : 'none'} brightness({gridBrightness}%) contrast({gridContrast}%); transform: {isFlipped
                ? 'scaleX(-1)'
                : 'scaleX(1)'}"
            />

            <svg class="absolute inset-0 w-full h-full pointer-events-none">
              {#if selectedFrame === "square"}
                <rect
                  x="2%"
                  y="3%"
                  width="96%"
                  height="94%"
                  fill="none"
                  stroke="#1f2937"
                  stroke-width="3"
                />
                <rect
                  x="3.5%"
                  y="5%"
                  width="93%"
                  height="90%"
                  fill="none"
                  stroke="#1f2937"
                  stroke-width="1.5"
                />
              {:else if selectedFrame === "mosaic"}
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="none"
                  stroke="#3b82f6"
                  stroke-width="20"
                  stroke-dasharray="15 5"
                  opacity="0.85"
                />
              {:else if selectedFrame !== "none"}
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="none"
                  stroke={selectedFrame === "fire"
                    ? "#ea580c"
                    : selectedFrame === "smoke"
                      ? "#6b7280"
                      : selectedFrame === "golden"
                        ? "#eab308"
                        : "#3b82f6"}
                  stroke-width={frameThickness / 2}
                  stroke-dasharray={selectedFrame === "smoke"
                    ? "10 10"
                    : "none"}
                  opacity="0.85"
                />
              {/if}

              {#each Array(cols - 1) as _, c}
                <line
                  x1="{((c + 1) / cols) * 100}%"
                  y1="0"
                  x2="{((c + 1) / cols) * 100}%"
                  y2="100%"
                  stroke={gridColor}
                  stroke-width="1.5"
                  stroke-dasharray={gridLineStyle === "dashed" ? "5 3" : "none"}
                />
              {/each}
              {#each Array(rows - 1) as _, r}
                <line
                  x1="0"
                  y1="{((r + 1) / rows) * 100}%"
                  x2="100%"
                  y2="{((r + 1) / rows) * 100}%"
                  stroke={gridColor}
                  stroke-width="1.5"
                  stroke-dasharray={gridLineStyle === "dashed" ? "5 3" : "none"}
                />
              {/each}

              {#if showRuleOfThirds}
                <line
                  x1="33.33%"
                  y1="0"
                  x2="33.33%"
                  y2="100%"
                  stroke="#eab308"
                  stroke-width="1"
                  stroke-dasharray="4 4"
                />
                <line
                  x1="66.66%"
                  y1="0"
                  x2="66.66%"
                  y2="100%"
                  stroke="#eab308"
                  stroke-width="1"
                  stroke-dasharray="4 4"
                />
                <line
                  x1="0"
                  y1="33.33%"
                  x2="100%"
                  y2="33.33%"
                  stroke="#eab308"
                  stroke-width="1"
                  stroke-dasharray="4 4"
                />
                <line
                  x1="0"
                  y1="66.66%"
                  x2="100%"
                  y2="66.66%"
                  stroke="#eab308"
                  stroke-width="1"
                  stroke-dasharray="4 4"
                />
              {/if}

              {#if showDiagonals}
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="100%"
                  stroke={gridColor}
                  stroke-width="1"
                  stroke-dasharray="3 3"
                  opacity="0.7"
                />
                <line
                  x1="100%"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke={gridColor}
                  stroke-width="1"
                  stroke-dasharray="3 3"
                  opacity="0.7"
                />
              {/if}

              {#if showCoordinates}
                {#each Array(rows) as _, r}
                  {#each Array(cols) as __, c}
                    <text
                      x="{(c + 0.05) * (100 / cols)}%"
                      y="{(r + 0.15) * (100 / rows)}%"
                      fill={gridColor}
                      opacity="0.8"
                      font-size="10"
                      font-family="monospace"
                      font-weight="bold"
                    >
                      {colLetters[c] || "X"}{r + 1}
                    </text>
                  {/each}
                {/each}
              {/if}

              {#each customLines as line}
                <line
                  x1="{line.x1}%"
                  y1="{line.y1}%"
                  x2="{line.x2}%"
                  y2="{line.y2}%"
                  stroke="#9333ea"
                  stroke-width="2.5"
                />
              {/each}
              {#if tempLineStart}
                <circle
                  cx="{tempLineStart.x}%"
                  cy="{tempLineStart.y}%"
                  r="5"
                  fill="#9333ea"
                  stroke="#ffffff"
                  stroke-width="2"
                />
              {/if}
            </svg>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Sliced Tiles Mode with Zoom & Edit Modal Trigger -->
    <div
      class="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center"
    >
      <div class="flex justify-between w-full max-w-4xl mb-4 items-center">
        <p class="text-xs font-semibold text-gray-500 uppercase">
          Sliced Tiles ({gridPieces.length}) - Click any tile to zoom & edit
        </p>
        <button
          type="button"
          onclick={downloadAllZip}
          class="bg-emerald-600 hover:bg-emerald-500 text-light text-xs font-semibold py-2 px-4 rounded-xl shadow cursor-pointer flex items-center gap-1.5"
        >
          <Icon icon="mdi:folder-zip-outline" class="text-sm" /> Download All (.zip)
        </button>
      </div>
      <div
        class="grid gap-3 w-full max-w-4xl max-h-[550px] overflow-y-auto p-2"
        style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr))"
      >
        {#each gridPieces as piece, index}
          <div
            class="relative group bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-xs flex flex-col"
          >
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <div
              class="relative aspect-square overflow-hidden bg-gray-200 cursor-pointer"
              onclick={() => openTileModal(index)}
            >
              <img
                src={piece}
                alt="Tile"
                class="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <span
                class="absolute top-1.5 left-1.5 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-mono shadow"
              >
                {colLetters[index % cols]}{Math.floor(index / cols) + 1}
              </span>
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"
              >
                <Icon icon="mdi:magnify-plus-outline" class="text-2xl mb-1" />
                <span
                  class="text-[10px] font-semibold font-mono uppercase tracking-wider"
                  >Zoom & Edit</span
                >
              </div>
            </div>
            <button
              type="button"
              onclick={() => downloadSingleTile(piece, index)}
              class="w-full py-1.5 bg-white hover:bg-gray-100 text-dark text-[11px] font-semibold border-t border-gray-200 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Icon icon="mdi:download-outline" /> Save {colLetters[
                index % cols
              ]}{Math.floor(index / cols) + 1}
            </button>
            <button
              type="button"
              onclick={() =>
                onSelectTile?.(
                  piece,
                  `${colLetters[index % cols]}${Math.floor(index / cols) + 1}`,
                )}
              class="w-full py-1.5 bg-primary hover:bg-primary-dark text-white text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Icon icon="mdi:pencil-box-outline" /> Edit Tile
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<!-- Single Tile Zoom & Edit Modal -->
{#if isTileModalOpen && activeTileIndex !== null}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    transition:fade={{ duration: 200 }}
    onclick={() => (isTileModalOpen = false)}
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      transition:scale={{ duration: 250, start: 0.95 }}
      onclick={(e) => e.stopPropagation()}
      class="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl flex flex-col items-center overflow-hidden"
    >
      <div
        class="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-4"
      >
        <h3 class="font-bold text-sm text-dark flex items-center gap-2">
          <Icon icon="mdi:grid-large" class="text-primary text-lg" />
          Tile Inspection & Edit ({colLetters[
            activeTileIndex % cols
          ]}{Math.floor(activeTileIndex / cols) + 1})
        </h3>
        <button
          type="button"
          onclick={() => (isTileModalOpen = false)}
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
        >
          <Icon icon="mdi:close" class="text-lg" />
        </button>
      </div>

      <!-- Zoomed Tile Preview Canvas / Image -->
      <div
        class="w-full flex items-center justify-center bg-gray-100 rounded-2xl p-4 border border-gray-200 mb-4 shadow-inner max-h-[350px]"
      >
        <img
          src={activeTileDataUrl}
          alt="Zoomed Tile"
          class="max-h-[300px] w-auto object-contain rounded-xl shadow-md transition-all duration-150"
          style="filter: brightness({tileBrightness}%) contrast({tileContrast}%);"
        />
      </div>

      <!-- Individual Tile Adjustments -->
      <div
        class="w-full grid grid-cols-2 gap-3 mb-5 text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-200"
      >
        <div>
          <div class="flex justify-between font-semibold mb-1 text-gray-700">
            <span>Tile Brightness: {tileBrightness}%</span>
            {#if tileBrightness !== 100}
              <button
                type="button"
                onclick={() => (tileBrightness = 100)}
                class="text-primary hover:underline">Reset</button
              >
            {/if}
          </div>
          <input
            type="range"
            bind:value={tileBrightness}
            min="50"
            max="180"
            class="w-full accent-primary cursor-pointer"
          />
        </div>
        <div>
          <div class="flex justify-between font-semibold mb-1 text-gray-700">
            <span>Tile Contrast: {tileContrast}%</span>
            {#if tileContrast !== 100}
              <button
                type="button"
                onclick={() => (tileContrast = 100)}
                class="text-primary hover:underline">Reset</button
              >
            {/if}
          </div>
          <input
            type="range"
            bind:value={tileContrast}
            min="50"
            max="180"
            class="w-full accent-primary cursor-pointer"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="w-full flex gap-3">
        <button
          type="button"
          onclick={() =>
            downloadSingleTile(
              activeTileDataUrl,
              activeTileIndex!,
              tileBrightness,
              tileContrast,
            )}
          class="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl shadow transition text-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Icon icon="mdi:download" class="text-base" /> Save Edited Tile ({colLetters[
            activeTileIndex % cols
          ]}{Math.floor(activeTileIndex / cols) + 1})
        </button>
        <button
          type="button"
          onclick={() => (isTileModalOpen = false)}
          class="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
