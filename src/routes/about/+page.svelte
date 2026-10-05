<script lang="ts">
  import { fly } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Icon from "@iconify/svelte";
</script>

<svelte:head>
  <title>About - Softgenie Studio Photo Suite</title>
</svelte:head>

<div class="min-h-screen bg-light text-dark flex flex-col selection:bg-primary selection:text-light font-sans overflow-x-hidden">
  <HeaderComponent title="Softgenie Studio Photo Suite" />

  <!-- Hero Section -->
  <section class="relative bg-cover bg-center min-h-[320px] sm:min-h-[400px] flex items-center justify-center overflow-hidden border-b border-secondary/20" style="background-image: url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop');">
    <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />
    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 py-16 text-light space-y-4">
      <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white min-h-[2.5rem]" in:fly={{ y: 25, duration: 400 }}>
        About Softgenie Studio Suite
      </h1>
      <p class="text-sm sm:text-base text-light/85 max-w-2xl mx-auto leading-relaxed">
        Bridging the gap between traditional fine art technique and browser-based artificial intelligence. Built for professional painters, sketch artists, and digital creators.
      </p>
    </div>
  </section>

  <!-- Main Content Container -->
  <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-12 space-y-16">
    
    <!-- Vision & Philosophy -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div class="space-y-4">
        <span class="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">Our Philosophy</span>
        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-dark">Empowering Artists with Intelligent Tools</h2>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
          Creating accurate drawings and managing reference photos often requires jumping across heavy desktop software. Softgenie Studio Suite was engineered to provide a lightning-fast, zero-install, privacy-first workstation right inside your web browser.
        </p>
      </div>
      <div class="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div class="flex items-center gap-3 text-primary">
          <Icon icon="mdi:shield-check-outline" class="text-3xl" />
          <h3 class="font-bold text-base text-dark">100% Client-Side Privacy</h3>
        </div>
        <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Your reference images never touch an external server. All image processing, AI background removal, tensor convolutions, and color extractions happen locally on your machine via WebGL and browser memory.
        </p>
      </div>
    </div>

    <!-- Core Feature Highlights Grid -->
    <div class="space-y-6">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="text-xs font-mono font-bold uppercase tracking-wider text-primary">Workstation Modules</span>
        <h2 class="text-2xl sm:text-3xl font-black text-dark">Engineered for Creative Excellence</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Feature 1 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">
            <Icon icon="mdi:grid" />
          </div>
          <h3 class="font-bold text-sm text-dark">Artist Grid & Line Studio</h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            Configure rows, columns, coordinate labels (A1, B2), Rule of Thirds, center diagonals, custom perspective lines, and split tiles for large-scale canvas transfers.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">
            <Icon icon="mdi:brain" />
          </div>
          <h3 class="font-bold text-sm text-dark">TensorFlow.js Neural Studio</h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            Leverage WebGL matrix kernels, Sobel edge detectors, Laplacian embossing, and neural color mapping to turn photos into precise sketches or cinematic masterpieces.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">
            <Icon icon="mdi:palette-advanced" />
          </div>
          <h3 class="font-bold text-sm text-dark">300+ Filter & Retouch Library</h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            Explore vast collections of professional studio grades, film stocks, graphite pencils, charcoal shading, and real-time RGB histogram tonal analyzers.
          </p>
        </div>
      </div>
    </div>

    <!-- Technology Stack Callout -->
    <div class="bg-gray-900 text-white p-8 sm:p-12 rounded-3xl shadow-md space-y-6">
      <div class="max-w-xl space-y-2">
        <span class="text-xs font-mono text-success font-bold uppercase tracking-wider">Under The Hood</span>
        <h3 class="text-xl sm:text-2xl font-bold">Built with Modern Web Architecture</h3>
        <p class="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Powered by Svelte's high-performance reactivity model, TensorFlow.js for browser-native machine learning, HTML5 Canvas API for rapid pixel manipulation, and Tailwind CSS for responsive studio UI layouts.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <div class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1">
          <span class="text-xs font-mono text-success font-bold">Svelte</span>
          <p class="text-[11px] text-gray-400">Reactive Runes State</p>
        </div>
        <div class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1">
          <span class="text-xs font-mono text-success font-bold">TensorFlow.js</span>
          <p class="text-[11px] text-gray-400">WebGL Tensor Kernels</p>
        </div>
        <div class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1">
          <span class="text-xs font-mono text-success font-bold">Canvas API</span>
          <p class="text-[11px] text-gray-400">Low-level Pixel Editing</p>
        </div>
        <div class="bg-gray-800/80 p-4 rounded-xl border border-gray-700/60 space-y-1">
          <span class="text-xs font-mono text-success font-bold">Tailwind CSS</span>
          <p class="text-[11px] text-gray-400">Responsive Studio UI</p>
        </div>
      </div>
    </div>

  </main>

  <FooterComponent />
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
</style>