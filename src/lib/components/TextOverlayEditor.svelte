<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TextOverlay } from '$lib/utils/overlays';
  import { FONT_OPTIONS } from '$lib/utils/overlays';

  export let overlays: TextOverlay[] = [];
  export let activeId: string | null = null;

  const dispatch = createEventDispatcher();

  const setActive = (id: string) => dispatch('setActive', { id });
  const add = () => dispatch('add');
  const remove = (id: string) => dispatch('remove', { id });
  const update = (id: string, patch: Partial<TextOverlay>) => dispatch('update', { id, patch });
</script>

{#if overlays.length === 0}
  <div class="text-center text-sm text-gray-400 italic">No text layers — add one to begin.</div>
{:else}
  <div class="space-y-3">
    <div class="flex items-center gap-2 overflow-x-auto pb-1">
      {#each overlays as overlay, i}
        <button
          type="button"
          on:click={() => setActive(overlay.id)}
          class="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer"
          class:selected={activeId === overlay.id}
        >
          Text #{i + 1}
        </button>
      {/each}
      <button type="button" on:click={add} class="px-2 py-1 ml-2 bg-primary text-white rounded">Add</button>
    </div>

    {#if activeId}
      {@const active = overlays.find(o => o.id === activeId)}
      {#if active}
        <div class="space-y-2.5 pt-2 border-t border-gray-200">
          <div>
            <label for="overlay-content" class="block text-xs font-bold text-gray-600 mb-1">Content</label>
            <input
              id="overlay-content"
              type="text"
              value={active.text}
              on:input={(e) => update(active.id, { text: (e.target as HTMLInputElement).value })}
              class="w-full px-3 py-1.5 bg-white border rounded text-sm"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="overlay-font" class="block text-xs font-bold text-gray-600 mb-1">Font Family</label>
              <select
                id="overlay-font"
                value={active.fontFamily}
                on:change={(e) => update(active.id, { fontFamily: (e.target as HTMLSelectElement).value })}
                class="w-full p-1.5 bg-white border rounded text-sm"
              >
                {#each FONT_OPTIONS as font}
                  <option value={font}>{font}</option>
                {/each}
              </select>
            </div>

            <div>
              <label for="overlay-size" class="block text-xs font-bold text-gray-600 mb-1">Font Size</label>
              <div class="flex items-center gap-2">
                <input
                  id="overlay-size"
                  type="range"
                  min="8"
                  max="400"
                  value={active.fontSize}
                  on:input={(e) => update(active.id, { fontSize: Number((e.target as HTMLInputElement).value) })}
                  class="w-full"
                />
                <input
                  type="number"
                  min="8"
                  max="400"
                  value={active.fontSize}
                  on:input={(e) => update(active.id, { fontSize: Number((e.target as HTMLInputElement).value) })}
                  class="w-16 p-1 border rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <label for="overlay-color" class="text-xs font-bold text-gray-600">Text Color</label>
              <input id="overlay-color" type="color" value={active.color} on:input={(e) => update(active.id, { color: (e.target as HTMLInputElement).value })} />
            </div>

            <label class="flex items-center gap-1">
              <input type="checkbox" checked={active.isBold} on:change={(e) => update(active.id, { isBold: (e.target as HTMLInputElement).checked })} /> Bold
            </label>

            <label class="flex items-center gap-1">
              <input type="checkbox" checked={active.isItalic} on:change={(e) => update(active.id, { isItalic: (e.target as HTMLInputElement).checked })} /> Italic
            </label>

            <label class="flex items-center gap-1">
              <input type="checkbox" checked={active.hasBackground} on:change={(e) => update(active.id, { hasBackground: (e.target as HTMLInputElement).checked })} /> Box
            </label>

            <button type="button" on:click={() => remove(active.id)} class="text-red-600 px-2 py-1 bg-red-50 rounded">Delete</button>
          </div>

          <!-- Shadows / stroke / inner shadow -->
          <div class="space-y-2 pt-2 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 text-xs"><input type="checkbox" checked={active.shadowEnabled} on:change={(e) => update(active.id, { shadowEnabled: (e.target as HTMLInputElement).checked })} /> Drop Shadow</label>
              <input type="color" value={active.shadowColor} on:input={(e) => update(active.id, { shadowColor: (e.target as HTMLInputElement).value })} />
            </div>
            {#if active.shadowEnabled}
              <div class="grid grid-cols-3 gap-2 text-xs">
                <label class="flex flex-col">Blur <input type="range" min="0" max="50" value={active.shadowBlur} on:input={(e) => update(active.id, { shadowBlur: Number((e.target as HTMLInputElement).value) })} /></label>
                <label class="flex flex-col">X <input type="range" min="-30" max="30" value={active.shadowOffsetX} on:input={(e) => update(active.id, { shadowOffsetX: Number((e.target as HTMLInputElement).value) })} /></label>
                <label class="flex flex-col">Y <input type="range" min="-30" max="30" value={active.shadowOffsetY} on:input={(e) => update(active.id, { shadowOffsetY: Number((e.target as HTMLInputElement).value) })} /></label>
              </div>
            {/if}

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 text-xs"><input type="checkbox" checked={active.strokeEnabled} on:change={(e) => update(active.id, { strokeEnabled: (e.target as HTMLInputElement).checked })} /> Stroke</label>
              <input type="color" value={active.strokeColor} on:input={(e) => update(active.id, { strokeColor: (e.target as HTMLInputElement).value })} />
            </div>
            {#if active.strokeEnabled}
              <label class="block text-xs">Width <input type="range" min="1" max="40" value={active.strokeWidth} on:input={(e) => update(active.id, { strokeWidth: Number((e.target as HTMLInputElement).value) })} /></label>
            {/if}

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 text-xs"><input type="checkbox" checked={active.innerShadowEnabled} on:change={(e) => update(active.id, { innerShadowEnabled: (e.target as HTMLInputElement).checked })} /> Inner Shadow</label>
              <input type="color" value={active.innerShadowColor} on:input={(e) => update(active.id, { innerShadowColor: (e.target as HTMLInputElement).value })} />
            </div>
            {#if active.innerShadowEnabled}
              <div class="grid grid-cols-3 gap-2 text-xs">
                <label class="flex flex-col">Blur <input type="range" min="0" max="30" value={active.innerShadowBlur} on:input={(e) => update(active.id, { innerShadowBlur: Number((e.target as HTMLInputElement).value) })} /></label>
                <label class="flex flex-col">X <input type="range" min="-20" max="20" value={active.innerShadowOffsetX} on:input={(e) => update(active.id, { innerShadowOffsetX: Number((e.target as HTMLInputElement).value) })} /></label>
                <label class="flex flex-col">Y <input type="range" min="-20" max="20" value={active.innerShadowOffsetY} on:input={(e) => update(active.id, { innerShadowOffsetY: Number((e.target as HTMLInputElement).value) })} /></label>
              </div>
            {/if}
          </div>

          <!-- Blend / mask -->
          <div class="space-y-2 pt-2 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <label for="blend-mode" class="block text-xs font-bold text-gray-600 mb-1">Blend Mode</label>
              <select id="blend-mode" value={active.blendMode} on:change={(e) => update(active.id, { blendMode: (e.target as HTMLSelectElement).value })} class="p-1 text-sm">
                <option value="source-over">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="lighter">Additive</option>
                <option value="darken">Darken</option>
                <option value="lighten">Lighten</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 text-xs"><input type="checkbox" checked={active.maskEnabled} on:change={(e) => update(active.id, { maskEnabled: (e.target as HTMLInputElement).checked })} /> Mask Fill</label>
              <input type="color" value={active.maskColor} on:input={(e) => update(active.id, { maskColor: (e.target as HTMLInputElement).value })} />
            </div>
          </div>

        </div>
      {/if}
    {/if}
  </div>
{/if}

<style>
  :global(button[selected]){
    background:var(--color-primary, #6366f1);
    color: white;
  }
</style>
