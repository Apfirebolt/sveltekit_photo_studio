<script lang="ts">
  import Icon from "@iconify/svelte";
  import { page } from "$app/stores";

  export let title: string = "TV Maze";

  const menuItems = [
    { name: "Home", url: "/", icon: "mdi:home-variant-outline" },
    { name: "About", url: "/about", icon: "mdi:information-outline" },
    { name: "Shows", url: "/shows", icon: "mdi:television-classic" },
    { name: "People", url: "/people", icon: "mdi:account-group-outline" },
    { name: "Updates", url: "/updates", icon: "mdi:bell-badge-outline" },
    { name: "Schedule", url: "/schedule", icon: "mdi:calendar-clock-outline" },
  ];

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }
  }

  function closeMenu() {
    isMenuOpen = false;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && isMenuOpen) {
      closeMenu();
    }
  }

  const isItemActive = (currentPath: string, targetUrl: string) => {
    if (targetUrl === "/") return currentPath === "/";
    return currentPath.startsWith(targetUrl);
  };
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<header class="sticky top-0 z-40 bg-secondary/95 backdrop-blur-md border-b border-white/10 text-white shadow-md transition-all duration-200">
  <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
    
    <!-- Brand / Title -->
    <a
      href="/"
      class="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-bermuda rounded-xl transition-transform active:scale-95"
      aria-label="{title} Home"
    >
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-bermuda flex items-center justify-center text-white shadow-md shadow-primary/30 border border-white/20">
        <Icon icon="mdi:movie-open-play-outline" class="text-xl" />
      </div>
      <span class="text-xl font-black tracking-tight text-white">
        {title}<span class="text-bermuda">.io</span>
      </span>
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
      {#each menuItems as item (item.url)}
        {@const active = isItemActive($page.url.pathname, item.url)}
        <a
          href={item.url}
          data-sveltekit-preload-data="hover"
          class="relative px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-bermuda flex items-center gap-1.5 {active
            ? 'text-dark bg-bermuda shadow-md shadow-bermuda/25 font-extrabold'
            : 'text-white/80 hover:text-white hover:bg-white/10'}"
          aria-current={active ? "page" : undefined}
        >
          <Icon icon={item.icon} class="text-sm {active ? 'text-dark' : 'text-white/60'}" />
          <span>{item.name}</span>
        </a>
      {/each}
    </nav>

    <!-- Mobile Hamburger Toggle -->
    <button
      type="button"
      class="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 active:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-bermuda transition-colors"
      on:click={toggleMenu}
      aria-label="Toggle navigation menu"
      aria-expanded={isMenuOpen}
      aria-controls="mobile-navigation-drawer"
    >
      <Icon icon="mdi:menu" class="text-2xl" />
    </button>
  </div>
</header>

<!-- Mobile Navigation Backdrop Overlay -->
{#if isMenuOpen}
  <button
    type="button"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden w-full h-full border-none cursor-default focus:outline-none"
    aria-label="Close mobile navigation overlay"
    tabindex="-1"
    on:click={closeMenu}
  />
{/if}

<!-- Mobile Navigation Slide-Over Drawer -->
<aside
  id="mobile-navigation-drawer"
  class="fixed top-0 right-0 z-50 h-full w-4/5 max-w-xs bg-primary text-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden"
  class:translate-x-0={isMenuOpen}
  class:translate-x-full={!isMenuOpen}
  role="dialog"
  aria-modal="true"
  aria-label="Mobile Navigation"
>
  <!-- Drawer Header -->
  <div class="flex items-center justify-between p-5 border-b border-white/10">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-lg bg-bermuda/20 border border-bermuda/40 flex items-center justify-center text-bermuda">
        <Icon icon="mdi:movie-open-play-outline" class="text-base" />
      </div>
      <span class="text-sm font-bold tracking-tight text-white">{title}</span>
    </div>
    <button
      type="button"
      class="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
      on:click={closeMenu}
      aria-label="Close navigation drawer"
    >
      <Icon icon="mdi:close" class="text-xl" />
    </button>
  </div>

  <!-- Drawer Links -->
  <nav class="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile Menu Links">
    <ul class="space-y-2">
      {#each menuItems as item (item.url)}
        {@const active = isItemActive($page.url.pathname, item.url)}
        <li>
          <a
            href={item.url}
            data-sveltekit-preload-data="hover"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all {active
              ? 'bg-bermuda text-dark shadow-md shadow-bermuda/20'
              : 'bg-white/5 text-white/90 hover:bg-white/10 hover:text-bermuda border border-white/5'}"
            aria-current={active ? "page" : undefined}
            on:click={closeMenu}
          >
            <div class="flex items-center gap-3">
              <Icon icon={item.icon} class="text-lg {active ? 'text-dark' : 'text-white/60'}" />
              <span>{item.name}</span>
            </div>
            <Icon icon="mdi:chevron-right" class="text-base {active ? 'text-dark' : 'text-white/40'}" />
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Drawer Footer -->
  <div class="p-4 border-t border-white/10 text-center text-2xs text-white/60 font-mono">
    &copy; {new Date().getFullYear()} {title}
  </div>
</aside>

<style>
  .translate-x-0 {
    transform: translateX(0);
  }
  .translate-x-full {
    transform: translateX(100%);
  }
</style>