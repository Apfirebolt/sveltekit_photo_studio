<script lang="ts">
  import Icon from "@iconify/svelte";

  let { rawImageObj, activePreset = 'normal' }: { rawImageObj: HTMLImageElement | null; activePreset?: string } = $props();

  let tfCanvas = $state<HTMLCanvasElement | null>(null);
  let brightness = $state(100);
  let contrast = $state(100);
  let saturation = $state(100);
  
  // New: Individual RGB Channel Sliders (Photoshop style, 0 - 200%, default 100)
  let redChannel = $state(100);
  let greenChannel = $state(100);
  let blueChannel = $state(100);

  let styleIntensity = $state(100);
  let viewMode = $state<'standard' | 'highlights' | 'shadows' | 'heatmap'>('standard');

  let isProcessing = $state(false);
  let isDescribing = $state(false);
  let imageDescription = $state('');
  let modelError = $state('');
  let backgroundMask = $state<Uint8Array | null>(null);
  let renderVersion = 0;
  let bodyPixModel: Awaited<ReturnType<typeof import('@tensorflow-models/body-pix').load>> | null = null;
  let mobilenetModel: Awaited<ReturnType<typeof import('@tensorflow-models/mobilenet').load>> | null = null;
  let previousImage: HTMLImageElement | null = null;

  // Dominant Color Palette State & Color Swapping
  let dominantColors = $state<Array<{ hex: string; count: number }>>([]);
  let copiedHex = $state<string | null>(null);
  let selectedColorToSwap = $state<string | null>(null);
  let replacementColorHex = $state('#3b82f6');

  // Interactive Color Picker State
  let isColorPickerActive = $state(false);
  let sampledColor = $state<{ hex: string; rgb: string } | null>(null);

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  };

  const applyTfCanvasFilters = async () => {
    if (!rawImageObj || !tfCanvas) return;
    const version = ++renderVersion;
    const canvas = tfCanvas;
    canvas.width = rawImageObj.width;
    canvas.height = rawImageObj.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(rawImageObj, 0, 0);

    try {
      const tf = await import('@tensorflow/tfjs');
      await tf.ready();
      const source = tf.browser.fromPixels(canvas, 3).toFloat().div(255) as import('@tensorflow/tfjs').Tensor3D;
      
      const result = tf.tidy(() => {
        let pixels = source.add((brightness - 100) / 100).clipByValue(0, 1);
        pixels = pixels.sub(0.5).mul(contrast / 100).add(0.5).clipByValue(0, 1);
        const gray = pixels.mean(2).expandDims(2) as import('@tensorflow/tfjs').Tensor3D;
        pixels = gray.add(pixels.sub(gray).mul(saturation / 100)).clipByValue(0, 1);

        // Apply Photoshop-style individual RGB channel multipliers
        if (redChannel !== 100 || greenChannel !== 100 || blueChannel !== 100) {
          const rChan = pixels.slice([0, 0, 0], [canvas.height, canvas.width, 1]).mul(redChannel / 100);
          const gChan = pixels.slice([0, 0, 1], [canvas.height, canvas.width, 1]).mul(greenChannel / 100);
          const bChan = pixels.slice([0, 0, 2], [canvas.height, canvas.width, 1]).mul(blueChannel / 100);
          pixels = tf.concat([rChan, gChan, bChan], 2).clipByValue(0, 1);
        }

        const grayAdjusted = pixels.mean(2).expandDims(2) as import('@tensorflow/tfjs').Tensor3D;
        const blurKernel = tf.fill([5, 5, 1, 1], 1 / 25) as unknown as import('@tensorflow/tfjs').Tensor4D;
        const blur = (input: import('@tensorflow/tfjs').Tensor3D): import('@tensorflow/tfjs').Tensor3D =>
          tf.conv2d(input.expandDims(0) as unknown as import('@tensorflow/tfjs').Tensor4D, blurKernel, 1, 'same').squeeze([0]) as import('@tensorflow/tfjs').Tensor3D;
        
        const edgeKernels = [
          tf.tensor4d([-1, 0, 1, -2, 0, 2, -1, 0, 1], [3, 3, 1, 1]),
          tf.tensor4d([-1, -2, -1, 0, 0, 0, 1, 2, 1], [3, 3, 1, 1])
        ];
        const gradients = () => {
          const input = grayAdjusted.expandDims(0) as unknown as import('@tensorflow/tfjs').Tensor4D;
          return tf.sqrt(
            tf.conv2d(input, edgeKernels[0], 1, 'same').square()
              .add(tf.conv2d(input, edgeKernels[1], 1, 'same').square())
          ).squeeze([0]);
        };

        let processed: import('@tensorflow/tfjs').Tensor3D;

        if (viewMode === 'highlights') {
          const mask = grayAdjusted.greater(0.7).toFloat();
          processed = mask.tile([1, 1, 3]);
        } else if (viewMode === 'shadows') {
          const mask = grayAdjusted.less(0.3).toFloat();
          processed = mask.tile([1, 1, 3]);
        } else if (viewMode === 'heatmap') {
          const grad = gradients().mul(3).clipByValue(0, 1);
          processed = tf.stack([grad, tf.onesLike(grad).sub(grad), tf.zerosLike(grad)], 2).squeeze([3]);
        } else {
          if (activePreset === 'sketch') {
            const inverted = tf.onesLike(grayAdjusted).sub(grayAdjusted) as import('@tensorflow/tfjs').Tensor3D;
            const blurred = blur(inverted);
            processed = grayAdjusted.div(tf.onesLike(blurred).sub(blurred).maximum(0.08)).clipByValue(0, 1).tile([1, 1, 3]);
          } else if (activePreset === 'portrait_pencil') {
            const inverted = tf.onesLike(grayAdjusted).sub(grayAdjusted);
            const blurred = blur(inverted);
            const dodge = grayAdjusted.div(tf.onesLike(blurred).sub(blurred).maximum(0.05));
            processed = dodge.mul(1.1).clipByValue(0, 1).tile([1, 1, 3]);
          } else if (activePreset === 'pen') {
            processed = tf.onesLike(grayAdjusted).sub(gradients().mul(3.5).clipByValue(0, 1)).tile([1, 1, 3]);
          } else if (activePreset === 'crosshatch') {
            const grad = gradients().mul(4).clipByValue(0, 1);
            const hatch = tf.sin(grayAdjusted.mul(45)).abs().mul(0.25);
            processed = tf.onesLike(grayAdjusted).sub(grad.add(hatch)).clipByValue(0, 1).tile([1, 1, 3]);
          } else if (activePreset === 'charcoal') {
            const darks = grayAdjusted.pow(1.5).mul(1.2);
            processed = tf.onesLike(darks).sub(gradients().mul(3)).sub(darks).clipByValue(0, 1).tile([1, 1, 3]);
          } else if (activePreset === 'soft_graphite') {
            const blurred = blur(grayAdjusted);
            processed = blurred.sub(gradients().mul(1.2)).clipByValue(0, 1).tile([1, 1, 3]);
          } else if (activePreset === 'oil') {
            const channels = [0, 1, 2].map((channel) =>
              blur(pixels.slice([0, 0, channel], [canvas.height, canvas.width, 1]) as import('@tensorflow/tfjs').Tensor3D)
            );
            processed = tf.concat(channels.map((channel) => channel.mul(6).floor().div(6)), 2);
          } else if (activePreset === 'cartoon' || activePreset === 'comic') {
            const posterized = pixels.mul(5).floor().div(5);
            const lines = gradients().greater(0.16).logicalNot().toFloat();
            processed = posterized.mul(lines.tile([1, 1, 3]));
          } else if (activePreset === 'popart') {
            processed = pixels.mul(5).floor().div(5);
          } else if (activePreset === 'blueprint') {
            processed = tf.stack([
              tf.onesLike(grayAdjusted).mul(0.12),
              grayAdjusted.mul(0.5),
              grayAdjusted.mul(0.9)
            ], 2).squeeze([3]);
          } else {
            processed = pixels;
          }

          const alpha = styleIntensity / 100;
          processed = source.mul(1 - alpha).add(processed.mul(alpha)) as import('@tensorflow/tfjs').Tensor3D;
        }

        if (selectedColorToSwap) {
          const targetRgb = hexToRgb(selectedColorToSwap);
          const replaceRgb = hexToRgb(replacementColorHex);
          const rDiff = processed.slice([0, 0, 0], [canvas.height, canvas.width, 1]).sub(targetRgb.r / 255).abs();
          const gDiff = processed.slice([0, 0, 1], [canvas.height, canvas.width, 1]).sub(targetRgb.g / 255).abs();
          const bDiff = processed.slice([0, 0, 2], [canvas.height, canvas.width, 1]).sub(targetRgb.b / 255).abs();
          const matchMask = rDiff.add(gDiff).add(bDiff).less(0.25).toFloat();
          
          const replacementTensor = tf.tensor1d([replaceRgb.r / 255, replaceRgb.g / 255, replaceRgb.b / 255]).reshape([1, 1, 3]);
          processed = processed.mul(tf.onesLike(matchMask).sub(matchMask).tile([1, 1, 3]))
            .add(replacementTensor.mul(matchMask.tile([1, 1, 3]))) as import('@tensorflow/tfjs').Tensor3D;
        }

        return processed.clipByValue(0, 1) as import('@tensorflow/tfjs').Tensor3D;
      });

      if (version !== renderVersion) {
        source.dispose();
        result.dispose();
        return;
      }
      await tf.browser.toPixels(result, canvas);
      source.dispose();
      result.dispose();

      if (backgroundMask && backgroundMask.length === canvas.width * canvas.height) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let pixel = 0; pixel < backgroundMask.length; pixel++) {
          if (backgroundMask[pixel] === 0) imageData.data[pixel * 4 + 3] = 0;
        }
        ctx.putImageData(imageData, 0, 0);
      }
    } catch (error) {
      modelError = error instanceof Error ? error.message : 'TensorFlow.js could not process this image.';
    }
  };

  const handleCanvasClick = (e: MouseEvent) => {
    if (!isColorPickerActive || !tfCanvas) return;
    const canvas = tfCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;

    sampledColor = { hex, rgb };
  };

  const extractColorPalette = () => {
    if (!rawImageObj) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sampleSize = 100;
    canvas.width = sampleSize;
    canvas.height = (rawImageObj.height / rawImageObj.width) * sampleSize;
    ctx.drawImage(rawImageObj, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorMap: Record<string, number> = {};

    for (let i = 0; i < imgData.length; i += 4) {
      const r = Math.round(imgData[i] / 24) * 24;
      const g = Math.round(imgData[i + 1] / 24) * 24;
      const b = Math.round(imgData[i + 2] / 24) * 24;
      const a = imgData[i + 3];

      if (a < 128) continue;
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      colorMap[hex] = (colorMap[hex] || 0) + 1;
    }

    dominantColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([hex, count]) => ({ hex, count }));
  };

  const copyHexCode = (hex: string) => {
    navigator.clipboard.writeText(hex);
    copiedHex = hex;
    setTimeout(() => copiedHex = null, 1500);
  };

  const removeBackground = async () => {
    if (!rawImageObj) return;
    isProcessing = true;
    modelError = '';
    try {
      const bodyPix = await import('@tensorflow-models/body-pix');
      bodyPixModel ??= await bodyPix.load({ architecture: 'MobileNetV1', outputStride: 16, multiplier: 0.75, quantBytes: 2 });
      const segmentation = await bodyPixModel.segmentPerson(rawImageObj, { internalResolution: 'medium' });
      backgroundMask = segmentation.data;
      await applyTfCanvasFilters();
    } catch (error) {
      modelError = error instanceof Error ? error.message : 'Background removal failed to load.';
    } finally {
      isProcessing = false;
    }
  };

  const describeImage = async () => {
    if (!rawImageObj) return;
    isDescribing = true;
    modelError = '';
    imageDescription = '';
    try {
      const mobilenet = await import('@tensorflow-models/mobilenet');
      mobilenetModel ??= await mobilenet.load();
      const predictions = await mobilenetModel.classify(rawImageObj, 5);
      const labels = predictions.slice(0, 3).map((prediction) => prediction.className);
      imageDescription = labels.length ? `The image likely contains ${labels.join(', ')}.` : 'No recognizable objects found.';
    } catch (error) {
      modelError = error instanceof Error ? error.message : 'Image recognition failed to load.';
    } finally {
      isDescribing = false;
    }
  };

  const downloadFilteredImage = () => {
    if (!tfCanvas) return;
    const link = document.createElement('a');
    const format = backgroundMask ? 'png' : 'jpeg';
    link.download = `tf_studio_${activePreset}.${format === 'png' ? 'png' : 'jpg'}`;
    link.href = tfCanvas.toDataURL(`image/${format}`, 0.95);
    link.click();
  };

  $effect(() => {
    rawImageObj;
    tfCanvas;
    activePreset;
    brightness;
    contrast;
    saturation;
    redChannel;
    greenChannel;
    blueChannel;
    styleIntensity;
    viewMode;
    selectedColorToSwap;
    replacementColorHex;
    backgroundMask;
    if (rawImageObj !== previousImage) {
      previousImage = rawImageObj;
      backgroundMask = null;
      imageDescription = '';
      sampledColor = null;
      selectedColorToSwap = null;
      extractColorPalette();
    }
    void applyTfCanvasFilters();
  });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
  <!-- Controls Sidebar -->
  <div class="w-full lg:col-span-1 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 overflow-y-auto">
    <div class="flex items-center gap-2 border-b border-gray-100 pb-2">
      <Icon icon="mdi:brain" class="text-primary text-lg" />
      <h3 class="font-bold text-sm text-dark">TensorFlow.js Studio Adjustments</h3>
    </div>

    <!-- Advanced Analysis Mode Selector -->
    <div class="space-y-1.5">
      <label class="block text-xs font-bold text-dark">Reference Study View</label>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <button type="button" onclick={() => viewMode = 'standard'} class="p-2 rounded-xl border transition cursor-pointer font-semibold {viewMode === 'standard' ? 'bg-primary text-light border-primary' : 'bg-gray-50 text-gray-700 border-gray-200'}">Standard</button>
        <button type="button" onclick={() => viewMode = 'heatmap'} class="p-2 rounded-xl border transition cursor-pointer font-semibold {viewMode === 'heatmap' ? 'bg-primary text-light border-primary' : 'bg-gray-50 text-gray-700 border-gray-200'}">Edge Heatmap</button>
        <button type="button" onclick={() => viewMode = 'highlights'} class="p-2 rounded-xl border transition cursor-pointer font-semibold {viewMode === 'highlights' ? 'bg-primary text-light border-primary' : 'bg-gray-50 text-gray-700 border-gray-200'}">Highlights</button>
        <button type="button" onclick={() => viewMode = 'shadows'} class="p-2 rounded-xl border transition cursor-pointer font-semibold {viewMode === 'shadows' ? 'bg-primary text-light border-primary' : 'bg-gray-50 text-gray-700 border-gray-200'}">Shadows</button>
      </div>
    </div>

    <!-- Dominant Color Palette & Color Swapper Section -->
    {#if dominantColors.length > 0}
      <div class="space-y-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
        <div class="flex justify-between items-center">
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Top Image Colors</h4>
          {#if copiedHex}
            <span class="text-[10px] font-mono text-emerald-600 font-bold animate-fade">Copied {copiedHex}!</span>
          {/if}
        </div>
        <div class="grid grid-cols-5 gap-2">
          {#each dominantColors as color}
            <button
              type="button"
              onclick={() => {
                copyHexCode(color.hex);
                selectedColorToSwap = color.hex;
              }}
              class="group relative flex flex-col items-center gap-1 cursor-pointer"
              title="Click to copy & select for color swap"
            >
              <div 
                class="w-full aspect-square rounded-lg border-2 {selectedColorToSwap === color.hex ? 'border-primary ring-2 ring-primary/30' : 'border-black/10'} shadow-xs transition-transform group-hover:scale-110" 
                style="background-color: {color.hex};"
              ></div>
              <span class="text-[9px] font-mono text-gray-600 truncate w-full text-center">{color.hex}</span>
            </button>
          {/each}
        </div>

        {#if selectedColorToSwap}
          <div class="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
            <span class="text-[11px] text-gray-600 font-medium truncate">Swap {selectedColorToSwap} with:</span>
            <div class="flex items-center gap-2">
              <input type="color" bind:value={replacementColorHex} class="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0 bg-transparent" />
              <button type="button" onclick={() => selectedColorToSwap = null} class="text-[10px] text-red-500 font-bold hover:underline">Reset</button>
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Color Picker Tool Toggle -->
    <div class="space-y-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-dark flex items-center gap-1.5">
          <Icon icon="mdi:eyedropper" class="text-primary text-base" /> Eyedropper Tool
        </span>
        <button
          type="button"
          onclick={() => isColorPickerActive = !isColorPickerActive}
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer {isColorPickerActive ? 'bg-purple-600 text-white animate-pulse' : 'bg-white text-dark border border-gray-200 hover:bg-gray-100'}"
        >
          {isColorPickerActive ? 'ACTIVE' : 'OFF'}
        </button>
      </div>
      {#if isColorPickerActive}
        <p class="text-[11px] text-purple-600 font-medium">Click anywhere on the preview image to sample color.</p>
      {/if}
    </div>

    <!-- RGB Channel Adjustments Section -->
    <div class="space-y-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
      <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">RGB Channel Mixer</h4>
      
      <div>
        <div class="flex justify-between text-xs font-medium mb-1 text-red-600">
          <span>Red Channel</span><span>{redChannel}%</span>
        </div>
        <input type="range" bind:value={redChannel} min="0" max="200" class="w-full accent-red-500 cursor-pointer" />
      </div>

      <div>
        <div class="flex justify-between text-xs font-medium mb-1 text-green-600">
          <span>Green Channel</span><span>{greenChannel}%</span>
        </div>
        <input type="range" bind:value={greenChannel} min="0" max="200" class="w-full accent-green-500 cursor-pointer" />
      </div>

      <div>
        <div class="flex justify-between text-xs font-medium mb-1 text-blue-600">
          <span>Blue Channel</span><span>{blueChannel}%</span>
        </div>
        <input type="range" bind:value={blueChannel} min="0" max="200" class="w-full accent-blue-500 cursor-pointer" />
      </div>

      {#if redChannel !== 100 || greenChannel !== 100 || blueChannel !== 100}
        <button type="button" onclick={() => { redChannel = 100; greenChannel = 100; blueChannel = 100; }} class="text-[10px] text-red-500 font-bold hover:underline block text-right w-full">Reset RGB</button>
      {/if}
    </div>

    <div>
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
        <span>Style Blend Intensity</span><span>{styleIntensity}%</span>
      </div>
      <input type="range" bind:value={styleIntensity} min="0" max="100" class="w-full accent-primary cursor-pointer" />
    </div>

    <div>
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
        <span>Brightness</span><span>{brightness}%</span>
      </div>
      <input type="range" bind:value={brightness} min="0" max="200" class="w-full accent-primary cursor-pointer" />
    </div>

    <div>
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
        <span>Contrast</span><span>{contrast}%</span>
      </div>
      <input type="range" bind:value={contrast} min="0" max="200" class="w-full accent-primary cursor-pointer" />
    </div>

    <div>
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-600">
        <span>Saturation</span><span>{saturation}%</span>
      </div>
      <input type="range" bind:value={saturation} min="0" max="200" class="w-full accent-primary cursor-pointer" />
    </div>

    <div class="border-t border-gray-100 pt-4 space-y-2">
      <p class="text-xs font-bold text-dark">AI Tools</p>
      <button type="button" onclick={removeBackground} disabled={isProcessing} class="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-dark font-semibold py-2.5 rounded-lg text-xs transition cursor-pointer">
        <Icon icon="mdi:person-crop-circle" />
        {isProcessing ? 'Removing background...' : backgroundMask ? 'Background removed' : 'Remove person background'}
      </button>
      <button type="button" onclick={describeImage} disabled={isDescribing} class="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-dark font-semibold py-2.5 rounded-lg text-xs transition cursor-pointer">
        <Icon icon="mdi:image-text" />
        {isDescribing ? 'Analyzing image...' : 'Describe image'}
      </button>
      {#if imageDescription}
        <p class="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs leading-relaxed text-gray-700">{imageDescription}</p>
      {/if}
      {#if modelError}
        <p role="alert" class="text-xs text-danger">{modelError}</p>
      {/if}
    </div>

    <button type="button" onclick={downloadFilteredImage} class="w-full bg-primary hover:bg-primary-dark text-light font-semibold py-2.5 rounded-lg text-xs shadow transition cursor-pointer mt-4">
      <Icon icon="mdi:download" class="inline-block mr-1" /> Export processed photo
    </button>
  </div>

  <!-- Canvas Preview Area with Sampled Color Footer -->
  <div class="w-full lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-between">
    <div class="w-full flex items-center justify-center overflow-auto bg-gray-100 rounded-xl border border-gray-200 p-2 min-h-[350px] sm:min-h-[460px]">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <canvas 
        bind:this={tfCanvas} 
        onclick={handleCanvasClick}
        class="max-w-full max-h-[460px] object-contain rounded-lg shadow-md {isColorPickerActive ? 'cursor-crosshair ring-2 ring-purple-600' : 'cursor-default'}"
      ></canvas>
    </div>

    <!-- Sampled Color Displayed at the Bottom -->
    <div class="w-full mt-4 bg-gray-50 p-3.5 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold text-gray-600">Sampled Color:</span>
        {#if sampledColor}
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-md border border-black/10 shadow-xs" style="background-color: {sampledColor.hex};"></div>
            <span class="text-xs font-mono font-bold text-dark">{sampledColor.hex}</span>
            <span class="text-[11px] font-mono text-gray-500 hidden sm:inline">({sampledColor.rgb})</span>
          </div>
        {:else}
          <span class="text-xs text-gray-400 italic">Toggle Eyedropper ON and click on image</span>
        {/if}
      </div>

      {#if sampledColor}
        <button
          type="button"
          onclick={() => sampledColor && copyHexCode(sampledColor.hex)}
          class="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-dark font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          Copy HEX
        </button>
      {/if}
    </div>
  </div>
</div>