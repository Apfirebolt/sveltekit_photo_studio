<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly, fade } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import GridStudio from "$lib/components/GridStudio.svelte";
  import TfEditorStudio from "$lib/components/TfEditorStudio.svelte";
  import AdvancedFiltersStudio from "$lib/components/AdvancedFilterStudio.svelte";
  import Icon from "@iconify/svelte";

  let activeTab = $state<'splitter' | 'editor' | 'filters'>('splitter');
  let imageLoaded = $state(false);
  let fileName = $state('');
  let originalImageSrc = $state('');
  let rawImageObj: HTMLImageElement | null = null;
  let activePreset = $state<string>('normal');

  const headline = "Artist Studio & Pro Photo Suite";
  let displayedText = "";
  let typeTimer: ReturnType<typeof setTimeout> | null = null;

  const runTypewriter = () => {
    let index = 0;
    const tick = () => {
      if (index < headline.length) {
        displayedText = headline.slice(0, index + 1);
        index++;
        typeTimer = setTimeout(tick, 50);
      }
    };
    tick();
  };

  const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    fileName = file.name;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        originalImageSrc = event.target.result;
        const img = new Image();
        img.onload = () => {
          rawImageObj = img;
          imageLoaded = true;
        };
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  onMount(() => runTypewriter());
  onDestroy(() => { if (typeTimer) clearTimeout(typeTimer); });
</script>

<svelte:head>
  <title>Artist Studio - Reference Grid & Photo Suite</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 text-dark flex flex-col selection:bg-primary selection:text-light font-sans antialiased overflow-x-hidden">
  <HeaderComponent title="SvelteKit Studio" />

  <!-- Hero Section -->
  <section class="relative bg-cover bg-center min-h-[180px] sm:min-h-[240px] flex items-center justify-center overflow-hidden border-b border-gray-200 shadow-sm" style="background-image: url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop');">
    <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/90 backdrop-blur-[2px] pointer-events-none" />
    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 py-12 sm:py-16 text-light space-y-3">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-primary-light uppercase tracking-wider mb-1">
        <Icon icon="mdi:sparkles" class="text-xs text-amber-400" /> Professional Grade Suite
      </div>
      <h1 class="text-2xl sm:text-5xl font-extrabold tracking-tight text-white min-h-[2.5rem]" in:fly={{ y: 20, duration: 400 }}>
        {displayedText}
      </h1>
      <p class="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto font-medium">
        Precise drawing grid overlays, tensor tone tools, and 30+ advanced reference study filters.
      </p>
    </div>
  </section>

  <!-- Navigation Bar -->
  {#if imageLoaded}
    <div class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-16 z-30 shadow-xs transition-all">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-4">
        <!-- Tabs -->
        <div class="flex items-center gap-2 flex-wrap">
          <button 
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 {activeTab === 'splitter' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/60'}" 
            onclick={() => activeTab = 'splitter'}
          >
            <Icon icon="mdi:grid" class="text-base" /> Grid & Lines
          </button>

          <button 
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 {activeTab === 'editor' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/60'}" 
            onclick={() => activeTab = 'editor'}
          >
            <Icon icon="mdi:brain" class="text-base" /> Tensor Studio
          </button>

          <button 
            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 {activeTab === 'filters' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/60'}" 
            onclick={() => activeTab = 'filters'}
          >
            <Icon icon="mdi:palette-advanced" class="text-base" /> Filter Library
          </button>
        </div>

        <!-- Active File Badge & Change Button -->
        <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
          <div class="flex items-center gap-2 text-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-gray-500 font-medium truncate max-w-[140px] sm:max-w-[200px]" title={fileName}>{fileName}</span>
          </div>
          <label class="cursor-pointer text-[11px] bg-white hover:bg-gray-100 text-dark font-bold py-1 px-3 rounded-lg border border-gray-200 shadow-2xs transition shrink-0">
            Change
            <input type="file" onchange={handleImageUpload} accept="image/*" class="hidden" />
          </label>
        </div>
      </div>
    </div>
  {/if}

  <!-- Workspace Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
    {#if !imageLoaded}
      <div in:fade={{ duration: 300 }} class="max-w-xl mx-auto bg-white border-2 border-dashed border-gray-300 hover:border-primary rounded-3xl p-10 sm:p-14 text-center transition-all shadow-md group">
        <div class="w-20 h-20 mx-auto mb-5 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
          <Icon icon="mdi:cloud-upload-outline" class="w-10 h-10 text-primary" />
        </div>
        <h2 class="text-dark font-extrabold text-lg sm:text-xl mb-1">Upload Reference Photo</h2>
        <p class="text-gray-500 text-xs sm:text-sm mb-6">Drag and drop your image file here, or browse to start creating.</p>
        <label class="cursor-pointer bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-primary/25 transition-all text-xs inline-flex items-center gap-2">
          <Icon icon="mdi:folder-open-outline" class="text-base" /> Browse Image File
          <input type="file" onchange={handleImageUpload} accept="image/*" class="hidden" />
        </label>
      </div>
    {:else}
      <!-- Persistent Tab Containers -->
      <div class:hidden={activeTab !== 'splitter'} in:fade={{ duration: 200 }}>
        <GridStudio {rawImageObj} {originalImageSrc} />
      </div>

      <div class:hidden={activeTab !== 'editor'} in:fade={{ duration: 200 }}>
        <div class="space-y-6">
          <!-- Artistic Preset Bar -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1.5">
              <Icon icon="mdi:auto-fix" class="text-primary text-sm" /> Select Artistic Tensor Style
            </h4>
            <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button onclick={() => activePreset = 'normal'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'normal' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">🌟 Original</button>
              <button onclick={() => activePreset = 'sketch'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'sketch' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">✏️ Pencil Sketch</button>
              <button onclick={() => activePreset = 'portrait_pencil'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'portrait_pencil' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">👤 Pencil Portrait</button>
              <button onclick={() => activePreset = 'pen'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'pen' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">✒️ Fine Pen Ink</button>
              <button onclick={() => activePreset = 'crosshatch'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'crosshatch' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">📐 Cross-Hatch</button>
              <button onclick={() => activePreset = 'charcoal'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'charcoal' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">🪵 Deep Charcoal</button>
              <button onclick={() => activePreset = 'soft_graphite'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'soft_graphite' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">📝 Soft Graphite</button>
              <button onclick={() => activePreset = 'oil'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'oil' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">🎨 Oil Paint</button>
              <button onclick={() => activePreset = 'cartoon'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'cartoon' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">💥 Cartoon Ink</button>
              <button onclick={() => activePreset = 'blueprint'} class="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all {activePreset === 'blueprint' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}">📏 Blueprint</button>
            </div>
          </div>

          <TfEditorStudio {rawImageObj} {activePreset} />
        </div>
      </div>

      <div class:hidden={activeTab !== 'filters'} in:fade={{ duration: 200 }}>
        <AdvancedFiltersStudio {rawImageObj} />
      </div>
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