<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";

  const headline = "Welcome to Svelte TV Maze";
  let displayedText = "";
  let typeTimer: ReturnType<typeof setTimeout> | null = null;

  const runTypewriter = () => {
    let index = 0;
    const tick = () => {
      if (index < headline.length) {
        displayedText = headline.slice(0, index + 1);
        index++;
        typeTimer = setTimeout(tick, 70);
      }
    };
    tick();
  };

  const featureCards = [
    {
      title: "Comprehensive Directory",
      description: "Access detailed cast line-ups, episode guides, seasonal archives, and television network metadata.",
      icon: "mdi:television-classic",
    },
    {
      title: "Real-Time Broadcasting",
      description: "Stay synchronized with global airing schedules and network premiere timetables.",
      icon: "mdi:calendar-clock-outline",
    },
    {
      title: "Universal Search",
      description: "Filter instantly across titles, genres, creators, cast ensembles, and streaming providers.",
      icon: "mdi:movie-search-outline",
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
  <title>About TV Maze - SvelteKit Explorer</title>
  <meta
    name="description"
    content="Discover your favorite TV shows, streaming series, cast information, and broadcast schedules on TV Maze."
  />
</svelte:head>

<div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-bermuda selection:text-slate-950">
  <HeaderComponent title="About TV Maze" />

  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center min-h-[480px] sm:min-h-[520px] flex items-center justify-center overflow-hidden border-b border-white/10"
    style="background-image: url('https://media.istockphoto.com/id/177339031/photo/space-warp-travel-trough-universe.jpg?s=612x612&w=0&k=20&c=C6U7SHZwUFLxkB-LGPLCdCsaOMmyBodlrBm4lzjT44o=');"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-slate-950 pointer-events-none" />

    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 space-y-5">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-bermuda/10 text-bermuda border border-bermuda/20 backdrop-blur-md shadow-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-bermuda animate-pulse" />
        Open TV & Film Registry
      </div>

      <h1
        class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white min-h-[3rem] sm:min-h-[4.25rem] leading-tight"
        in:fly={{ y: 25, duration: 450 }}
      >
        {displayedText}
      </h1>

      <p
        class="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
        in:fly={{ y: 25, duration: 450, delay: 150 }}
      >
        Discover your favorite movies and more
      </p>

      <div class="pt-4 flex flex-wrap items-center justify-center gap-3.5">
        <a
          href="/shows"
          data-sveltekit-preload-data="hover"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bermuda text-slate-950 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-bermuda/20 hover:brightness-110 active:brightness-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bermuda"
        >
          <span>Explore Shows</span>
          <Icon icon="mdi:arrow-right" class="text-base" />
        </a>
        <a
          href="/schedule"
          data-sveltekit-preload-data="hover"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-bold border border-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span>View Schedule</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Informational Pillars / Platform Overview -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
    <div class="max-w-2xl mx-auto text-center space-y-2">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        Curated Television Intelligence
      </h2>
      <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
        Built on modern web architectures utilizing SvelteKit and the TVmaze REST API ecosystem.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {#each featureCards as card (card.title)}
        <article
          class="bg-slate-900/60 border border-slate-800/80 hover:border-bermuda/40 rounded-2xl p-7 backdrop-blur-md shadow-xl transition-all duration-300 flex flex-col justify-between group"
        >
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-xl bg-bermuda/10 text-bermuda border border-bermuda/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon icon={card.icon} class="text-2xl" />
            </div>
            <h3 class="text-lg font-bold text-white tracking-tight group-hover:text-bermuda transition-colors">
              {card.title}
            </h3>
            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {card.description}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </main>

  <FooterComponent />
</div>