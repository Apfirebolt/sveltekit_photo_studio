<script lang="ts">
  import Icon from "@iconify/svelte";

  let year: number = new Date().getFullYear();

  const studioLinks = [
    { name: "Reference Grid", url: "#", icon: "mdi:grid" },
    { name: "Custom Lines", url: "#", icon: "mdi:vector-line" },
    { name: "Tile Slicer", url: "#", icon: "mdi:shape-rectangle-plus" },
    { name: "Photo Editor", url: "#", icon: "mdi:palette-swatch-outline" },
    { name: "Bulk Handler", url: "#", icon: "mdi:file-multiple-outline" },
    { name: "AI Filters", url: "#", icon: "mdi:auto-fix" },
  ];

  const socialLinks = [
    { name: "GitHub Repository", url: "https://github.com", icon: "mdi:github" },
    { name: "Documentation", url: "#", icon: "mdi:book-open-page-variant-outline" },
    { name: "Privacy Notice", url: "#", icon: "mdi:shield-check-outline" },
  ];
</script>

<footer class="bg-dark text-light border-t border-secondary/20 transition-colors mt-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Top Row: Brand, Studio Links, Socials -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-white/10 items-center">
      
      <!-- Brand & Description -->
      <div class="text-center md:text-left space-y-2">
        <a
          href="/"
          class="inline-flex items-center gap-2.5 text-lg font-black tracking-tight text-white focus:outline-none rounded-xl transition-transform active:scale-95"
        >
          <div class="w-8 h-8 rounded-xl bg-primary/20 border border-success flex items-center justify-center text-success shadow-xs">
            <Icon icon="mdi:drawing-box" class="text-lg" />   
          </div>
          <span>Softgenie <span class="text-success"> Studio</span></span>
        </a>
        <p class="text-xs text-light/70 font-sans max-w-sm">
          A high-performance, client-side browser studio combining reference grids, bulk file handling, 200+ advanced filters, AI-powered enhancements, and 300+ curated artistic styles.
        </p>
      </div>

      <!-- Studio Navigation Links -->
      <nav class="flex flex-wrap justify-center gap-2" aria-label="Footer Navigation">
        {#each studioLinks as item (item.name)}
          <a
            href={item.url}
            class="px-3.5 py-2 rounded-xl text-xs font-semibold text-light/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 border border-white/5"
          >
            <Icon icon={item.icon} class="text-sm text-success" />
            <span>{item.name}</span>
          </a>
        {/each}
      </nav>

      <!-- External & Social Icons -->
      <div class="flex items-center justify-center md:justify-end gap-3">
        {#each socialLinks as social (social.name)}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-light/80 hover:text-success border border-white/10 hover:border-success/40 transition-all"
            aria-label={social.name}
          >
            <Icon icon={social.icon} class="text-lg" />
          </a>
        {/each}
      </div>
    </div>

    <!-- Bottom Row: Copyright & Back to Top -->
    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-light text-center sm:text-left">
      <p>
        &copy; {year} Softgenie Studio.
      </p>
      <div class="flex items-center gap-6">
        <a
          href="#top"
          class="hover:text-success transition-colors underline underline-offset-4"
        >
          Back to top &uarr;
        </a>
      </div>
    </div>
  </div>
</footer>