<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Icon from "@iconify/svelte";
</script>

<svelte:head>
  <title>Docs - Softgenie Studio Photo Suite</title>
</svelte:head>

<div
  class="min-h-screen bg-light dark:bg-dark dark:text-light text-dark flex flex-col selection:bg-primary selection:text-light font-sans overflow-x-hidden"
>
  <HeaderComponent title="Softgenie Studio" />

  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center min-h-[320px] sm:min-h-[400px] flex items-center justify-center overflow-hidden border-b border-secondary/20"
    style="background-image: url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop');"
  >
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none"
    />
    <div
      class="relative z-10 max-w-4xl mx-auto text-center px-4 py-16 text-light space-y-4"
    >
      <h1
        class="text-3xl sm:text-5xl font-black tracking-tight text-white min-h-[2.5rem]"
        in:fly={{ y: 25, duration: 400 }}
      >
        Softgenie Studio Suite Documentation
      </h1>
      <p
        class="text-sm sm:text-base text-light/85 max-w-2xl mx-auto leading-relaxed"
        in:fly={{ y: 20, duration: 400, delay: 100 }}
      >
        Comprehensive documentation for Softgenie Studio Suite, guiding you
        through its powerful features, workstation modules, and best practices
        for maximizing your creative workflow.
      </p>
    </div>
  </section>

  <!-- Main Content Container -->
  <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-12 space-y-16">
    <!-- Vision & Philosophy -->
    <div 
      class="grid grid-cols-1 gap-8 items-center"
      in:fly={{ y: 30, duration: 500, delay: 200 }}
    >
      <div class="space-y-4">
        <span
          class="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full dark:bg-light"
          >Origin Story</span
        >
        <h2
          class="text-2xl sm:text-3xl font-black tracking-tight text-dark dark:text-light"
        >
          Why I built Softgenie Studio Suite Photo Editor?
        </h2>
        <p
          class="text-sm sm:text-base text-gray-600 dark:text-light leading-relaxed"
        >
          As a part-time artist, I found some of the very basic features like
          splitting an image into grid was very cumbersome and time-consuming in
          existing software. I used to use a mobile app for this basic feature
          which had a lot of advertisements. I built Softgenie Studio Suite
          Photo Editor to streamline these tasks and provide a more efficient,
          browser-based creative workflow.
        </p>
        <p class="text-gray-600 dark:text-light leading-relaxed">
          While initially the idea was just to limit this application to basic
          grid and editing features only, it has gradually evolved into a
          comprehensive photo editing suite with a variety of creative tools and
          workstation modules. I'd try to guide you through various features
          this web-based image editor has through illustrations and screenshots
          in this documentation. I'm also working on a pdf documentation of this
          application. This application can be broadly divided into four modules
          as you might see at the top as tabs.
        </p>
      </div>
    </div>

    <!-- Core Feature Highlights Grid -->
    <div class="space-y-6">
      <div 
        class="text-center max-w-2xl mx-auto space-y-2"
        in:fly={{ y: 25, duration: 400, delay: 300 }}
      >
        <span
          class="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:bg-light rounded-2xl p-2"
          >Workstation Modules</span
        >
        <h2
          class="text-2xl sm:text-3xl font-black text-dark dark:text-light mt-2"
        >
          Engineered for Creative Excellence
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Feature 1 -->
        <div
          class="bg-white dark:bg-secondary p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3"
          in:fly={{ y: 30, duration: 400, delay: 400 }}
        >
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-white flex items-center justify-center text-xl"
          >
            <Icon icon="mdi:grid" />
          </div>
          <h3 class="font-bold text-xl text-dark dark:text-light">
            Artist Grid & Line Studio
          </h3>
          <p class="text-gray-600 dark:text-light leading-relaxed">
            Configure rows, columns, coordinate labels (A1, B2), Rule of Thirds,
            center diagonals, custom perspective lines, and split tiles for
            large-scale canvas transfers.
          </p>
        </div>

        <!-- Feature 2 -->
        <div
          class="bg-white dark:bg-secondary p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3"
          in:fly={{ y: 30, duration: 400, delay: 500 }}
        >
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-white flex items-center justify-center text-xl"
          >
            <Icon icon="mdi:brain" />
          </div>
          <h3 class="font-bold text-dark dark:text-light text-xl">
            TensorFlow.js Studio
          </h3>
          <p class="text-gray-600 leading-relaxed dark:text-light">
            Leverage WebGL matrix kernels, Sobel edge detectors, Laplacian
            embossing, and neural color mapping to turn photos into precise
            sketches or cinematic masterpieces.
          </p>
        </div>

        <!-- Feature 3 -->
        <div
          class="bg-white dark:bg-secondary p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3"
          in:fly={{ y: 30, duration: 400, delay: 600 }}
        >
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-white flex items-center justify-center text-xl"
          >
            <Icon icon="mdi:palette-advanced" />
          </div>
          <h3 class="font-bold text-xl text-dark dark:text-light">
            300+ Filter & Retouch Library
          </h3>
          <p class="text-gray-600 dark:text-light leading-relaxed">
            Explore vast collections of professional studio grades, film stocks,
            graphite pencils, charcoal shading, and real-time RGB histogram
            tonal analyzers.
          </p>
        </div>
      </div>
    </div>

    <div
      class="grid grid-cols-1 gap-6 bg-white dark:bg-secondary"
      in:fly={{ y: 30, duration: 400, delay: 700 }}
    >
      <div
        class="bg-white dark:bg-secondary p-6 border border-gray-200 shadow-xs space-y-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-white flex items-center justify-center text-xl"
        >
          <Icon icon="mdi:file-multiple" />
        </div>
        <h3 class="font-bold text-xl text-dark dark:text-light">
          File Bulk Process Features
        </h3>
        <p class="text-gray-600 dark:text-light leading-relaxed">
          Bulk process features include conversion of file formats, resizing, renaming, and applying filters to multiple files simultaneously.
        </p>
      </div>
    </div>

    <div
      class="bg-gray-900 text-white p-8 sm:p-12 rounded-3xl shadow-md space-y-6"
      in:fly={{ y: 30, duration: 400, delay: 800 }}
    >
      <h3 class="text-xl sm:text-2xl font-bold">
        Documentation Illustration
      </h3>
      <p class="text-gray-400 leading-relaxed">
        For demonstration purposes, this image of Goku from Dragonball Z would be used.
      </p>
      <img src="/docs/test.jpg" alt="Documentation illustration" />
    </div>

    <!-- Technology Stack Callouts (Modules 1 to 4) -->
    <div
      class="bg-gray-900 text-white p-8 sm:p-12 rounded-3xl shadow-md space-y-6"
      in:fly={{ y: 30, duration: 400, delay: 900 }}
    >
      <div class="max-w-xl space-y-2">
        <span
          class="text-xs font-mono text-success font-bold uppercase tracking-wider"
          >Module - 1</span
        >
        <h3 class="text-xl sm:text-2xl font-bold">
          Grid Lines and Tiling
        </h3>
        <p class="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Powered by Svelte's high-performance reactivity model, TensorFlow.js
          for browser-native machine learning, HTML5 Canvas API for rapid pixel
          manipulation, and Tailwind CSS for responsive studio UI layouts.
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

    <div
      class="bg-gray-900 text-white p-8 sm:p-12 rounded-3xl shadow-md space-y-6"
      in:fly={{ y: 30, duration: 400, delay: 1000 }}
    >
      <div class="max-w-xl space-y-2">
        <span
          class="text-xs font-mono text-success font-bold uppercase tracking-wider"
          >Module - 2</span
        >
        <h3 class="text-xl sm:text-2xl font-bold">
          Built with Modern Web Architecture
        </h3>
        <p class="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Powered by Svelte's high-performance reactivity model, TensorFlow.js
          for browser-native machine learning, HTML5 Canvas API for rapid pixel
          manipulation, and Tailwind CSS for responsive studio UI layouts.
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

    <div
      class="bg-gray-900 text-white p-8 sm:p-12 rounded-3xl shadow-md space-y-6"
      in:fly={{ y: 30, duration: 400, delay: 1100 }}
    >
      <div class="max-w-xl space-y-2">
        <span
          class="text-xs font-mono text-success font-bold uppercase tracking-wider"
          >Module - 3</span
        >
        <h3 class="text-xl sm:text-2xl font-bold">
          400+ Artistic filters and Vibe filters
        </h3>
        <p class="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Powered by Svelte's high-performance reactivity model, TensorFlow.js
          for browser-native machine learning, HTML5 Canvas API for rapid pixel
          manipulation, and Tailwind CSS for responsive studio UI layouts.
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

    <div
      class="bg-gray-900 text-white p-8 sm:p-12 rounded-3xl shadow-md space-y-6"
      in:fly={{ y: 30, duration: 400, delay: 1200 }}
    >
      <div class="max-w-xl space-y-2">
        <span
          class="text-xs font-mono text-success font-bold uppercase tracking-wider"
          >Module - 4</span
        >
        <h3 class="text-xl sm:text-2xl font-bold">
          Bulk File Features
        </h3>
        <p class="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Powered by Svelte's high-performance reactivity model, TensorFlow.js
          for browser-native machine learning, HTML5 Canvas API for rapid pixel
          manipulation, and Tailwind CSS for responsive studio UI layouts.
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
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>