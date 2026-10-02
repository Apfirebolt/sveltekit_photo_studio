<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import GridStudio from "$lib/components/GridStudio.svelte";
  import TfEditorStudio from "$lib/components/TfEditorStudio.svelte";
  import Icon from "@iconify/svelte";

  let activeTab = $state<'splitter' | 'editor'>('splitter');
  let imageLoaded = $state(false);
  let fileName = $state('');
  let originalImageSrc = $state('');
  let rawImageObj: HTMLImageElement | null = null;
  let activePreset = $state<'normal' | 'sketch' | 'comic' | 'charcoal' | 'popart' | 'blueprint'>('normal');

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

<div class="min-h-screen bg-light text-dark flex flex-col selection:bg-primary selection:text-light font-sans">
  <HeaderComponent title="Studio Suite" />

  <!-- Hero Section -->
  <section class="relative bg-cover bg-center min-h-[380px] flex items-center justify-center overflow-hidden border-b border-secondary/20" style="background-image: url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop');">
    <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />
    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 py-16 text-light space-y-4">
      <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white min-h-[2.5rem]" in:fly={{ y: 25, duration: 400 }}>
        {displayedText}
      </h1>
      <p class="text-sm sm:text-base text-light/85 max-w-2xl mx-auto">
        Precise drawing grid overlays, custom lines, and Tensor-backed artistic filters.
      </p>
    </div>
  </section>

  <!-- Navigation Tab Bar -->
  <div class="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
      <button class="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 {activeTab === 'splitter' ? 'bg-primary text-light shadow-sm' : 'bg-light text-dark hover:bg-gray-100 border border-gray-200'}" onclick={() => activeTab = 'splitter'}>
        <Icon icon="mdi:grid" /> Artist Grid & Line Tool
      </button>
      <button class="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 {activeTab === 'editor' ? 'bg-primary text-light shadow-sm' : 'bg-light text-dark hover:bg-gray-100 border border-gray-200'}" onclick={() => activeTab = 'editor'}>
        <Icon icon="mdi:palette-swatch-outline" /> Tensor Photo Editor
      </button>
    </div>
  </div>

  <!-- Workspace -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-10">
    {#if !imageLoaded}
      <div class="max-w-2xl mx-auto bg-white border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-primary transition shadow-sm">
        <Icon icon="mdi:cloud-upload-outline" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p class="text-dark font-bold text-lg mb-1">Drag & drop your reference photo</p>
        <label class="cursor-pointer bg-primary hover:bg-primary-dark text-light font-semibold py-3 px-8 rounded-xl shadow transition text-xs inline-block mt-4">
          Browse Image File
          <input type="file" onchange={handleImageUpload} accept="image/*" class="hidden" />
        </label>
      </div>
    {:else}
      <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-8">
        <span class="text-xs font-medium text-gray-700">Active File: <strong class="text-dark">{fileName}</strong></span>
        <label class="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 text-dark font-semibold py-2 px-4 rounded-xl border border-gray-200">
          Change Image
          <input type="file" onchange={handleImageUpload} accept="image/*" class="hidden" />
        </label>
      </div>

      <!-- Persistent Tab Containers (Hidden classes preserve state across tab switches!) -->
      <div class:hidden={activeTab !== 'splitter'}>
        <GridStudio {rawImageObj} {originalImageSrc} />
      </div>

      <div class:hidden={activeTab !== 'editor'}>
        <div class="space-y-6">
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button onclick={() => activePreset = 'normal'} class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {activePreset === 'normal' ? 'bg-primary text-light' : 'bg-white border border-gray-200 text-dark'}">🌟 Original</button>
            <button onclick={() => activePreset = 'sketch'} class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {activePreset === 'sketch' ? 'bg-primary text-light' : 'bg-white border border-gray-200 text-dark'}">✏️ Pencil Sketch</button>
            <button onclick={() => activePreset = 'comic'} class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {activePreset === 'comic' ? 'bg-primary text-light' : 'bg-white border border-gray-200 text-dark'}">💥 Comic Ink</button>
            <button onclick={() => activePreset = 'charcoal'} class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {activePreset === 'charcoal' ? 'bg-primary text-light' : 'bg-white border border-gray-200 text-dark'}">🪵 Charcoal</button>
            <button onclick={() => activePreset = 'popart'} class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {activePreset === 'popart' ? 'bg-primary text-light' : 'bg-white border border-gray-200 text-dark'}">🎨 Pop Art</button>
            <button onclick={() => activePreset = 'blueprint'} class="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer {activePreset === 'blueprint' ? 'bg-primary text-light' : 'bg-white border border-gray-200 text-dark'}">📐 Blueprint</button>
          </div>

          <TfEditorStudio {rawImageObj} {activePreset} />
        </div>
      </div>
    {/if}
  </main>

  <FooterComponent />
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>