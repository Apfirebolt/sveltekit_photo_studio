<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import GridStudio from "$lib/components/GridStudio.svelte";
  import TfEditorStudio from "$lib/components/TfEditorStudio.svelte";
  import AdvancedFiltersStudio from "$lib/components/AdvancedFilterStudio.svelte";
  import Utility from "$lib/components/Utility.svelte";
  import Icon from "@iconify/svelte";

  let activeTab = $state<'splitter' | 'editor' | 'filters' | 'bulk'>('splitter');
  let imageLoaded = $state(false);
  let fileName = $state('');
  
  // Master Original Source vs Active Working Source for edits/tiles
  let masterImageSrc = $state('');
  let originalImageSrc = $state(''); 
  let rawImageObj = $state<HTMLImageElement | null>(null);
  let activePreset = $state<string>('normal');
  let uploadError = $state('');
  let isTileActive = $state(false);
  let isDraggingImage = $state(false);
  let dragDepth = 0;

  const headline = "Softgenie Studio";
  let displayedText = "";
  let typeTimer: ReturnType<typeof setTimeout> | null = null;

  const loadImageFile = (file: File, target?: HTMLInputElement) => {
    if (!file) return;

    uploadError = '';
    if (!file.type.startsWith('image/')) {
      uploadError = 'Please upload an image file.';
      if (target) target.value = '';
      return;
    }

    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      uploadError = `File size exceeds ${MAX_SIZE_MB}MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB). Please upload a smaller image.`;
      imageLoaded = false;
      rawImageObj = null;
      masterImageSrc = '';
      originalImageSrc = '';
      if (target) target.value = '';
      return;
    }

    fileName = file.name;
    const reader = new FileReader();
    reader.onerror = () => {
      uploadError = 'The image could not be read. Please try another file.';
      if (target) target.value = '';
    };
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        masterImageSrc = event.target.result;
        originalImageSrc = event.target.result;
        const img = new Image();
        img.onload = () => {
          rawImageObj = img;
          imageLoaded = true;
          isTileActive = false;
        };
        img.onerror = () => {
          uploadError = 'The selected file is not a supported image.';
          if (target) target.value = '';
        };
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (file) loadImageFile(file, target);
  };

  const handleWindowDragEnter = (event: DragEvent) => {
    if (activeTab === 'bulk') return;
    if (!Array.from(event.dataTransfer?.types ?? []).includes('Files')) return;
    event.preventDefault();
    dragDepth += 1;
    isDraggingImage = true;
  };

  const handleWindowDragLeave = (event: DragEvent) => {
    if (!Array.from(event.dataTransfer?.types ?? []).includes('Files')) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) isDraggingImage = false;
  };

  const handleWindowDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  };

  const handleWindowDrop = (event: DragEvent) => {
    event.preventDefault();
    dragDepth = 0;
    isDraggingImage = false;
    if (activeTab === 'bulk') return;
    const file = Array.from(event.dataTransfer?.files ?? []).find((item) => item.type.startsWith('image/'));
    if (file) {
      loadImageFile(file);
    } else {
      uploadError = 'Drop an image file to open it.';
    }
  };

  // Handler to replace working image with a selected grid tile
  const handleSelectTileAsMain = (tileDataUrl: string, tileLabel: string) => {
    const img = new Image();
    img.onload = () => {
      rawImageObj = img;
      originalImageSrc = tileDataUrl;
      isTileActive = true;
      fileName = `${fileName} [Tile ${tileLabel}]`;
      // Automatically jump to Tensor Studio tab to start editing the tile
      activeTab = 'editor';
    };
    img.src = tileDataUrl;
  };

  // Handler to restore master original image immediately
  const restoreOriginalImage = () => {
    if (!masterImageSrc) return;
    const img = new Image();
    img.onload = () => {
      rawImageObj = img;
      originalImageSrc = masterImageSrc;
      isTileActive = false;
      fileName = fileName.includes('[Tile') ? fileName.split(' [Tile')[0] : fileName;
    };
    img.src = masterImageSrc;
  };

  onDestroy(() => { if (typeTimer) clearTimeout(typeTimer); });
</script>

<svelte:window
  ondragenter={handleWindowDragEnter}
  ondragleave={handleWindowDragLeave}
  ondragover={handleWindowDragOver}
  ondrop={handleWindowDrop}
/>

<svelte:head>
  <title>Softgenie Studio - Reference Grid & Photo Suite</title>
</svelte:head>

