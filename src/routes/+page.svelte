<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import apiClient from "$lib/plugins/interceptor";
  import type { Show, ApiResponse } from "$lib/types/Show";
  import HeaderComponent from "$lib/components/Header.svelte";
  import FooterComponent from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Icon from "@iconify/svelte";

  let searchQuery: string = "";
  let selectedGenre: string = "all";
  let loading: boolean = true;
  let shows: Show[] = [];
  let error: Error | null = null;

  const headline = "Welcome to Svelte Maze";
  let displayedText = "";
  let typeTimer: ReturnType<typeof setTimeout> | null = null;

  const runTypewriter = () => {
    let index = 0;
    const tick = () => {
      if (index < headline.length) {
        displayedText = headline.slice(0, index + 1);
        index++;
        typeTimer = setTimeout(tick, 75);
      }
    };
    tick();
  };

  async function getShows() {
    try {
      loading = true;
      const response: ApiResponse<Show[]> = await apiClient.get<Show[]>("shows");
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      shows = response.data || [];
    } catch (err) {
      error = err instanceof Error ? err : new Error("An unknown error occurred");
    } finally {
      loading = false;
    }
  }

  // Extract unique genres across all TV shows
  $: allGenres = Array.from(
    new Set(shows.flatMap((s) => s.genres || []))
  ).filter(Boolean);

  // Dynamic search & genre filter
  $: filteredShows = shows.filter((show) => {
    const matchesSearch =
      show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (show.summary && show.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedGenre === "all") return matchesSearch;
    return matchesSearch && show.genres?.includes(selectedGenre);
  });

  onMount(() => {
    runTypewriter();
    getShows();
  });

  onDestroy(() => {
    if (typeTimer) clearTimeout(typeTimer);
  });
</script>

<svelte:head>
  <title>TV Maze - Browse Latest TV Shows</title>
  <meta
    name="description"
    content="Explore a collection of the latest shows, including genres, ratings, and more. Find your next favorite TV show here!"
  />
  <meta name="keywords" content="tv maze, movies, sveltekit, streaming, series, entertainment" />
  <meta name="author" content="Amit Prafulla" />
</svelte:head>

