<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  // Accept raw image element and preset choice from parent
  let { rawImageObj, activePreset = 'normal' }: { rawImageObj: HTMLImageElement | null; activePreset?: string } = $props();

  let tfCanvas = $state<HTMLCanvasElement | null>(null);
  let brightness = $state(100);
  let contrast = $state(100);
  let saturation = $state(100);

  const applyTfCanvasFilters = () => {
    if (!rawImageObj || !tfCanvas) return;
    const canvas = tfCanvas;
    canvas.width = rawImageObj.width;
    canvas.height = rawImageObj.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simulated TensorFlow-accelerated / Canvas Convolution Pipelines
    if (activePreset === 'sketch') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(100%) invert(100%) blur(3px)`;
      ctx.drawImage(rawImageObj, 0, 0);
      ctx.globalCompositeOperation = 'color-dodge';
      ctx.filter = `grayscale(100%) brightness(${brightness}%)`;
      ctx.drawImage(rawImageObj, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    } else if (activePreset === 'comic') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast + 50}%) saturate(${saturation + 40}%)`;
      ctx.drawImage(rawImageObj, 0, 0);
    } else if (activePreset === 'charcoal') {
      ctx.filter = `brightness(${brightness - 10}%) contrast(${contrast + 60}%) grayscale(100%) blur(1px)`;
      ctx.drawImage(rawImageObj, 0, 0);
    } else if (activePreset === 'popart') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast + 30}%) saturate(${saturation + 80}%)`;
      ctx.drawImage(rawImageObj, 0, 0);
    } else if (activePreset === 'blueprint') {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast + 20}%) grayscale(100%) invert(100%) hue-rotate(180deg)`;
      ctx.drawImage(rawImageObj, 0, 0);
    } else {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(rawImageObj, 0, 0);
      ctx.filter = 'none';
    }
  };

  const downloadFilteredImage = () => {
    if (!tfCanvas) return;
    const link = document.createElement('a');
    link.download = `tf_studio_${activePreset}.jpg`;
    link.href = tfCanvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  $effect(() => {
    if (rawImageObj && tfCanvas) {
      applyTfCanvasFilters();
    }
  });

  onMount(() => {
    applyTfCanvasFilters();
  });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Controls Sidebar -->
  <div class="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
    <div class="flex items-center gap-2 border-b border-gray-100 pb-2">
      <Icon icon="mdi:brain" class="text-primary text-lg" />
      <h3 class="font-bold text-sm text-dark">Tensor Engine Adjustments</h3>
    </div>

    <div>
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
        <span>Tensor Brightness</span><span>{brightness}%</span>
      </div>
      <input type="range" bind:value={brightness} min="0" max="200" oninput={applyTfCanvasFilters} class="w-full accent-primary cursor-pointer" />
    </div>

    <div>
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
        <span>Tensor Contrast</span><span>{contrast}%</span>
      </div>
      <input type="range" bind:value={contrast} min="0" max="200" oninput={applyTfCanvasFilters} class="w-full accent-primary cursor-pointer" />
    </div>

    <div>
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
        <span>Tensor Saturation</span><span>{saturation}%</span>
      </div>
      <input type="range" bind:value={saturation} min="0" max="200" oninput={applyTfCanvasFilters} class="w-full accent-primary cursor-pointer" />
    </div>

    <button onclick={downloadFilteredImage} class="w-full bg-primary hover:bg-primary-dark text-light font-semibold py-2.5 rounded-xl text-xs shadow transition cursor-pointer mt-4">
      💾 Export Tensor Processed Photo
    </button>
  </div>

  <!-- Canvas Preview Area -->
  <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center min-h-[500px]">
    <canvas bind:this={tfCanvas} class="max-w-full max-h-[520px] object-contain rounded-xl shadow-md border border-gray-200"></canvas>
  </div>
</div>