<div class="min-h-screen bg-light text-dark flex flex-col selection:bg-primary selection:text-light font-sans overflow-x-hidden">
  {#if isDraggingImage}
    <div class="pointer-events-none fixed inset-3 z-100 flex items-center justify-center rounded-3xl border-4 border-dashed border-primary bg-white/90 text-primary shadow-2xl">
      <span class="flex items-center gap-3 text-lg font-bold"><Icon icon="mdi:cloud-upload-outline" class="text-3xl" /> Drop image to open</span>
    </div>
  {/if}
  <HeaderComponent title="Softgenie Studio" />

  <!-- Hero Section -->
  <section class="relative bg-cover bg-center min-h-[150px] sm:min-h-[200px] flex items-center justify-center overflow-hidden border-b border-secondary/20" style="background-image: url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop');">
    <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />
    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 py-12 sm:py-16 text-light space-y-4">
      <h1 class="text-2xl sm:text-5xl font-black tracking-tight text-white min-h-[2.5rem]" in:fly={{ y: 25, duration: 400 }}>
        Softgenie Studio Photo Suite
      </h1>
      <p class="text-xs sm:text-base text-light/85 max-w-2xl mx-auto">
        Precise drawing grid overlays, custom tiles, tensor tone tools, and 300+ advanced filters.
      </p>
    </div>
  </section>

  <!-- 3-Tab Navigation Bar -->
  <div class="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      <button 
        type="button"
        class="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 {activeTab === 'splitter' ? 'bg-primary text-light shadow-sm' : 'bg-light text-dark hover:bg-gray-100 border border-gray-200'}" 
        onclick={() => activeTab = 'splitter'}
      >
        <Icon icon="mdi:grid" /> Grid & Lines
      </button>

      <button 
        type="button"
        class="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 {activeTab === 'editor' ? 'bg-primary text-light shadow-sm' : 'bg-light text-dark hover:bg-gray-100 border border-gray-200'}" 
        onclick={() => activeTab = 'editor'}
      >
        <Icon icon="mdi:brain" /> Tensor Studio
      </button>

      <button 
        type="button"
        class="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 {activeTab === 'filters' ? 'bg-primary text-light shadow-sm' : 'bg-light text-dark hover:bg-gray-100 border border-gray-200'}" 
        onclick={() => activeTab = 'filters'}
      >
        <Icon icon="mdi:palette-advanced" /> Filter Library
      </button>

      <button 
        type="button"
        class="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 {activeTab === 'bulk' ? 'bg-primary text-light shadow-sm' : 'bg-light text-dark hover:bg-gray-100 border border-gray-200'}" 
        onclick={() => activeTab = 'bulk'}
      >
        <Icon icon="mdi:image-multiple" /> Bulk Tools
      </button>
    </div>
  </div>

  <!-- Workspace Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-10">
    
    {#if uploadError}
      <div role="alert" class="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-600 flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:alert-circle" class="text-lg shrink-0" />
          <span>{uploadError}</span>
        </div>
        <button type="button" onclick={() => uploadError = ''} class="text-red-400 hover:text-red-600 font-bold cursor-pointer">✕</button>
      </div>
    {/if}

    <div class:hidden={activeTab !== 'bulk'}>
      <Utility />
    </div>

    <div class:hidden={activeTab === 'bulk'}>
    {#if !imageLoaded}
      <div class="max-w-2xl mx-auto bg-white border-2 border-gray-300 rounded-3xl p-8 sm:p-12 text-center hover:border-primary transition shadow-sm space-y-3">
        <Icon icon="mdi:cloud-upload-outline" class="w-16 h-16 mx-auto text-gray-400" />
        <p class="text-dark font-bold text-base sm:text-lg mb-1">Drag & drop your reference photo</p>
        <p class="text-xs text-gray-400 font-mono">Maximum file size allowed: 10 MB</p>
        
        <label class="cursor-pointer bg-primary hover:bg-primary-dark text-light font-semibold py-3 px-8 rounded-xl shadow transition text-xs inline-block mt-2">
          Browse Image File
          <input type="file" onchange={handleImageUpload} accept="image/*" class="hidden" />
        </label>
      </div>
    {:else}
      <div class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-8 gap-3">
        <div class="flex items-center gap-3">
          <span class="text-xs font-medium text-gray-700 truncate max-w-full">Active File: <strong class="text-dark">{fileName}</strong></span>
          {#if isTileActive}
            <button 
              type="button" 
              onclick={restoreOriginalImage}
              class="px-2.5 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
            >
              <Icon icon="mdi:undo" /> Restore Original Image
            </button>
          {/if}
        </div>
        <label class="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 text-dark font-semibold py-2 px-4 rounded-xl border border-gray-200 shrink-0">
          Change Image
          <input type="file" onchange={handleImageUpload} accept="image/*" class="hidden" />
        </label>
      </div>

      <!-- Persistent Tab Containers -->
      <div class:hidden={activeTab !== 'splitter'}>
        <GridStudio {rawImageObj} {originalImageSrc} onSelectTile={handleSelectTileAsMain} />
      </div>

      <div class:hidden={activeTab !== 'editor'}>
        <div class="space-y-6">
          <!-- Artistic Preset Bar -->
          <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">Select Artistic Tensor Style</h4>
            <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button type="button" onclick={() => activePreset = 'normal'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'normal' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">🌟 Original</button>
              <button type="button" onclick={() => activePreset = 'sketch'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'sketch' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">✏️ Pencil Sketch</button>
              <button type="button" onclick={() => activePreset = 'portrait_pencil'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'portrait_pencil' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">👤 Pencil Portrait</button>
              <button type="button" onclick={() => activePreset = 'pen'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'pen' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">✒️ Fine Pen Ink</button>
              <button type="button" onclick={() => activePreset = 'crosshatch'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'crosshatch' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">📐 Cross-Hatch</button>
              <button type="button" onclick={() => activePreset = 'charcoal'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'charcoal' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">🪵 Deep Charcoal</button>
              <button type="button" onclick={() => activePreset = 'soft_graphite'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'soft_graphite' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">📝 Soft Graphite</button>
              <button type="button" onclick={() => activePreset = 'oil'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'oil' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">🎨 Oil Paint</button>
              <button type="button" onclick={() => activePreset = 'cartoon'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'cartoon' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">💥 Cartoon Ink</button>
              <button type="button" onclick={() => activePreset = 'blueprint'} class="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap {activePreset === 'blueprint' ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 border border-gray-200 text-dark hover:bg-gray-100'}">📏 Blueprint</button>
            </div>
          </div>

          <TfEditorStudio {rawImageObj} {activePreset} />
        </div>
      </div>

      <div class:hidden={activeTab !== 'filters'}>
        <AdvancedFiltersStudio {rawImageObj} />
      </div>
    {/if}
    </div>
  </main>

  <FooterComponent />
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>