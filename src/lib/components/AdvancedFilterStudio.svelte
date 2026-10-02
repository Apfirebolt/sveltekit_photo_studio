<script lang="ts">
  import { onMount } from "svelte";
  import * as tf from "@tensorflow/tfjs";
  import Icon from "@iconify/svelte";
  import ImageModal from "$lib/components/ImageModal.svelte";

  let { rawImageObj }: { rawImageObj: HTMLImageElement | null } = $props();

  let previewCanvas = $state<HTMLCanvasElement | null>(null);
  let activeFilterId = $state<string>('normal');
  let isProcessing = $state(false);
  let engineType = $state<'canvas' | 'tensorflow'>('canvas');
  let showOriginal = $state(false);

  let isModalOpen = $state(false);
  let filteredDataUrl = $state('');

  let exportFormat = $state<'jpeg' | 'png' | 'pdf'>('jpeg');
  let compressionQuality = $state(90);

  // Pro Adjustment Sliders
  let brightness = $state(100); // 0% to 200%
  let contrast = $state(100);   // 0% to 200%
  let saturation = $state(100); // 0% to 200%
  let hueRotate = $state(0);    // 0deg to 360deg
  let blurAmount = $state(0);   // 0px to 10px

  const filterCategories = [
    {
      name: "Precision Pencil & Pen Sketches",
      filters: [
        { id: 'sketch_outline', name: '✏️ TF Clean Line Outlines', type: 'tensorflow' },
        { id: 'sketch_minimal', name: '🖋️ TF Minimalist Contours', type: 'tensorflow' },
        { id: 'sketch_graphite', name: '📝 Soft Graphite Pencil', type: 'canvas', css: 'grayscale(100%) contrast(140%) brightness(110%) blur(0.5px)' },
        { id: 'sketch_crosshatch', name: '✒️ Fine Ink Pen & Hatch', type: 'canvas', css: 'grayscale(100%) contrast(220%) brightness(95%) invert(15%)' },
        { id: 'sketch_charcoal', name: '🪵 Deep Charcoal Sketch', type: 'canvas', css: 'grayscale(100%) contrast(250%) brightness(85%) blur(0.8px)' }
      ]
    },
    {
      name: "Professional Studio & Retouch",
      filters: [
        { id: 'normal', name: '🌟 Original Studio', type: 'canvas', css: 'none' },
        { id: 'studio_soft', name: '✨ Soft Portrait Glow', type: 'canvas', css: 'brightness(105%) contrast(95%) blur(0.3px) saturate(105%)' },
        { id: 'studio_crisp', name: '💎 High Definition Edge', type: 'canvas', css: 'contrast(135%) saturate(110%) brightness(102%)' },
        { id: 'matte_film', name: '🎞️️ Matte Cinematic Film', type: 'canvas', css: 'contrast(90%) brightness(105%) saturate(85%) sepia(15%)' },
        { id: 'rich_shadows', name: '🌑 Rich Shadow Balance', type: 'canvas', css: 'contrast(120%) brightness(95%) saturate(115%)' },
        { id: 'studio_clarity', name: '🔍 Ultra Clarity & Definition', type: 'canvas', css: 'contrast(150%) saturate(120%) brightness(105%)' },
        { id: 'warm_glow', name: '🌅 Golden Hour Radiance', type: 'canvas', css: 'sepia(35%) brightness(110%) saturate(140%)' },
        { id: 'cool_shadow', name: '🧊 Deep Frost Balance', type: 'canvas', css: 'hue-rotate(190deg) saturate(90%) contrast(110%)' }
      ]
    },
    {
      name: "Cinematic & Film Grades",
      filters: [
        { id: 'cinematic_teal_orange', name: '🎬 Hollywood Teal & Orange', type: 'canvas', css: 'contrast(125%) saturate(150%) hue-rotate(15deg)' },
        { id: 'cinematic_noir', name: '🕵️ Classic Noir Drama', type: 'canvas', css: 'grayscale(100%) contrast(190%) brightness(85%)' },
        { id: 'vintage_retro', name: '📻 70s Warm Retro Film', type: 'canvas', css: 'sepia(50%) contrast(90%) brightness(110%) saturate(80%)' },
        { id: 'cyberpunk_neon', name: '⚡ Cyberpunk Neon Glow', type: 'canvas', css: 'saturate(250%) contrast(140%) hue-rotate(280deg)' },
        { id: 'bleach_bypass', name: '🧪 Bleach Bypass Silver', type: 'canvas', css: 'grayscale(60%) contrast(170%) brightness(110%)' },
        { id: 'cross_process', name: '🧪 Cross Processed Film', type: 'canvas', css: 'saturate(180%) hue-rotate(330deg) contrast(120%)' },
        { id: 'cinematic_moody', name: '🌧️ Moody Cinematic Blue', type: 'canvas', css: 'sepia(20%) hue-rotate(210deg) contrast(130%) brightness(90%)' }
      ]
    },
    {
      name: "Light, Tone & Color Grades",
      filters: [
        { id: 'bright', name: '☀️ High Key / Bright', type: 'canvas', css: 'brightness(125%) contrast(90%)' },
        { id: 'moody', name: '🌙 Moody Shadow', type: 'canvas', css: 'brightness(80%) contrast(130%)' },
        { id: 'sepia', name: '📜 Antique Sepia', type: 'canvas', css: 'sepia(90%) contrast(110%)' },
        { id: 'grayscale', name: '🖤 Classic Grayscale', type: 'canvas', css: 'grayscale(100%) contrast(110%)' },
        { id: 'invert', name: '🔄 Negative Invert', type: 'canvas', css: 'invert(100%)' },
        { id: 'warm', name: '🔥 Warm Sunset', type: 'canvas', css: 'sepia(40%) saturate(150%) hue-rotate(-20deg)' },
        { id: 'cool', name: '❄️ Arctic Frost', type: 'canvas', css: 'saturate(80%) hue-rotate(180deg) brightness(110%)' },
        { id: 'fade', name: '📻 Vintage Fade', type: 'canvas', css: 'contrast(85%) brightness(110%) saturate(70%)' },
        { id: 'vivid', name: '🎨 Vibrant Pop', type: 'canvas', css: 'saturate(180%) contrast(115%)' },
        { id: 'solarize', name: '☀ Solarized Contrast', type: 'canvas', css: 'invert(80%) contrast(200%)' },
        { id: 'posterize_css', name: '🎨 Color Posterization', type: 'canvas', css: 'contrast(300%) saturate(200%)' }
      ]
    },
    {
      name: "Stylized & Artistic FX",
      filters: [
        { id: 'comic', name: '💥 Comic Book Ink', type: 'canvas', css: 'contrast(200%) saturate(200%)' },
        { id: 'matrix', name: '💻 Matrix Terminal', type: 'canvas', css: 'grayscale(100%) sepia(100%) hue-rotate(70deg) saturate(300%)' },
        { id: 'dramatic', name: '⚡ Dramatic HDR', type: 'canvas', css: 'contrast(150%) saturate(130%)' },
        { id: 'pastel', name: '🌸 Soft Pastel', type: 'canvas', css: 'brightness(110%) saturate(60%) contrast(90%)' },
        { id: 'lomo', name: '🎞️ Lomo Vignette Effect', type: 'canvas', css: 'contrast(140%) saturate(160%) brightness(105%)' },
        { id: 'dreamy_glow', name: '☁️ Ethereal Dream Glow', type: 'canvas', css: 'brightness(120%) blur(0.5px) saturate(80%)' },
        { id: 'pop_art_pink', name: '💖 Pop Art Magenta Pop', type: 'canvas', css: 'saturate(300%) hue-rotate(300deg) contrast(150%)' }
      ]
    },
    {
      name: "Neural & Tensor Matrix (TensorFlow.js)",
      filters: [
        { id: 'tf_edge', name: '🧠 TF Sobel Edge Tensor', type: 'tensorflow' },
        { id: 'tf_luminance', name: '📐 TF Neural Luminance Matrix', type: 'tensorflow' },
        { id: 'tf_deepinvert', name: '🔬 TF Deep Channel Inversion', type: 'tensorflow' },
        { id: 'tf_normalize', name: '⚡ TF Dynamic Range Normalization', type: 'tensorflow' },
        { id: 'tf_cartoon', name: '🎨 TF Cartoon Stylization', type: 'tensorflow' },
        { id: 'tf_style', name: '🎨 TF Painterly Color Blocks', type: 'tensorflow' },
        { id: 'tf_deepdream', name: '🌌 TF Multi-Scale Dream Texture', type: 'tensorflow' },
        { id: 'tf_solarize', name: '☀️ TF Neural Solarizer', type: 'tensorflow' },
        { id: 'tf_emboss', name: '🗿 TF Laplacian Emboss', type: 'tensorflow' },
        { id: 'tf_sharpen', name: '🔪 TF High-Pass Sharpen Matrix', type: 'tensorflow' },
        { id: 'tf_thermal', name: '🌡️ TF Thermal Heatmap', type: 'tensorflow' },
        { id: 'tf_sepia_neural', name: '📜 TF Neural Sepia Tone', type: 'tensorflow' }
      ]
    }
  ];

  const applyFilter = async (filterId: string = activeFilterId, type: 'canvas' | 'tensorflow' = engineType) => {
    activeFilterId = filterId;
    engineType = type;
    if (!rawImageObj || !previewCanvas) return;

    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    previewCanvas.width = rawImageObj.width;
    previewCanvas.height = rawImageObj.height;

    // Combine base filter CSS with live slider modifications
    const baseCss = filterCategories
      .flatMap(c => c.filters)
      .find(f => f.id === filterId)?.css || 'none';

    const sliderCss = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) blur(${blurAmount}px)`;
    const combinedFilter = baseCss === 'none' ? sliderCss : `${baseCss} ${sliderCss}`;

    if (type === 'canvas') {
      ctx.filter = combinedFilter;
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      ctx.drawImage(rawImageObj, 0, 0);
      ctx.filter = 'none';
    } else {
      isProcessing = true;
      await new Promise(resolve => setTimeout(resolve, 30));

      try {
        await tf.ready();
        const inputTensor = tf.browser.fromPixels(rawImageObj);

        const processedTensor = tf.tidy(() => {
          let t = inputTensor.toFloat();
          const grayscale = (pixels: tf.Tensor3D) => {
            const red = pixels.slice([0, 0, 0], [-1, -1, 1]).mul(0.299);
            const green = pixels.slice([0, 0, 1], [-1, -1, 1]).mul(0.587);
            const blue = pixels.slice([0, 0, 2], [-1, -1, 1]).mul(0.114);
            return red.add(green).add(blue) as tf.Tensor3D;
          };
          const blur = (pixels: tf.Tensor3D, size: number) =>
            tf.avgPool(pixels.expandDims(0) as unknown as tf.Tensor4D, size, 1, 'same').squeeze([0]) as tf.Tensor3D;
          const sobel = (pixels: tf.Tensor3D) => {
            const gray = grayscale(pixels);
            const horizontal = tf.tensor4d([-1, 0, 1, -2, 0, 2, -1, 0, 1], [3, 3, 1, 1]);
            const vertical = tf.tensor4d([-1, -2, -1, 0, 0, 0, 1, 2, 1], [3, 3, 1, 1]);
            const batch = gray.expandDims(0) as unknown as tf.Tensor4D;
            const x = tf.conv2d(batch, horizontal, 1, 'same');
            const y = tf.conv2d(batch, vertical, 1, 'same');
            return tf.sqrt(x.square().add(y.square())).squeeze([0]) as tf.Tensor3D;
          };

          let resTensor: tf.Tensor3D;

          if (filterId === 'sketch_outline') {
            const gray = t.mean(2, true);
            const inverted = tf.scalar(255).sub(gray);
            const highContrast = inverted.sub(150).mul(3).clipByValue(0, 255);
            resTensor = tf.concat([highContrast, highContrast, highContrast], 2);
          } 
          else if (filterId === 'sketch_minimal') {
            const gray = t.mean(2, true);
            const thresholded = gray.greater(180).toFloat().mul(255);
            resTensor = tf.concat([thresholded, thresholded, thresholded], 2);
          }
          else if (filterId === 'tf_edge') {
            const edges = sobel(t).mul(1.8).clipByValue(0, 255);
            resTensor = tf.concat([edges, edges, edges], 2);
          } 
          else if (filterId === 'tf_luminance') {
            const r = t.slice([0, 0, 0], [-1, -1, 1]).mul(0.299);
            const g = t.slice([0, 0, 1], [-1, -1, 1]).mul(0.587);
            const b = t.slice([0, 0, 2], [-1, -1, 1]).mul(0.114);
            const lum = r.add(g).add(b);
            resTensor = tf.concat([lum, lum, lum], 2);
          }
          else if (filterId === 'tf_cartoon') {
            const smoothed = blur(t, 5);
            const posterized = smoothed.div(32).floor().mul(32);
            const edges = sobel(t).greater(75).logicalNot().toFloat().mul(255);
            resTensor = posterized.mul(edges).clipByValue(0, 255);
          }
          else if (filterId === 'tf_style') {
            const smoothed = blur(t, 9);
            const colorBlocks = smoothed.div(24).floor().mul(24);
            const edges = sobel(t).greater(95).toFloat().mul(18);
            resTensor = colorBlocks.sub(edges).clipByValue(0, 255);
          }
          else if (filterId === 'tf_deepdream') {
            const fineDetails = t.sub(blur(t, 3));
            const coarseDetails = t.sub(blur(t, 9));
            resTensor = t.add(fineDetails.mul(2.2)).add(coarseDetails.mul(1.4)).clipByValue(0, 255);
          }
          else if (filterId === 'tf_solarize') {
            resTensor = tf.where(t.greater(127), tf.scalar(255).sub(t), t) as tf.Tensor3D;
          }
          else if (filterId === 'tf_emboss') {
            const gray = grayscale(t);
            const embossKernel = tf.tensor4d([-2, -1, 0, -1, 1, 1, 0, 1, 2], [3, 3, 1, 1]);
            const batch = gray.expandDims(0) as unknown as tf.Tensor4D;
            const res = tf.conv2d(batch, embossKernel, 1, 'same').squeeze([0]).add(128).clipByValue(0, 255);
            resTensor = tf.concat([res, res, res], 2);
          }
          else if (filterId === 'tf_sharpen') {
            const sharpKernel = tf.tensor4d([0, -1, 0, -1, 5, -1, 0, -1, 0], [3, 3, 1, 1]);
            const r = tf.conv2d(t.slice([0, 0, 0], [-1, -1, 1]).expandDims(0) as unknown as tf.Tensor4D, sharpKernel, 1, 'same').squeeze([0]);
            const g = tf.conv2d(t.slice([0, 0, 1], [-1, -1, 1]).expandDims(0) as unknown as tf.Tensor4D, sharpKernel, 1, 'same').squeeze([0]);
            const b = tf.conv2d(t.slice([0, 0, 2], [-1, -1, 1]).expandDims(0) as unknown as tf.Tensor4D, sharpKernel, 1, 'same').squeeze([0]);
            resTensor = tf.concat([r, g, b], 2).clipByValue(0, 255);
          }
          else if (filterId === 'tf_thermal') {
            const gray = grayscale(t);
            const r = gray.mul(2).clipByValue(0, 255);
            const g = tf.scalar(255).sub(gray.sub(128).abs().mul(2)).clipByValue(0, 255);
            const b = tf.scalar(255).sub(gray.mul(2)).clipByValue(0, 255);
            resTensor = tf.concat([r, g, b], 2);
          }
          else if (filterId === 'tf_sepia_neural') {
            const r = t.slice([0, 0, 0], [-1, -1, 1]).mul(0.393).add(t.slice([0, 0, 1], [-1, -1, 1]).mul(0.769)).add(t.slice([0, 0, 2], [-1, -1, 1]).mul(0.189));
            const g = t.slice([0, 0, 0], [-1, -1, 1]).mul(0.349).add(t.slice([0, 0, 1], [-1, -1, 1]).mul(0.686)).add(t.slice([0, 0, 2], [-1, -1, 1]).mul(0.168));
            const b = t.slice([0, 0, 0], [-1, -1, 1]).mul(0.272).add(t.slice([0, 0, 1], [-1, -1, 1]).mul(0.534)).add(t.slice([0, 0, 2], [-1, -1, 1]).mul(0.131));
            resTensor = tf.concat([r, g, b], 2).clipByValue(0, 255);
          }
          else if (filterId === 'tf_deepinvert') {
            resTensor = tf.scalar(255).sub(t);
          }
          else {
            const min = t.min();
            const max = t.max();
            resTensor = t.sub(min).div(max.sub(min).maximum(1)).mul(255);
          }

          // Apply live slider adjustments to tensor output
          let adjusted = resTensor.toFloat().div(255);
          adjusted = adjusted.add((brightness - 100) / 100).clipByValue(0, 1);
          adjusted = adjusted.sub(0.5).mul(contrast / 100).add(0.5).clipByValue(0, 1);
          const grayAdj = adjusted.mean(2).expandDims(2) as tf.Tensor3D;
          adjusted = grayAdj.add(adjusted.sub(grayAdj).mul(saturation / 100)).clipByValue(0, 1);

          return adjusted.mul(255).toInt();
        });

        await tf.browser.toPixels(processedTensor as tf.Tensor3D, previewCanvas);
        inputTensor.dispose();
        processedTensor.dispose();
      } catch (err) {
        console.error("TensorFlow filter error:", err);
      } finally {
        isProcessing = false;
      }
    }
  };

  const resetAdjustments = () => {
    brightness = 100;
    contrast = 100;
    saturation = 100;
    hueRotate = 0;
    blurAmount = 0;
    applyFilter();
  };

  const openComparisonModal = () => {
    if (!previewCanvas) return;
    filteredDataUrl = previewCanvas.toDataURL('image/jpeg', 0.95);
    isModalOpen = true;
  };

  const exportImage = () => {
    if (!previewCanvas) return;

    if (exportFormat === 'pdf') {
      const dataUrl = previewCanvas.toDataURL('image/jpeg', compressionQuality / 100);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Artist Studio Export - PDF</title></head>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#111;">
              <img src="${dataUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" onload="window.print();window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      return;
    }

    const mimeType = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
    const quality = exportFormat === 'png' ? undefined : compressionQuality / 100;
    const dataUrl = previewCanvas.toDataURL(mimeType, quality);

    const link = document.createElement('a');
    link.download = `studio_artwork_${activeFilterId}.${exportFormat}`;
    link.href = dataUrl;
    link.click();
  };

  onMount(() => {
    if (rawImageObj) {
      applyFilter('normal', 'canvas');
    }
  });

  // Re-apply filter when sliders change
  $effect(() => {
    brightness;
    contrast;
    saturation;
    hueRotate;
    blurAmount;
    if (rawImageObj && previewCanvas) {
      applyFilter(activeFilterId, engineType);
    }
  });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Filter Matrix Sidebar + Pro Adjustments -->
  <div class="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6 max-h-[700px] overflow-y-auto">
    <div class="flex items-center justify-between border-b border-gray-100 pb-2">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:tune-vertical" class="text-primary text-lg" />
        <h3 class="font-bold text-sm text-dark">Pro Adjustments & Filters</h3>
      </div>
      {#if isProcessing}
        <span class="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
          <Icon icon="mdi:loading" class="animate-spin text-xs" /> Computing
        </span>
      {/if}
    </div>

    <!-- Fine-Tune Sliders Panel -->
    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
      <div class="flex justify-between items-center">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Fine-Tune Controls</h4>
        <button type="button" onclick={resetAdjustments} class="text-[10px] font-semibold text-primary hover:underline cursor-pointer">Reset</button>
      </div>

      <div class="space-y-2">
        <div>
          <div class="flex justify-between text-[11px] font-medium text-gray-600 mb-0.5">
            <span>Brightness</span><span>{brightness}%</span>
          </div>
          <input type="range" bind:value={brightness} min="0" max="200" class="w-full accent-primary cursor-pointer" />
        </div>

        <div>
          <div class="flex justify-between text-[11px] font-medium text-gray-600 mb-0.5">
            <span>Contrast</span><span>{contrast}%</span>
          </div>
          <input type="range" bind:value={contrast} min="0" max="200" class="w-full accent-primary cursor-pointer" />
        </div>

        <div>
          <div class="flex justify-between text-[11px] font-medium text-gray-600 mb-0.5">
            <span>Saturation</span><span>{saturation}%</span>
          </div>
          <input type="range" bind:value={saturation} min="0" max="200" class="w-full accent-primary cursor-pointer" />
        </div>

        <div>
          <div class="flex justify-between text-[11px] font-medium text-gray-600 mb-0.5">
            <span>Hue Rotation</span><span>{hueRotate}°</span>
          </div>
          <input type="range" bind:value={hueRotate} min="0" max="360" class="w-full accent-primary cursor-pointer" />
        </div>

        <div>
          <div class="flex justify-between text-[11px] font-medium text-gray-600 mb-0.5">
            <span>Blur Radius</span><span>{blurAmount}px</span>
          </div>
          <input type="range" bind:value={blurAmount} min="0" max="10" step="0.5" class="w-full accent-primary cursor-pointer" />
        </div>
      </div>
    </div>

    {#each filterCategories as category}
      <div class="space-y-2">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">{category.name}</h4>
        <div class="grid grid-cols-1 gap-1.5">
          {#each category.filters as filter}
            <button
              type="button"
              onclick={() => applyFilter(filter.id, filter.type as 'canvas' | 'tensorflow')}
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between {activeFilterId === filter.id ? 'bg-primary text-light shadow-sm' : 'bg-gray-50 text-dark hover:bg-gray-100 border border-gray-200/60'}"
            >
              <span>{filter.name}</span>
              <span class="text-[9px] font-mono uppercase opacity-60 px-1.5 py-0.5 bg-black/5 rounded">
                {filter.type}
              </span>
            </button>
          {/each}
        </div>
      </div>
    {/each}

    <!-- Export & Compression Panel -->
    <div class="pt-4 border-t border-gray-100 space-y-4">
      <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">Export & Compression Settings</h4>
      
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-[11px] font-semibold mb-1 text-gray-700">Format</label>
          <select bind:value={exportFormat} class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-dark">
            <option value="jpeg">JPEG (.jpg)</option>
            <option value="png">PNG (.png)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>
        </div>
        <div>
          <label class="block text-[11px] font-semibold mb-1 text-gray-700">Quality: {compressionQuality}%</label>
          <input type="range" bind:value={compressionQuality} min="10" max="100" disabled={exportFormat === 'png'} class="w-full accent-primary cursor-pointer disabled:opacity-40 mt-2" />
        </div>
      </div>

      <div class="space-y-2">
        <button type="button" onclick={openComparisonModal} class="w-full bg-dark hover:bg-black text-light font-semibold py-2.5 rounded-xl text-xs shadow transition cursor-pointer flex items-center justify-center gap-2">
          <Icon icon="mdi:compare" class="text-sm" /> Fullscreen Side-by-Side Compare
        </button>

        <button type="button" onclick={exportImage} class="w-full bg-primary hover:bg-primary-dark text-light font-semibold py-2.5 rounded-xl text-xs shadow transition cursor-pointer flex items-center justify-center gap-2">
          <Icon icon="mdi:export-variant" class="text-sm" /> Export as {exportFormat.toUpperCase()}
        </button>
      </div>
    </div>
  </div>

  <!-- Canvas Preview Area with Before/After & Loader Overlay -->
  <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[500px] relative">
    
    <!-- Top Comparison Toolbar -->
    <div class="w-full flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
      <span class="text-xs font-semibold text-gray-600">
        Preview Mode: <strong class="text-dark">{showOriginal ? 'Original Source' : `Filtered (${activeFilterId})`}</strong>
      </span>
      <button
        type="button"
        onmousedown={() => showOriginal = true}
        onmouseup={() => showOriginal = false}
        onmouseleave={() => showOriginal = false}
        ontouchstart={() => showOriginal = true}
        ontouchend={() => showOriginal = false}
        class="px-4 py-1.5 bg-dark text-light rounded-lg text-xs font-bold transition shadow-xs active:bg-primary cursor-pointer select-none"
        title="Press and hold to view original"
      >
        👁️ Hold to Compare Before / After
      </button>
    </div>

    <!-- Processing Loader Modal Overlay -->
    {#if isProcessing}
      <div class="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl space-y-3">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-bold text-dark animate-pulse">Running Neural Tensor Calculations...</p>
        <span class="text-[10px] font-mono text-gray-500">Processing WebGL Matrix Kernels</span>
      </div>
    {/if}

    <!-- Canvas Preview / Original Image Switcher -->
    <div class="w-full flex justify-center items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 max-h-[500px]">
      {#if showOriginal && rawImageObj}
        <img src={rawImageObj.src} alt="Original Reference" class="max-w-full max-h-[500px] object-contain block animate-fade" />
      {/if}
      <canvas bind:this={previewCanvas} class="max-w-full max-h-[500px] object-contain block {showOriginal ? 'hidden' : ''}"></canvas>
    </div>
  </div>
</div>

<!-- Render ImageModal Component -->
<ImageModal 
  bind:isOpen={isModalOpen} 
  originalSrc={rawImageObj?.src || ''} 
  filteredSrc={filteredDataUrl} 
/>