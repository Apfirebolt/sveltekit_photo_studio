<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Icon from "@iconify/svelte";
  import JSZip from "jszip";
  import { saveAs } from "file-saver";

  // App States
  let activeTab = $state<'splitter' | 'editor'>('splitter');
  let gridMode = $state<'overlay' | 'tiles'>('overlay');
  let imageLoaded = $state(false);
  let fileName = $state('');
  let originalImageSrc = $state('');

  // Artist Grid Parameters
  let rows = $state(4);
  let cols = $state(4);
  let gridColor = $state('rgba(0, 0, 0, 0.5)');
  let gridLineStyle = $state<'dashed' | 'solid'>('dashed');
  let showDiagonals = $state(true);
  let gridPieces = $state<string[]>([]);

  // Custom Line Tool Parameters
  let imageContainerRef = $state<HTMLDivElement | null>(null);
  let isLineToolActive = $state(false);
  let tempLineStart = $state<{ x: number; y: number } | null>(null);
  let customLines = $state<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);

  // Editor Parameters
  let editorCanvas = $state<HTMLCanvasElement | null>(null);
  let brightness = $state(100);
  let contrast = $state(100);
  let saturation = $state(100);
  let activePreset = $state<'normal' | 'sketch' | 'comic' | 'charcoal' | 'popart' | 'blueprint'>('normal');

  let rawImageObj: HTMLImageElement | null = null;

  // Typewriter effect matching your design system
  const headline = "Artist Studio & Pro Photo Suite";
  let displayedText = "";
  let typeTimer: ReturnType<typeof setTimeout> | null = null;

  const runTypewriter = () => {
    let index = 0;
    const tick = () => {
      if (index < headline.length) {
        displayedText = headline.slice(0, index + 1);
        index++;
        typeTimer = setTimeout(tick, 60);
      }
    };
    tick();
  };

  const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    fileName = file.name;
    customLines = [];
    tempLineStart = null;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        originalImageSrc = event.target.result;
        const img = new Image();
        img.onload = () => {
          rawImageObj = img;
          imageLoaded = true;
          splitImage();
          setTimeout(() => applyEditorFilters(), 50);
        };
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (e: MouseEvent) => {
    if (!isLineToolActive || !imageContainerRef) return;

    const imgEl = imageContainerRef.querySelector('img');
    if (!imgEl) return;
    const imgRect = imgEl.getBoundingClientRect();

    if (
      e.clientX < imgRect.left || e.clientX > imgRect.right ||
      e.clientY < imgRect.top || e.clientY > imgRect.bottom
    ) return;

    const x = ((e.clientX - imgRect.left) / imgRect.width) * 100;
    const y = ((e.clientY - imgRect.top) / imgRect.height) * 100;

    if (!tempLineStart) {
      tempLineStart = { x, y };
    } else {
      customLines = [...customLines, { x1: tempLineStart.x, y1: tempLineStart.y, x2: x, y2: y }];
      tempLineStart = null;
    }
  };

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

  const downloadSingleTile = (url: string, i: number) => {
    const link = document.createElement('a');
    link.download = `tile_${i}.jpg`;
    link.href = url;
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
        ctx.beginPath();
        ctx.moveTo(px1, py1);
        ctx.lineTo(px2, py2);
        ctx.stroke();
      });
    }

    const link = document.createElement('a');
    link.download = `artist_grid_with_lines_${rows}x${cols}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const rotateImage = (degrees: number) => {
    if (!rawImageObj) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (degrees === 90) {
      canvas.width = rawImageObj.height;
      canvas.height = rawImageObj.width;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(rawImageObj, -rawImageObj.width / 2, -rawImageObj.height / 2);
    }
    const rotatedImg = new Image();
    rotatedImg.onload = () => {
      rawImageObj = rotatedImg;
      originalImageSrc = canvas.toDataURL();
      splitImage();
      applyEditorFilters();
    };
    rotatedImg.src = canvas.toDataURL();
  };

  const flipImage = () => {
    if (!rawImageObj) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = rawImageObj.width;
    canvas.height = rawImageObj.height;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(rawImageObj, 0, 0);

    const flippedImg = new Image();
    flippedImg.onload = () => {
      rawImageObj = flippedImg;
      originalImageSrc = canvas.toDataURL();
      splitImage();
      applyEditorFilters();
    };
    flippedImg.src = canvas.toDataURL();
  };

  const applyEditorFilters = () => {
    if (!rawImageObj || !editorCanvas) return;
    const canvas = editorCanvas;
    canvas.width = rawImageObj.width;
    canvas.height = rawImageObj.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (activePreset === 'sketch') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(100%) invert(100%) blur(3px)`;
      ctx.drawImage(rawImageObj, 0, 0);
      ctx.globalCompositeOperation = 'color-dodge';
      ctx.filter = `grayscale(100%) brightness(${brightness}%)`;
      ctx.drawImage(rawImageObj, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    } else if (activePreset === 'comic') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast + 50}%) saturate(${saturation + 40}%)`;
      ctx.drawImage(rawImageObj, 0, 0);
    } else if (activePreset === 'charcoal') {
      ctx.filter = `brightness(${brightness - 10}%) contrast(${contrast + 60}%) grayscale(100%) blur(1px)`;
      ctx.drawImage(rawImageObj, 0, 0);
    } else if (activePreset === 'popart') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast + 30}%) saturate(${saturation + 80}%)`;
      ctx.drawImage(rawImageObj, 0, 0);
    } else if (activePreset === 'blueprint') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast + 20}%) grayscale(100%) invert(100%) hue-rotate(180deg)`;
      ctx.drawImage(rawImageObj, 0, 0);
    } else {
      let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.filter = filterStr;
      ctx.drawImage(rawImageObj, 0, 0);
      ctx.filter = 'none';
    }
  };

  const applyPreset = (preset: typeof activePreset) => {
    activePreset = preset;
    if (preset === 'sketch' || preset === 'charcoal' || preset === 'blueprint') saturation = 0;
    else if (preset === 'normal') { brightness = 100; contrast = 100; saturation = 100; }
    applyEditorFilters();
  };

  const resetEditor = () => {
    brightness = 100; contrast = 100; saturation = 100; activePreset = 'normal';
    applyEditorFilters();
  };

  const downloadEditedImage = () => {
    if (!editorCanvas) return;
    const link = document.createElement('a');
    link.download = `stylized_${activePreset}_photo.jpg`;
    link.href = editorCanvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  $effect(() => {
    if (imageLoaded) {
      splitImage();
    }
  });

  onMount(() => {
    runTypewriter();
  });

  onDestroy(() => {
    if (typeTimer) clearTimeout(typeTimer);
  });
</script>

<svelte:head>
  <title>Artist Studio - Reference Grid & Photo Suite</title>
  <meta name="description" content="Professional artist reference grids, perspective custom line tools, tile cutting, and 5 curated artistic/cartoon effects." />
</svelte:head>

<div class="min-h-screen bg-light text-dark flex flex-col selection:bg-primary selection:text-light font-sans">
  <HeaderComponent title="Studio Suite" />

  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center min-h-[380px] flex items-center justify-center overflow-hidden border-b border-secondary/20"
    style="background-image: url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop');"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />

    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 text-light space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-light border border-white/20 backdrop-blur-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-light animate-pulse" />
        Client-Side High-Performance Suite
      </div>

      <h1
        class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white min-h-[2.5rem] sm:min-h-[4rem]"
        in:fly={{ y: 25, duration: 400 }}
      >
        {displayedText}
      </h1>

      <p
        class="text-sm sm:text-base lg:text-lg text-light/85 max-w-2xl mx-auto leading-relaxed"
        in:fly={{ y: 25, duration: 400, delay: 150 }}
      >
        Precise drawing grid overlays, perspective lines, tile cutters, and 5 artistic style filters.
      </p>
    </div>
  </section>

  <!-- Workspace Selector Navigation Bar -->
  <div class="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-3">
      <button
        type="button"
        class="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 {activeTab === 'splitter'
          ? 'bg-primary text-light shadow-sm'
          : 'bg-light text-dark hover:bg-gray-100 border border-gray-200'}"
        onclick={() => activeTab = 'splitter'}
      >
        <Icon icon="mdi:grid" class="text-base" />
        Artist Grid & Line Tool
      </button>

      <button
        type="button"
        class="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 {activeTab === 'editor'
          ? 'bg-primary text-light shadow-sm'
          : 'bg-light text-dark hover:bg-gray-100 border border-gray-200'}"
        onclick={() => activeTab = 'editor'}
      >
        <Icon icon="mdi:palette-swatch-outline" class="text-base" />
        Stylized Photo Editor
      </button>
    </div>
  </div>

  <!-- Main Container Wrapper -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
    
    <!-- Initial File Upload Dropzone -->
    {#if !imageLoaded}
      <div class="max-w-2xl mx-auto bg-white border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-primary transition-all shadow-sm">
        <Icon icon="mdi:cloud-upload-outline" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p class="text-dark font-bold text-lg mb-1">Drag & drop your reference photo</p>
        <p class="text-gray-500 text-xs sm:text-sm mb-6">Supports PNG, JPG, WEBP formats</p>
        <label class="cursor-pointer bg-primary hover:bg-primary-dark text-light font-semibold py-3 px-8 rounded-xl shadow-md transition-all text-xs sm:text-sm inline-block">
          Browse Image File
          <input type="file" onchange={handleImageUpload} accept="image/*" class="hidden" />
        </label>
      </div>
    {:else}
      
      <!-- Loaded File Status Bar -->
      <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-8">
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs sm:text-sm font-medium text-gray-700">Active Image: <strong class="text-dark">{fileName}</strong></span>
        </div>
        <label class="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 text-dark font-semibold py-2 px-4 rounded-xl transition border border-gray-200">
          Change Image
          <input type="file" onchange={handleImageUpload} accept="image/*" class="hidden" />
        </label>
      </div>

      <!-- TAB 1: GRID & LINES WORKSPACE -->
      {#if activeTab === 'splitter'}
        <div class="space-y-6">
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

          <!-- Secondary Actions & Toggle Bar -->
          <div class="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div class="flex gap-2">
              <button 
                onclick={() => gridMode = 'overlay'}
                class="px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer {gridMode === 'overlay' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}"
              >
                ✏️ Grid Overlay Mode
              </button>
              <button 
                onclick={() => gridMode = 'tiles'}
                class="px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer {gridMode === 'tiles' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}"
              >
                📦 Sliced Tiles Mode
              </button>
            </div>

            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 text-xs font-medium cursor-pointer text-gray-700">
                <input type="checkbox" bind:checked={showDiagonals} class="rounded accent-primary w-4 h-4" />
                <span>Center Diagonals (X)</span>
              </label>
              <button 
                onclick={downloadGridWithOverlay}
                class="bg-primary hover:bg-primary-dark text-light font-semibold py-2 px-4 rounded-xl shadow transition text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Icon icon="mdi:download" class="text-sm" />
                Save Grid & Custom Lines
              </button>
            </div>
          </div>

          <!-- Mode A: Overlay & Custom Perspective Lines -->
          {#if gridMode === 'overlay'}
            <div class="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center">
              <div class="w-full max-w-2xl flex justify-between items-center mb-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div class="flex items-center gap-2">
                  <button 
                    onclick={() => { isLineToolActive = !isLineToolActive; tempLineStart = null; }}
                    class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer {isLineToolActive ? 'bg-purple-600 text-white animate-pulse' : 'bg-white text-dark border border-gray-200 hover:bg-gray-100'}"
                  >
                    📏 Custom Line Tool: {isLineToolActive ? 'ON (Click 2 points)' : 'OFF'}
                  </button>
                  {#if tempLineStart}
                    <span class="text-[11px] text-purple-600 font-semibold">First point set! Click second point...</span>
                  {/if}
                </div>
                {#if customLines.length > 0}
                  <button onclick={() => customLines = []} class="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer">
                    Clear Lines ({customLines.length})
                  </button>
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
            <!-- Mode B: Sliced Grid Tiles -->
            <div class="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center overflow-auto max-h-[600px]">
              <div class="flex justify-between w-full max-w-3xl mb-4 items-center">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sliced Slices ({gridPieces.length} Tiles)</p>
                <button onclick={downloadAllZip} class="bg-emerald-600 hover:bg-emerald-500 text-light text-xs font-semibold py-2 px-4 rounded-xl shadow cursor-pointer">
                  📥 Download All as ZIP
                </button>
              </div>
              
              <div class="grid gap-2 w-full max-w-3xl" style="grid-template-columns: repeat({cols}, minmax(0, 1fr))">
                {#each gridPieces as piece, index}
                  <div class="relative group bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-xs">
                    <img src={piece} alt="Tile" class="w-full h-auto block aspect-square object-cover" />
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onclick={() => downloadSingleTile(piece, index + 1)} class="p-2 bg-white text-dark rounded-lg text-xs font-bold shadow cursor-pointer">
                        Save
                      </button>
                    </div>
                    <span class="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <!-- TAB 2: STYLIZED PHOTO EDITOR WORKSPACE -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Controls Panel Sidebar -->
          <div class="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <h3 class="font-bold text-sm text-dark border-b border-gray-100 pb-2">Transform Orientation</h3>
            
            <div class="grid grid-cols-2 gap-2">
              <button onclick={() => rotateImage(90)} class="bg-gray-100 hover:bg-gray-200 text-xs font-semibold py-2 px-3 rounded-xl transition text-dark cursor-pointer">
                🔄 Rotate 90°
              </button>
              <button onclick={flipImage} class="bg-gray-100 hover:bg-gray-200 text-xs font-semibold py-2 px-3 rounded-xl transition text-dark cursor-pointer">
                ↔️ Flip Horiz
              </button>
            </div>

            <h3 class="font-bold text-sm text-dark border-b border-gray-100 pb-2 pt-2">Tone Adjustments</h3>
            
            <div>
              <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
                <span>Brightness</span><span>{brightness}%</span>
              </div>
              <input type="range" bind:value={brightness} min="0" max="200" oninput={applyEditorFilters} class="w-full accent-primary cursor-pointer" />
            </div>

            <div>
              <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
                <span>Contrast</span><span>{contrast}%</span>
              </div>
              <input type="range" bind:value={contrast} min="0" max="200" oninput={applyEditorFilters} class="w-full accent-primary cursor-pointer" />
            </div>

            <div>
              <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
                <span>Saturation</span><span>{saturation}%</span>
              </div>
              <input type="range" bind:value={saturation} min="0" max="200" oninput={applyEditorFilters} class="w-full accent-primary cursor-pointer" />
            </div>

            <h3 class="font-bold text-sm text-dark border-b border-gray-100 pb-2 pt-2">5 Curated Art & Cartoon Effects</h3>
            
            <div class="grid grid-cols-1 gap-2">
              <button onclick={() => applyPreset('normal')} class="py-2 px-3 rounded-xl text-xs font-semibold transition text-left cursor-pointer {activePreset === 'normal' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}">🌟 Normal / Original</button>
              <button onclick={() => applyPreset('sketch')} class="py-2 px-3 rounded-xl text-xs font-semibold transition text-left cursor-pointer {activePreset === 'sketch' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}">✏️ 1. Classic Pencil Sketch</button>
              <button onclick={() => applyPreset('comic')} class="py-2 px-3 rounded-xl text-xs font-semibold transition text-left cursor-pointer {activePreset === 'comic' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}">💥 2. Comic Book Ink</button>
              <button onclick={() => applyPreset('charcoal')} class="py-2 px-3 rounded-xl text-xs font-semibold transition text-left cursor-pointer {activePreset === 'charcoal' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}">🪵 3. Charcoal & Conte</button>
              <button onclick={() => applyPreset('popart')} class="py-2 px-3 rounded-xl text-xs font-semibold transition text-left cursor-pointer {activePreset === 'popart' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}">🎨 4. Vibrant Cel Shading</button>
              <button onclick={() => applyPreset('blueprint')} class="py-2 px-3 rounded-xl text-xs font-semibold transition text-left cursor-pointer {activePreset === 'blueprint' ? 'bg-primary text-light shadow-sm' : 'bg-gray-100 text-dark hover:bg-gray-200'}">📐 5. Vintage Blueprint</button>
            </div>

            <div class="pt-4 flex flex-col gap-2">
              <button onclick={resetEditor} class="w-full bg-gray-100 hover:bg-gray-200 text-dark font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer">
                Reset All Filters
              </button>
              <button onclick={downloadEditedImage} class="w-full bg-primary hover:bg-primary-dark text-light font-semibold py-2.5 rounded-xl text-xs shadow transition cursor-pointer">
                💾 Download Stylized Photo
              </button>
            </div>
          </div>

          <!-- Canvas Preview Area -->
          <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center min-h-[500px]">
            <canvas bind:this={editorCanvas} class="max-w-full max-h-[520px] object-contain rounded-xl shadow-md border border-gray-200"></canvas>
          </div>
        </div>
      {/if}
    {/if}
  </main>

  <FooterComponent />
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>