<script lang="ts">
  import Icon from "@iconify/svelte";
  import JSZip from "jszip";
  import saveAs from "file-saver";

  let { rawImageObj, originalImageSrc }: { rawImageObj: HTMLImageElement | null; originalImageSrc: string } = $props();

  let gridMode = $state<'overlay' | 'tiles'>('overlay');
  let rows = $state(4);
  let cols = $state(4);
  let gridColor = $state('rgba(0, 0, 0, 0.5)');
  let gridLineStyle = $state<'dashed' | 'solid'>('dashed');
  let showDiagonals = $state(true);
  let gridPieces = $state<string[]>([]);

  let imageContainerRef = $state<HTMLDivElement | null>(null);
  let isLineToolActive = $state(false);
  let tempLineStart = $state<{ x: number; y: number } | null>(null);
  let customLines = $state<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);

  const splitImage = () => {
    if (!rawImageObj) return;
    const pieces: string[] = [];
    const tileWidth = rawImageObj.width / cols;
    const tileHeight = rawImageObj.height / rows;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = tileWidth;
    canvas.height = tileHeight;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.clearRect(0, 0, tileWidth, tileHeight);
        ctx.drawImage(rawImageObj, c * tileWidth, r * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
        pieces.push(canvas.toDataURL('image/jpeg', 0.9));
      }
    }
    gridPieces = pieces;
  };

  const handleImageClick = (e: MouseEvent) => {
    if (!isLineToolActive || !imageContainerRef) return;
    const imgEl = imageContainerRef.querySelector('img');
    if (!imgEl) return;
    const imgRect = imgEl.getBoundingClientRect();

    if (e.clientX < imgRect.left || e.clientX > imgRect.right || e.clientY < imgRect.top || e.clientY > imgRect.bottom) return;

    const x = ((e.clientX - imgRect.left) / imgRect.width) * 100;
    const y = ((e.clientY - imgRect.top) / imgRect.height) * 100;

    if (!tempLineStart) {
      tempLineStart = { x, y };
    } else {
      customLines = [...customLines, { x1: tempLineStart.x, y1: tempLineStart.y, x2: x, y2: y }];
      tempLineStart = null;
    }
  };

  const downloadGridWithOverlay = () => {
    if (!rawImageObj) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = rawImageObj.width;
    canvas.height = rawImageObj.height;
    ctx.drawImage(rawImageObj, 0, 0);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = Math.max(2, Math.floor(rawImageObj.width / 400));
    if (gridLineStyle === 'dashed') ctx.setLineDash([10, 6]);

    const cellW = rawImageObj.width / cols;
    const cellH = rawImageObj.height / rows;

    for (let c = 1; c < cols; c++) {
      ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, rawImageObj.height); ctx.stroke();
    }
    for (let r = 1; r < rows; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * cellH); ctx.lineTo(rawImageObj.width, r * cellH); ctx.stroke();
    }

    if (showDiagonals) {
      ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(rawImageObj.width, rawImageObj.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rawImageObj.width, 0); ctx.lineTo(0, rawImageObj.height); ctx.stroke();
    }

    if (customLines.length > 0) {
      ctx.setLineDash([]);
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = Math.max(3, Math.floor(rawImageObj.width / 350));
      customLines.forEach(line => {
        const px1 = (line.x1 / 100) * rawImageObj.width;
        const py1 = (line.y1 / 100) * rawImageObj.height;
        const px2 = (line.x2 / 100) * rawImageObj.width;
        const py2 = (line.y2 / 100) * rawImageObj.height;
        ctx.beginPath(); ctx.moveTo(px1, py1); ctx.lineTo(px2, py2); ctx.stroke();
      });
    }

    const link = document.createElement('a');
    link.download = `artist_grid_with_lines_${rows}x${cols}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const downloadAllZip = async () => {
    if (gridPieces.length === 0) return;
    const zip = new JSZip();
    const folder = zip.folder("grid_tiles");
    gridPieces.forEach((piece, i) => {
      folder?.file(`tile_${i + 1}.jpg`, piece.replace(/^data:image\/(png|jpeg);base64,/, ""), { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "image_grid_slices.zip");
  };

  $effect(() => {
    if (rawImageObj) splitImage();
  });
</script>

<div class="space-y-6">
  <!-- Controls -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700">Rows: {rows}</label>
      <input type="range" bind:value={rows} min="1" max="20" class="w-full accent-primary cursor-pointer" />
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700">Columns: {cols}</label>
      <input type="range" bind:value={cols} min="1" max="20" class="w-full accent-primary cursor-pointer" />
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700">Line Color</label>
      <select bind:value={gridColor} class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-dark">
        <option value="rgba(0, 0, 0, 0.5)">Black</option>
        <option value="rgba(255, 255, 255, 0.7)">White</option>
        <option value="rgba(239, 68, 68, 0.7)">Red</option>
        <option value="rgba(59, 130, 246, 0.7)">Blue</option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-semibold mb-1 text-gray-700">Line Style</label>
      <select bind:value={gridLineStyle} class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-dark">
        <option value="dashed">Dashed Lines</option>
        <option value="solid">Solid Lines</option>
      </select>
    </div>
  </div>

  <!-- Toggles & Download -->
  <div class="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
    <div class="flex gap-2">
      <button onclick={() => gridMode = 'overlay'} class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {gridMode === 'overlay' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}">
        ✏️ Grid Overlay Mode
      </button>
      <button onclick={() => gridMode = 'tiles'} class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {gridMode === 'tiles' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}">
        📦 Sliced Tiles Mode
      </button>
    </div>

    <div class="flex items-center gap-4">
      <label class="flex items-center gap-2 text-xs font-medium cursor-pointer text-gray-700">
        <input type="checkbox" bind:checked={showDiagonals} class="rounded accent-primary w-4 h-4" />
        <span>Center Diagonals (X)</span>
      </label>
      <button onclick={downloadGridWithOverlay} class="bg-primary hover:bg-primary-dark text-light font-semibold py-2 px-4 rounded-xl shadow transition text-xs flex items-center gap-1.5 cursor-pointer">
        <Icon icon="mdi:download" class="text-sm" /> Save Grid & Lines
      </button>
    </div>
  </div>

  <!-- Overlay Mode Workspace -->
  {#if gridMode === 'overlay'}
    <div class="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center">
      <div class="w-full max-w-2xl flex justify-between items-center mb-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
        <div class="flex items-center gap-2">
          <button onclick={() => { isLineToolActive = !isLineToolActive; tempLineStart = null; }} class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer {isLineToolActive ? 'bg-purple-600 text-white animate-pulse' : 'bg-white text-dark border border-gray-200 hover:bg-gray-100'}">
            📏 Custom Line Tool: {isLineToolActive ? 'ON' : 'OFF'}
          </button>
          {#if tempLineStart}
            <span class="text-[11px] text-purple-600 font-semibold">Click second point...</span>
          {/if}
        </div>
        {#if customLines.length > 0}
          <button onclick={() => customLines = []} class="text-xs text-red-500 font-semibold cursor-pointer">Clear Lines ({customLines.length})</button>
        {/if}
      </div>

      <div 
        class="relative max-w-2xl w-full flex justify-center bg-gray-100 rounded-2xl overflow-hidden shadow-md border border-gray-200 select-none {isLineToolActive ? 'cursor-crosshair' : 'cursor-default'}"
        onclick={handleImageClick}
        bind:this={imageContainerRef}
      >
        <img src={originalImageSrc} alt="Reference" class="max-h-[500px] w-auto object-contain block pointer-events-none" />
        <svg class="absolute inset-0 w-full h-full pointer-events-none">
          {#each Array(cols - 1) as _, c}
            <line x1="{((c + 1) / cols) * 100}%" y1="0" x2="{((c + 1) / cols) * 100}%" y2="100%" stroke={gridColor} stroke-width="1.5" stroke-dasharray={gridLineStyle === 'dashed' ? '5 3' : 'none'} />
          {/each}
          {#each Array(rows - 1) as _, r}
            <line x1="0" y1="{((r + 1) / rows) * 100}%" x2="100%" y2="{((r + 1) / rows) * 100}%" stroke={gridColor} stroke-width="1.5" stroke-dasharray={gridLineStyle === 'dashed' ? '5 3' : 'none'} />
          {/each}
          {#if showDiagonals}
            <line x1="0" y1="0" x2="100%" y2="100%" stroke={gridColor} stroke-width="1" stroke-dasharray="3 3" opacity="0.7" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke={gridColor} stroke-width="1" stroke-dasharray="3 3" opacity="0.7" />
          {/if}
          {#each customLines as line}
            <line x1="{line.x1}%" y1="{line.y1}%" x2="{line.x2}%" y2="{line.y2}%" stroke="#9333ea" stroke-width="2.5" />
          {/each}
          {#if tempLineStart}
            <circle cx="{tempLineStart.x}%" cy="{tempLineStart.y}%" r="5" fill="#9333ea" stroke="#ffffff" stroke-width="2" />
          {/if}
        </svg>
      </div>
    </div>
  {:else}
    <!-- Sliced Tiles Mode -->
    <div class="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center overflow-auto max-h-[600px]">
      <div class="flex justify-between w-full max-w-3xl mb-4 items-center">
        <p class="text-xs font-semibold text-gray-500 uppercase">Sliced Tiles ({gridPieces.length})</p>
        <button onclick={downloadAllZip} class="bg-emerald-600 hover:bg-emerald-500 text-light text-xs font-semibold py-2 px-4 rounded-xl shadow cursor-pointer">📥 Download ZIP</button>
      </div>
      <div class="grid gap-2 w-full max-w-3xl" style="grid-template-columns: repeat({cols}, minmax(0, 1fr))">
        {#each gridPieces as piece, index}
          <div class="relative group bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-xs">
            <img src={piece} alt="Tile" class="w-full h-auto block aspect-square object-cover" />
            <span class="absolute top-1 left-1 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#{index + 1}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>