<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";

  const headline = "About Artist Studio Suite";
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

  const featureCards = [
    {
      title: "Reference Grids & Diagonals",
      description: "Customize rows and columns dynamically with precise line color options and center diagonal guides for accurate drawing proportions.",
      icon: "mdi:grid",
    },
    {
      title: "Perspective Line Tool",
      description: "Click any two points on your reference canvas to overlay custom perspective and horizon lines directly onto your image.",
      icon: "mdi:vector-line",
    },
    {
      title: "Tile Slicer & ZIP Exporter",
      description: "Slice complex reference photos into grid tiles instantly and download individual tiles or the entire set neatly packed in a ZIP file.",
      icon: "mdi:shape-rectangle-plus",
    },
    {
      title: "8 TensorFlow.js Art Effects",
      description: "Transform photos into pencil and pen sketches, oil paint, cartoon ink, charcoal, pop art, or blueprint styles.",
      icon: "mdi:palette-swatch-outline",
    },
    {
      title: "100% Client-Side Privacy",
      description: "Image processing and AI inference run in your browser. Models download on demand, and your reference photos are not uploaded.",
      icon: "mdi:shield-check-outline",
    },
    {
      title: "Lightning-Fast SvelteKit",
      description: "Built with SvelteKit and TensorFlow.js. Segmentation and recognition models load only when you use those tools.",
      icon: "mdi:flash",
    },
  ];

  onMount(() => {
    runTypewriter();
  });

  onDestroy(() => {
    if (typeTimer) clearTimeout(typeTimer);
  });
</script>

<svelte:head>
  <title>About - Artist Studio & Pro Photo Suite</title>
  <meta
    name="description"
    content="Learn about Artist Studio: a client-side web application featuring reference grids, perspective lines, tile slicing, and stylized artistic effects."
  />
</svelte:head>

<div class="min-h-screen bg-light text-dark flex flex-col selection:bg-primary selection:text-light font-sans">
  <HeaderComponent title="About Studio" />

  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center min-h-[420px] sm:min-h-[480px] flex items-center justify-center overflow-hidden border-b border-secondary/20"
    style="background-image: url('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop');"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />

    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 text-light space-y-5">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-light border border-white/20 backdrop-blur-md shadow-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Professional Artist Toolkit
      </div>

      <h1
        class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white min-h-[3rem] sm:min-h-[4.25rem] leading-tight"
        in:fly={{ y: 25, duration: 450 }}
      >
        {displayedText}
      </h1>

      <p
        class="text-sm sm:text-base lg:text-lg text-light/85 max-w-2xl mx-auto leading-relaxed"
        in:fly={{ y: 25, duration: 450, delay: 150 }}
      >
        Designed to empower traditional painters and digital artists with precision tooling, fast layout grids, and creative photo stylization.
      </p>

      <div class="pt-4 flex flex-wrap items-center justify-center gap-3.5">
        <a
          href="/"
          data-sveltekit-preload-data="hover"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-light text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-lg transition-all focus:outline-none cursor-pointer"
        >
          <span>Open Workspace</span>
          <Icon icon="mdi:arrow-right" class="text-base" />
        </a>
      </div>
    </div>
  </section>

  <!-- Feature Pillars Grid -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
    <div class="max-w-2xl mx-auto text-center space-y-2">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-dark">
        Engineered for Creators
      </h2>
      <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
        Everything you need to plan, sketch, slice, and transform reference materials in one fast, responsive interface.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {#each featureCards as card (card.title)}
        <article
          class="bg-white border border-gray-200 hover:border-primary/60 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
        >
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon icon={card.icon} class="text-2xl" />
            </div>
            <h3 class="text-lg font-bold text-dark tracking-tight group-hover:text-primary transition-colors">
              {card.title}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {card.description}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </main>

  <FooterComponent />
</div>