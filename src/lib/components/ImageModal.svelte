<script lang="ts">
  import Icon from "@iconify/svelte";

  let { 
    isOpen = $bindable(false), 
    originalSrc, 
    filteredSrc 
  }: { 
    isOpen: boolean; 
    originalSrc: string; 
    filteredSrc: string; 
  } = $props();

  function closeModal() {
    isOpen = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeModal();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <!-- Backdrop Overlay -->
   <!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    onclick={closeModal}
  >
    <!-- Modal Dialog Box -->
    <div 
      class="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:compare" class="text-primary text-xl" />
          <h3 class="font-bold text-sm sm:text-base text-dark">Studio Comparison: Original vs Filtered</h3>
        </div>
        <button 
          onclick={closeModal}
          class="p-2 rounded-xl text-gray-400 hover:text-dark hover:bg-gray-100 transition cursor-pointer"
        >
          <Icon icon="mdi:close" class="text-xl" />
        </button>
      </div>

      <!-- Modal Body (Side-by-Side Comparison Grid) -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto bg-gray-50 flex-1">
        
        <!-- Original Image Card -->
        <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center">
          <span class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 font-mono">Original Reference</span>
          <div class="w-full h-[360px] flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
            <img src={originalSrc} alt="Original" class="max-h-full max-w-full object-contain" />
          </div>
        </div>

        <!-- Filtered Image Card -->
        <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center">
          <span class="text-xs font-bold uppercase tracking-wider text-primary mb-2 font-mono">Processed Studio Master</span>
          <div class="w-full h-[360px] flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
            <img src={filteredSrc} alt="Filtered" class="max-h-full max-w-full object-contain" />
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-100 flex justify-end bg-white">
        <button 
          onclick={closeModal}
          class="px-5 py-2.5 bg-dark hover:bg-black text-light font-semibold rounded-xl text-xs transition cursor-pointer"
        >
          Close Preview
        </button>
      </div>
    </div>
  </div>
{/if}