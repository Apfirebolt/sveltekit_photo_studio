<script lang="ts">
  import Icon from "@iconify/svelte";

  type VibeResult = { filterId: string; type?: 'canvas' | 'tensorflow'; score: number };

  let {
    isOpen = $bindable(false),
    imageSrc,
    onApply
  }: {
    isOpen: boolean;
    imageSrc: string;
    // Applies the filter and resolves to the processed preview data URL, or null if the filter is unknown.
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
    const userVibe = vibeText.trim();
    if (!userVibe || isSearching) return;

    isSearching = true;
    errorMessage = '';
    results = [];
    try {
      const response = await fetch('/api/vibe-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userVibe })
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
  };

  $effect(() => {
    if (isOpen) previewSrc = imageSrc;
  });
</script>

<svelte:window onkeydown={(event) => { if (isOpen && event.key === 'Escape') close(); }} />

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation">
    <button type="button" class="absolute inset-0 h-full w-full cursor-default" onclick={close} aria-label="Close vibe search"></button>

    <div class="relative w-full max-w-xl space-y-4 rounded-3xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-label="Vibe search">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 class="flex items-center gap-2 text-sm font-bold text-dark">
          <Icon icon="mdi:auto-fix" class="text-lg text-primary" /> Vibe Search
        </h3>
        <button type="button" onclick={close} class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200 cursor-pointer" aria-label="Close">
          <Icon icon="mdi:close" class="text-lg" />
        </button>
      </div>

      <div class="relative flex max-h-80 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
        <img src={previewSrc} alt="Vibe search preview" class="max-h-80 w-auto object-contain" />
        {#if isSearching || isApplying}
          <div class="absolute inset-0 flex items-center justify-center bg-white/70">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        {/if}
      </div>

      <form class="flex gap-2" onsubmit={(event) => { event.preventDefault(); void runSearch(); }}>
        <input
          type="text"
          bind:value={vibeText}
          aria-label="Describe the vibe"
          placeholder="Describe a vibe, e.g. moody retro film"
          class="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-dark"
        />
        <button
          type="submit"
          disabled={!vibeText.trim() || isSearching}
          class="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-light transition hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
        >
          OK
        </button>
      </form>

      {#if errorMessage}
        <p role="alert" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-danger">{errorMessage}</p>
      {/if}

      {#if results.length > 0}
        <div class="space-y-2">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-500">Matching filters ({results.length})</p>
          <div class="flex flex-wrap gap-2">
            {#each results as result, index}
              <button
                type="button"
                onclick={() => applyResult(result.filterId)}
                disabled={isApplying}
                class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer {selectedId === result.filterId ? 'border-primary bg-primary text-light' : 'border-gray-200 bg-gray-50 text-dark hover:bg-gray-100'}"
              >
                {index === 0 ? 'Best: ' : ''}{result.filterId}
                <span class="font-mono text-[10px] opacity-70">{Math.round(result.score * 100)}%</span>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
