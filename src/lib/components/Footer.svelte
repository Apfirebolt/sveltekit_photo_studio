<script lang="ts">
  import Icon from "@iconify/svelte";

  export let year: number = new Date().getFullYear();

  const menuItems = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    { name: "Shows", url: "/shows" },
    { name: "People", url: "/people" },
    { name: "Updates", url: "/updates" },
    { name: "Schedule", url: "/schedule" },
  ];

  const socialLinks = [
    { name: "GitHub", url: "https://github.com", icon: "mdi:github" },
    { name: "Twitter / X", url: "https://twitter.com", icon: "mdi:twitter" },
    { name: "TVmaze API", url: "https://www.tvmaze.com/api", icon: "mdi:television-classic" },
  ];
</script>

<footer class="bg-secondary text-white border-t border-white/10 shadow-inner transition-colors">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Top Row: Brand, Navigation, Socials -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
      
      <!-- Brand & Description -->
      <div class="text-center md:text-left space-y-1">
        <a
          href="/"
          class="inline-flex items-center gap-2 text-lg font-black tracking-tight text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-bermuda rounded-xl transition-transform active:scale-95"
        >
          <div class="w-7 h-7 rounded-lg bg-bermuda/20 border border-bermuda/40 flex items-center justify-center text-bermuda">
            <Icon icon="mdi:movie-open-play-outline" class="text-base" />
          </div>
          <span>TV Maze<span class="text-bermuda">.io</span></span>
        </a>
        <p class="text-xs text-white/70 font-mono">
          Powered by the TVmaze Open API
        </p>
      </div>

      <!-- Navigation Links -->
      <nav class="flex flex-wrap justify-center gap-1 sm:gap-2" aria-label="Footer Navigation">
        {#each menuItems as item (item.url)}
          <a
            href={item.url}
            data-sveltekit-preload-data="hover"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bermuda"
          >
            {item.name}
          </a>
        {/each}
      </nav>

      <!-- Social & API Links -->
      <div class="flex items-center gap-2">
        {#each socialLinks as social (social.name)}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-bermuda border border-white/10 hover:border-bermuda/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bermuda"
            aria-label={social.name}
          >
            <Icon icon={social.icon} class="text-lg" />
          </a>
        {/each}
      </div>
    </div>

    <!-- Bottom Row: Copyright & Attribution -->
    <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-white/60 font-mono text-center sm:text-left">
      <p>
        &copy; {year} SvelteKit TV Maze. All rights reserved.
      </p>
      <div class="flex items-center gap-4">
        <span>Data provided by TVmaze.com</span>
        <a
          href="#top"
          class="hover:text-bermuda transition-colors underline underline-offset-2"
        >
          Back to top &uarr;
        </a>
      </div>
    </div>
  </div>
</footer>