<div class="min-h-screen bg-light text-dark flex flex-col selection:bg-primary selection:text-light">
  <HeaderComponent title="TV Shows" />

  <!-- Hero Section -->
  <section
    class="relative bg-cover bg-center min-h-[460px] flex items-center justify-center overflow-hidden border-b border-secondary/20"
    style="background-image: url('https://ntvb.tmsimg.com/assets/p8696131_b_h10_aa.jpg?w=960&h=540');"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />

    <div class="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 text-light space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-light border border-white/20 backdrop-blur-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-light animate-pulse" />
        Curated Television & Film Directory
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
        Discover your favorite series, cast details, ratings, and television schedules.
      </p>

      <!-- Search Input -->
      <div class="pt-2 max-w-md mx-auto">
        <div class="relative">
          <input
            type="search"
            bind:value={searchQuery}
            placeholder="Search by title or summary keywords..."
            class="w-full bg-white/95 text-dark placeholder-gray-500 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm border border-white/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <Icon icon="mdi:magnify" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-base" />
        </div>
      </div>
    </div>
  </section>

  <!-- Genre Filter Ribbon -->
  {#if allGenres.length > 0}
    <div class="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all {selectedGenre === 'all'
            ? 'bg-primary text-light shadow-sm'
            : 'bg-light text-dark hover:bg-gray-200 border border-gray-200'}"
          on:click={() => (selectedGenre = "all")}
        >
          All Genres ({shows.length})
        </button>

        {#each allGenres as genre}
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all {selectedGenre === genre
              ? 'bg-primary text-light shadow-sm'
              : 'bg-light text-dark hover:bg-gray-200 border border-gray-200'}"
            on:click={() => (selectedGenre = genre)}
          >
            {genre}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Main Feed Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
    {#if loading}
      <div class="flex items-center justify-center py-24">
        <Loader />
      </div>
    {:else if error}
      <div class="p-6 text-center bg-white border border-red-200 rounded-2xl shadow-sm max-w-lg mx-auto">
        <p class="text-sm font-semibold text-red-600">Error loading shows: {error.message}</p>
        <button
          type="button"
          class="mt-4 px-4 py-2 bg-primary text-light text-xs font-semibold rounded-lg shadow hover:bg-primary-dark transition"
          on:click={getShows}
        >
          Try Again
        </button>
      </div>
    {:else if filteredShows.length === 0}
      <div class="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-lg mx-auto p-6">
        <p class="text-base font-semibold text-dark">No TV shows found</p>
        <p class="text-xs text-gray-500 mt-1">Try clearing your search query or choosing another genre.</p>
        <button
          type="button"
          class="mt-4 px-4 py-2 bg-primary text-light text-xs font-semibold rounded-lg shadow hover:bg-primary-dark transition"
          on:click={() => {
            searchQuery = "";
            selectedGenre = "all";
          }}
        >
          Reset Filters
        </button>
      </div>
    {:else}
      <!-- Responsive Masonry Layout Columns -->
      <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {#each filteredShows as show (show.id)}
          <article
            class="break-inside-avoid bg-white border border-gray-200 hover:border-gray-300 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            in:fly={{ y: 20, duration: 300 }}
          >
            <!-- Poster Header -->
            <div class="relative aspect-auto overflow-hidden bg-dark/10">
              {#if show.image?.original || show.image?.medium}
                <img
                  src={show.image?.original || show.image?.medium}
                  alt={show.name}
                  loading="lazy"
                  class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
              {:else}
                <div class="h-64 flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4 text-center">
                  <Icon icon="mdi:television-off" class="text-3xl mb-1" />
                  <span class="text-xs font-mono">No Poster Available</span>
                </div>
              {/if}

              <!-- Rating Badge -->
              {#if show.rating?.average}
                <div class="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark/85 text-light backdrop-blur-md text-xs font-bold shadow-md">
                  <Icon icon="mdi:star" class="text-yellow-400 text-sm" />
                  <span>{show.rating.average}</span>
                </div>
              {/if}

              <!-- Status Tag -->
              {#if show.status}
                <div class="absolute top-3 left-3">
                  <span class="px-2.5 py-0.5 rounded-md text-2xs font-bold uppercase tracking-wider bg-primary/90 text-light shadow-sm backdrop-blur-md">
                    {show.status}
                  </span>
                </div>
              {/if}
            </div>

            <!-- Content Details -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <!-- Title & Premiered Date -->
                <div class="flex items-baseline justify-between gap-2 border-b border-gray-100 pb-2 mb-2">
                  <h3 class="text-lg font-bold text-dark tracking-tight group-hover:text-primary transition-colors">
                    {show.name}
                  </h3>
                  {#if show.premiered}
                    <time class="text-2xs font-mono text-gray-500 shrink-0">
                      {new Date(show.premiered).getFullYear()}
                    </time>
                  {/if}
                </div>

                <!-- Genre Tags -->
                {#if show.genres && show.genres.length > 0}
                  <div class="flex flex-wrap gap-1 mb-3">
                    {#each show.genres as genre}
                      <span class="px-2 py-0.5 text-2xs font-semibold bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                        {genre}
                      </span>
                    {/each}
                  </div>
                {/if}

                <!-- Summary -->
                {#if show.summary}
                  <div class="prose prose-slate max-w-none text-xs leading-relaxed text-gray-600 line-clamp-4">
                    {@html show.summary}
                  </div>
                {/if}
              </div>

              <!-- Card Action Row -->
              <div class="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                {#if show.network?.name || show.webChannel?.name}
                  <span class="text-2xs font-mono text-gray-500 truncate max-w-[120px]">
                    {show.network?.name || show.webChannel?.name}
                  </span>
                {:else}
                  <span />
                {/if}

                {#if show.officialSite || show.url}
                  <a
                    href={show.officialSite || show.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark underline"
                  >
                    <span>More Info</span>
                    <Icon icon="mdi:arrow-top-right" class="text-sm" />
                  </a>
                {/if}
              </div>
            </div>
          </article>
        {/each}
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