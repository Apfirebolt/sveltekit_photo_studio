<script lang="ts">
  import Icon from "@iconify/svelte";
  import { fade, fly } from 'svelte/transition';

  type VibeResult = { filterId: string; type?: 'canvas' | 'tensorflow'; score: number };

  let {
    isOpen = $bindable(false),
    imageSrc,
    onApply
  }: {
    isOpen: boolean;
    imageSrc: string;
    onApply: (filterId: string) => Promise<string | null>;
  } = $props();

  let vibeText = $state('');
  let results = $state<VibeResult[]>([]);
  let selectedId = $state<string | null>(null);
  let previewSrc = $state('');
  let isSearching = $state(false);
  let isApplying = $state(false);
  let errorMessage = $state('');

  const applyResult = async (filterId: string) => {
    isApplying = true;
    selectedId = filterId;
    const dataUrl = await onApply(filterId);
    if (dataUrl) {
      previewSrc = dataUrl;
      errorMessage = '';
    } else {
      errorMessage = `Filter "${filterId}" is not available in this studio.`;
    }
    isApplying = false;
  };

  const runSearch = async () => {
    const prompt = vibeText.trim();
    if (!prompt || isSearching) return;

    isSearching = true;
    errorMessage = '';
    results = [];
    try {
      const response = await fetch('/api/vibe-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Vibe search failed.');

      results = data.results ?? [{ filterId: data.filterId, type: data.type, score: data.score ?? 0 }];
      if (results.length > 0) await applyResult(results[0].filterId);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Vibe search failed.';
    } finally {
      isSearching = false;
    }
  };

  const close = () => {
    isOpen = false;
    vibeText = '';
    results = [];
    errorMessage = '';
  };

  $effect(() => {
    if (isOpen) {
      previewSrc = imageSrc;
    }
  });
</script>

<svelte:window onkeydown={(event) => { if (isOpen && event.key === 'Escape') close(); }} />

{#if isOpen}
  <!-- Fixed: Removed max-w-3xl from backdrop so it covers the entire screen correctly -->
  <div transition:fade={{ duration: 200 }} class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation">
    <button type="button" class="absolute inset-0 h-full w-full cursor-default" onclick={close} aria-label="Close vibe search"></button>

    <!-- Fixed: Upgraded inner container size to max-w-3xl with smooth fly-in animation -->
    <div 
      transition:fly={{ y: 20, duration: 300 }}
      class="relative w-full max-w-3xl max-h-[90vh] flex flex-col space-y-4 rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto z-10" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Vibe search"
    >
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 class="flex items-center gap-2 text-sm font-bold text-dark">
          <Icon icon="mdi:auto-fix" class="text-lg text-primary" /> Semantic Vibe Search
        </h3>
        <button type="button" onclick={close} class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200 cursor-pointer" aria-label="Close">
          <Icon icon="mdi:close" class="text-lg" />
        </button>
      </div>

      <!-- Preview Image Box -->
      <div class="relative flex max-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-900">
        <img src={previewSrc} alt="Vibe search preview" class="max-h-[360px] w-auto object-contain" />
        {#if isSearching || isApplying}
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs space-y-2">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p class="text-xs font-semibold text-dark">Processing Vibe Match...</p>
          </div>
        {/if}
      </div>

      <form class="flex gap-2" onsubmit={(event) => { event.preventDefault(); void runSearch(); }}>
        <input
          type="text"
          bind:value={vibeText}
          aria-label="Describe the vibe"
          placeholder="Describe a vibe, e.g. moody cyberpunk neon night or gritty pencil sketch"
          class="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-dark outline-none focus:border-primary focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!vibeText.trim() || isSearching}
          class="rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-light transition hover:bg-primary-dark disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Icon icon="mdi:sparkles" class="text-sm" /> Find Vibe
        </button>
      </form>

      {#if errorMessage}
        <p role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-danger">{errorMessage}</p>
      {/if}

      {#if results.length > 0}
        <div class="space-y-2 pt-2 border-t border-gray-100">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-500">Matching filters ({results.length})</p>
          <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
            {#each results as result, index}
              <button
                type="button"
                onclick={() => applyResult(result.filterId)}
                disabled={isApplying}
                class="rounded-xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer flex items-center gap-2 {selectedId === result.filterId ? 'border-primary bg-primary text-light shadow-xs' : 'border-gray-200 bg-gray-50 text-dark hover:bg-gray-100'}"
              >
                <span>{index === 0 ? '✨ ' : ''}{result.filterId}</span>
                <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/10">{Math.round(result.score * 100)}%</span>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}