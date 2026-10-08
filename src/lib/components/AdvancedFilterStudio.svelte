<script lang="ts">
  import { onMount } from "svelte";
  import * as tf from "@tensorflow/tfjs";
  import Icon from "@iconify/svelte";
  import ImageModal from "$lib/components/ImageModal.svelte";
  import { filterCategories } from "$lib/utils/filters";
  import type { SketchFilter, CartoonFilter } from "$lib/types/filter";
  import FullImageModal from "$lib/components/FullImageModal.svelte";
  import VibeSearchModal from "$lib/components/VibeSearchModal.svelte";
  import type { TextOverlay } from '$lib/utils/overlays';
  import { buildFont, getOverlayBox, drawInnerShadow, defaultTextOverlay, FONT_OPTIONS } from '$lib/utils/overlays';
  import TextOverlayEditor from '$lib/components/TextOverlayEditor.svelte';
  import { debounce } from '$lib/utils/editorUtils';

  let { rawImageObj }: { rawImageObj: HTMLImageElement | null } = $props();

  let previewCanvas = $state<HTMLCanvasElement | null>(null);
  let textOverlays = $state<TextOverlay[]>([]);
  let activeTextId = $state<string | null>(null);
  const activeText = $derived.by(() => textOverlays.find(x => x.id === activeTextId) || null);
  let isDraggingText = $state(false);
  let draggedTextId = $state<string | null>(null);
  let dragOffsetX = $state(0);
  let dragOffsetY = $state(0);
  let isResizingText = $state(false);
  let activeHandle = $state<string | null>(null);
  let startBox = $state<{ x: number; y: number; w: number; h: number } | null>(null);
  let startFontSize = $state(0);
  let startPointerX = $state(0);
  let startPointerY = $state(0);
  const handleSize = 12;

  const debouncedApplyFilter = debounce(() => {
    try { applyFilter(activeFilterId, engineType); } catch {}
  }, 120);
  let histogramCanvas = $state<HTMLCanvasElement | null>(null);
  let activeFilterId = $state<string>('normal');
  let filterSearch = $state('');
  let isProcessing = $state(false);
  let filterError = $state('');
  let filterRunId = 0;
  let subjectMaskEnabled = $state(false);
  let subjectMaskFeather = $state(1);
  let subjectSegmentation = $state<{ width: number; height: number; data: Uint8Array } | null>(null);
  let engineType = $state<'canvas' | 'tensorflow'>('canvas');
  let showOriginal = $state(false);

  let isModalOpen = $state(false);
  let isFullImageModalOpen = $state(false);
  let isVibeModalOpen = $state(false);
  let filteredDataUrl = $state('');

  let exportFormat = $state<'jpeg' | 'png' | 'pdf'>('jpeg');
  let compressionQuality = $state(90);
  let exportError = $state('');
  let previousRawImage: HTMLImageElement | null = null;

  // Pro Adjustment Sliders
  let brightness = $state(100);
  let contrast = $state(100);
  let saturation = $state(100);
  let hueRotate = $state(0);
  let blurAmount = $state(0);

  // New Features: Ambient Glow, Vignette & Film Grain
  let glowEnabled = $state(false);
  let glowColor = $state('#3b82f6');
  let glowIntensity = $state(20);

  let vignetteIntensity = $state(0); // 0% to 100%
  let grainAmount = $state(0);       // 0% to 50%

  

  const visibleFilterCategories = $derived.by(() => {
    const query = filterSearch.trim().toLowerCase();
    return filterCategories
      .map(category => ({
        ...category,
        filters: category.filters.filter(filter =>
          !query || `${filter.name} ${filter.id} ${category.name}`.toLowerCase().includes(query)
        )
      }))
      .filter(category => category.filters.length > 0);
  });
  const visibleFilterCount = $derived(visibleFilterCategories.reduce((total, category) => total + category.filters.length, 0));

  const updateHistogram = () => {
    if (!previewCanvas || !histogramCanvas) return;
    const ctx = previewCanvas.getContext('2d');
    const hCtx = histogramCanvas.getContext('2d');
    if (!ctx || !hCtx) return;

    const width = previewCanvas.width;
    const height = previewCanvas.height;
    if (width === 0 || height === 0) return;

    const imgData = ctx.getImageData(0, 0, width, height).data;
    const rBins = new Array(256).fill(0);
    const gBins = new Array(256).fill(0);
    const bBins = new Array(256).fill(0);

    for (let i = 0; i < imgData.length; i += 4) {
      rBins[imgData[i]]++;
      gBins[imgData[i + 1]]++;
      bBins[imgData[i + 2]]++;
    }

    const maxR = Math.max(...rBins, 1);
    const maxG = Math.max(...gBins, 1);
    const maxB = Math.max(...bBins, 1);
    const maxVal = Math.max(maxR, maxG, maxB);

    hCtx.clearRect(0, 0, histogramCanvas.width, histogramCanvas.height);
    const hWidth = histogramCanvas.width;
    const hHeight = histogramCanvas.height;
    const binWidth = hWidth / 256;

    const drawCurve = (bins: number[], color: string) => {
      hCtx.strokeStyle = color;
      hCtx.lineWidth = 1.5;
      hCtx.beginPath();
      for (let i = 0; i < 256; i++) {
        const x = i * binWidth;
        const y = hHeight - (bins[i] / maxVal) * hHeight;
        if (i === 0) hCtx.moveTo(x, y);
        else hCtx.lineTo(x, y);
      }
      hCtx.stroke();
    };

    hCtx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    hCtx.fillRect(0, 0, hWidth, hHeight);

    drawCurve(rBins, 'rgba(239, 68, 68, 0.8)');
    drawCurve(gBins, 'rgba(34, 197, 94, 0.8)');
    drawCurve(bBins, 'rgba(59, 130, 246, 0.8)');
  };

  // --- Text overlay helpers ---
  const addTextOverlay = () => {
    if (!previewCanvas || !rawImageObj) return;
    const newOverlay = defaultTextOverlay(previewCanvas.width || rawImageObj.width, previewCanvas.height || rawImageObj.height);
    textOverlays = [...textOverlays, newOverlay];
    activeTextId = newOverlay.id;
    applyFilter();
  };

  const removeTextOverlay = (id: string) => {
    textOverlays = textOverlays.filter(o => o.id !== id);
    if (activeTextId === id) activeTextId = textOverlays[0]?.id || null;
    applyFilter();
  };

  const drawTextOverlays = (ctx: CanvasRenderingContext2D) => {
    if (!textOverlays || textOverlays.length === 0) return;
    for (const o of textOverlays) {
      ctx.save();
      ctx.font = buildFont(o);
      ctx.textBaseline = 'top';

      if (o.hasBackground) {
        const box = getOverlayBox(ctx, o);
        ctx.fillStyle = o.bgColor || 'rgba(0,0,0,0.5)';
        ctx.fillRect(box.x, box.y, box.w, box.h);
      }

      if (o.shadowEnabled) {
        ctx.shadowColor = o.shadowColor || 'transparent';
        ctx.shadowBlur = o.shadowBlur || 0;
        ctx.shadowOffsetX = o.shadowOffsetX || 0;
        ctx.shadowOffsetY = o.shadowOffsetY || 0;
      } else {
        ctx.shadowColor = 'transparent';
      }

      ctx.fillStyle = o.color || '#fff';
      if (o.strokeEnabled) {
        ctx.lineWidth = o.strokeWidth || 1;
        ctx.strokeStyle = o.strokeColor || '#000';
        ctx.strokeText(o.text, o.x, o.y);
      }
      ctx.fillText(o.text, o.x, o.y);

      if (o.innerShadowEnabled) {
        drawInnerShadow(ctx, o);
      }

      // draw resize handles when active
      if (o.id === activeTextId) {
        const box = getOverlayBox(ctx, o);
        const hs = handleSize;
        const handles = [
          { id: 'nw', x: box.x - hs / 2, y: box.y - hs / 2 },
          { id: 'ne', x: box.x + box.w - hs / 2, y: box.y - hs / 2 },
          { id: 'se', x: box.x + box.w - hs / 2, y: box.y + box.h - hs / 2 },
          { id: 'sw', x: box.x - hs / 2, y: box.y + box.h - hs / 2 }
        ];
        ctx.save();
        for (const h of handles) {
          ctx.fillStyle = 'white';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(h.x, h.y, hs, hs);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.restore();
    }
  };

  const getCanvasRelative = (e: PointerEvent) => {
    if (!previewCanvas) return { x: 0, y: 0 };
    const rect = previewCanvas.getBoundingClientRect();
    const xCss = e.clientX - rect.left;
    const yCss = e.clientY - rect.top;
    const scaleX = previewCanvas.width / rect.width || 1;
    const scaleY = previewCanvas.height / rect.height || 1;
    return { x: xCss * scaleX, y: yCss * scaleY };
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (!previewCanvas) return;
    previewCanvas.setPointerCapture(e.pointerId);
    const p = getCanvasRelative(e);
    for (let i = textOverlays.length - 1; i >= 0; i--) {
      const o = textOverlays[i];
      const ctx = previewCanvas.getContext('2d');
      if (!ctx) continue;
      const box = getOverlayBox(ctx, o);
      const hs = handleSize;
      const handleRects = {
        nw: { x: box.x - hs / 2, y: box.y - hs / 2, w: hs, h: hs },
        ne: { x: box.x + box.w - hs / 2, y: box.y - hs / 2, w: hs, h: hs },
        se: { x: box.x + box.w - hs / 2, y: box.y + box.h - hs / 2, w: hs, h: hs },
        sw: { x: box.x - hs / 2, y: box.y + box.h - hs / 2, w: hs, h: hs }
      };
      for (const [hid, r] of Object.entries(handleRects)) {
        if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
          draggedTextId = o.id;
          activeTextId = o.id;
          isResizingText = true;
          activeHandle = hid;
          startBox = { x: box.x, y: box.y, w: box.w, h: box.h };
          startFontSize = (o as any).fontSize || 32;
          startPointerX = p.x;
          startPointerY = p.y;
          return;
        }
      }
      if (p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h) {
        draggedTextId = o.id;
        activeTextId = o.id;
        isDraggingText = true;
        dragOffsetX = p.x - o.x;
        dragOffsetY = p.y - o.y;
        return;
      }
    }
    draggedTextId = null;
    isDraggingText = false;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!previewCanvas) return;
    const p = getCanvasRelative(e);
    if (isResizingText && draggedTextId && startBox) {
      const idx = textOverlays.findIndex(x => x.id === draggedTextId);
      if (idx === -1) return;
      const o = textOverlays[idx];
      const dx = p.x - startPointerX;
      const newW = Math.max(24, startBox.w + (activeHandle && activeHandle.includes('e') ? dx : -dx));
      const ratio = newW / startBox.w;
      const newFont = Math.max(8, Math.round(startFontSize * ratio));
      (o as any).fontSize = newFont;
      textOverlays = [...textOverlays];
      if (engineType === 'canvas') applyFilter(activeFilterId, 'canvas');
      else debouncedApplyFilter();
      return;
    }
    if (!isDraggingText || !draggedTextId) return;
    const idx = textOverlays.findIndex(x => x.id === draggedTextId);
    if (idx === -1) return;
    textOverlays[idx].x = p.x - dragOffsetX;
    textOverlays[idx].y = p.y - dragOffsetY;
    textOverlays = [...textOverlays];
    if (engineType === 'canvas') applyFilter(activeFilterId, 'canvas');
    else debouncedApplyFilter();
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!previewCanvas) return;
    try { previewCanvas.releasePointerCapture(e.pointerId); } catch {}
    if (isResizingText) {
      isResizingText = false;
      activeHandle = null;
      startBox = null;
      startFontSize = 0;
      startPointerX = 0;
      startPointerY = 0;
      applyFilter(activeFilterId, engineType);
      return;
    }
    isDraggingText = false;
    draggedTextId = null;
    const ctx = previewCanvas.getContext('2d');
    if (ctx) applyFilter(activeFilterId, engineType);
  };

  const applyPostEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 1. Ambient Glow
    if (glowEnabled) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowIntensity;
      ctx.drawImage(previewCanvas!, 0, 0);
      ctx.restore();
    }

    // 2. Vignette Effect
    if (vignetteIntensity > 0) {
      ctx.save();
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.2,
        width / 2, height / 2, Math.max(width, height) * 0.75
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${vignetteIntensity / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // 3. Film Grain / Paper Texture Noise
    if (grainAmount > 0) {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const factor = (grainAmount / 100) * 40;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * factor;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);
    }
  };

  const applyFilter = async (filterId: string = activeFilterId, type: 'canvas' | 'tensorflow' = engineType) => {
    const runId = ++filterRunId;
    activeFilterId = filterId;
    engineType = type;
    filterError = '';
    if (!rawImageObj || !previewCanvas) return;

    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    isProcessing = type === 'tensorflow';
    previewCanvas.width = rawImageObj.width;
    previewCanvas.height = rawImageObj.height;

    const baseCss = filterCategories
      .flatMap(c => c.filters)
      .find(f => f.id === filterId)?.css || 'none';

    const sliderCss = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) blur(${blurAmount}px)`;
    const combinedFilter = baseCss === 'none' ? sliderCss : `${baseCss} ${sliderCss}`;

    if (type === 'canvas') {
      isProcessing = false;
      ctx.filter = combinedFilter;
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      ctx.drawImage(rawImageObj, 0, 0);
      ctx.filter = 'none';

      applyPostEffects(ctx, previewCanvas.width, previewCanvas.height);
      // draw overlays (text)
      drawTextOverlays(ctx);
      updateHistogram();
    } else {
      await new Promise(resolve => setTimeout(resolve, 30));
      let inputTensor: tf.Tensor3D | null = null;
      let processedTensor: tf.Tensor | null = null;

      try {
        await tf.ready();
        inputTensor = tf.browser.fromPixels(rawImageObj);
        const sketchSettings = filterCategories
          .flatMap(category => category.filters)
          .find(filter => filter.id === filterId)?.sketch;
        const cartoonSettings = filterCategories
          .flatMap(category => category.filters)
          .find(filter => filter.id === filterId)?.cartoon;

        processedTensor = tf.tidy(() => {
          let t = inputTensor!.toFloat() as tf.Tensor3D;
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
          const renderSketch = (pixels: tf.Tensor3D, settings: SketchFilter): tf.Tensor3D => {
            const gray = grayscale(pixels);
            const variation = settings.variation;
            const rgb = (channel: tf.Tensor) => {
              const plane = channel as tf.Tensor3D;
              return tf.concat([plane, plane, plane], 2) as tf.Tensor3D;
            };

            if (settings.family === 'graphite') {
              const blurSize = [3, 5, 7, 9, 11][Math.min(4, Math.floor(variation / 7))];
              const inverted = tf.scalar(255).sub(gray) as tf.Tensor3D;
              const blurred = blur(inverted, blurSize);
              const dodge = gray.mul(255).div(tf.scalar(255).sub(blurred).maximum(10));
              const pressure = 0.75 + (variation % 4) * 0.28;
              const pencil = tf.scalar(255).sub(tf.scalar(255).sub(dodge).mul(pressure));
              const grain = sobel(pixels).mul(0.01 + (variation % 4) * 0.014);
              return rgb(pencil.sub(grain).clipByValue(0, 255));
            }

            if (settings.family === 'charcoal') {
              const blurSize = [3, 5, 7, 9][variation % 4];
              const shadow = tf.scalar(255).sub(gray) as tf.Tensor3D;
              const softShadow = blur(shadow, blurSize);
              const pressure = 0.65 + (variation % 6) * 0.1;
              const texture = sobel(pixels).mul(0.025 + (variation % 5) * 0.012);
              const charcoal = softShadow.mul(pressure).add(texture).clipByValue(0, 255);
              const liftedPaper = variation % 3 === 0 ? charcoal.mul(0.88) : charcoal;
              return rgb(tf.scalar(255).sub(liftedPaper).clipByValue(0, 255));
            }

            if (settings.family === 'contour' || settings.family === 'technical') {
              const edgeStrength = 1.1 + variation * 0.12;
              const threshold = 22 + (variation % 5) * 17;
              const edges = sobel(pixels).sub(threshold).maximum(0).mul(edgeStrength);
              const lineTone = settings.family === 'technical' && variation % 3 === 0
                ? gray.mul(0.04)
                : tf.zerosLike(gray);
              return rgb(tf.scalar(255).sub(edges).sub(lineTone).clipByValue(0, 255));
            }

            const [height, width] = pixels.shape;
            const x = tf.tile(tf.range(0, width, 1, 'int32').reshape([1, width]), [height, 1]).toFloat().expandDims(2) as tf.Tensor3D;
            const y = tf.tile(tf.range(0, height, 1, 'int32').reshape([height, 1]), [1, width]).toFloat().expandDims(2) as tf.Tensor3D;
            const darkness = tf.scalar(255).sub(gray);

            if (settings.family === 'stippling') {
              const frequency = 0.1 + variation * 0.017;
              const dotPattern = tf.sin(x.mul(frequency).add(y.mul(frequency * 0.7)))
                .mul(tf.cos(y.mul(frequency).sub(x.mul(frequency * 0.35))));
              const threshold = tf.scalar(0.92 - (variation % 5) * 0.015).sub(darkness.div(255).mul(1.7));
              const dots = dotPattern.greater(threshold).toFloat();
              const dotSize = 120 + (variation % 4) * 40;
              return rgb(tf.scalar(255).sub(dots.mul(dotSize)));
            }

            const spacing = 3 + variation;
            const thickness = 1 + (variation % 3);
            const directions = settings.family === 'hatching'
              ? [0.7, -0.7, 0.15, 1.35]
              : [0.78, -0.78, 0.3, 1.25];
            const lineCount = settings.family === 'engraving' ? 1 + (variation % 4) : 1 + (variation % 3);
            let ink = tf.zerosLike(gray);
            for (let line = 0; line < lineCount; line++) {
              const angle = directions[(line + variation) % directions.length];
              const coordinate = x.mul(Math.cos(angle)).add(y.mul(Math.sin(angle))).add(variation * 3 + line * 5);
              const hatch = tf.mod(coordinate, spacing).less(thickness).toFloat();
              const shadowGate = darkness.greater(38 + line * 42 + (variation % 3) * 8).toFloat();
              ink = ink.add(hatch.mul(shadowGate));
            }
            const inkStrength = settings.family === 'engraving' ? 42 + (variation % 4) * 18 : 55 + (variation % 4) * 20;
            if (settings.family === 'engraving') {
              const edgeInk = sobel(pixels).sub(30 + (variation % 4) * 15).maximum(0).mul(0.35);
              ink = ink.mul(inkStrength).add(edgeInk);
            } else {
              ink = ink.mul(inkStrength);
            }
            return rgb(tf.scalar(255).sub(ink).clipByValue(0, 255));
          };
          const renderCartoon = (pixels: tf.Tensor3D, settings: CartoonFilter): tf.Tensor3D => {
            const softened = blur(pixels, settings.blurSize);
            const quantizationStep = 255 / (settings.colorLevels - 1);
            const posterized = softened.div(quantizationStep).round().mul(quantizationStep) as tf.Tensor3D;
            const gray = grayscale(pixels);
            const grayRgb = tf.concat([gray, gray, gray], 2) as tf.Tensor3D;
            const color = grayRgb.add(posterized.sub(grayRgb).mul(settings.saturation)).clipByValue(0, 255);
            const lineMask = sobel(pixels).greater(settings.edgeThreshold).toFloat()
              .mul(settings.edgeStrength) as tf.Tensor3D;
            const ink = tf.tensor1d(settings.inkColor).reshape([1, 1, 3]) as tf.Tensor3D;
            return color.mul(tf.onesLike(lineMask).sub(lineMask)).add(ink.mul(lineMask)).clipByValue(0, 255) as tf.Tensor3D;
          };

          let resTensor: tf.Tensor;

          if (cartoonSettings) {
            resTensor = renderCartoon(t, cartoonSettings);
          }
          else if (sketchSettings) {
            resTensor = renderSketch(t, sketchSettings);
          }
          else if (filterId === 'sketch_outline') {
            const gray = t.mean(2, true);
            const inverted = tf.scalar(255).sub(gray) as tf.Tensor3D;
            const highContrast = inverted.sub(150).mul(3).clipByValue(0, 255);
            resTensor = tf.concat([highContrast, highContrast, highContrast], 2);
          } 
          else if (filterId === 'sketch_minimal') {
            const gray = t.mean(2, true);
            const thresholded = gray.greater(180).toFloat().mul(255);
            resTensor = tf.concat([thresholded, thresholded, thresholded], 2);
          }
          else if (filterId === 'tf_detailed_portrait') {
            const gray = grayscale(t);
            const inverted = tf.scalar(255).sub(gray) as tf.Tensor3D;
            const blurred = blur(inverted, 7);
            const dodge = gray.mul(255).div(tf.scalar(255).sub(blurred).maximum(4.0));
            resTensor = tf.concat([dodge, dodge, dodge], 2).clipByValue(0, 255);
          }
          else if (filterId === 'tf_stipple_dot') {
            const gray = grayscale(t);
            const dots = tf.sin(gray.mul(0.3)).abs().greater(0.7).toFloat().mul(255);
            resTensor = tf.concat([dots, dots, dots], 2);
          }
          else if (filterId === 'tf_blueprint_sketch') {
            const gray = grayscale(t);
            const edges = sobel(t);
            const r = tf.zerosLike(gray);
            const g = edges.mul(0.5);
            const b = tf.scalar(255).sub(gray.mul(0.5));
            resTensor = tf.concat([r, g, b], 2).clipByValue(0, 255);
          }
          else if (filterId === 'tf_lithograph') {
            const gray = grayscale(t);
            const posterized = gray.div(64).floor().mul(64);
            const edges = sobel(t).greater(50).toFloat().mul(255);
            const res = tf.scalar(255).sub(posterized.add(edges)).clipByValue(0, 255);
            resTensor = tf.concat([res, res, res], 2);
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
            resTensor = renderCartoon(t, {
              blurSize: 5,
              colorLevels: 6,
              edgeThreshold: 75,
              edgeStrength: 0.9,
              saturation: 1.2,
              inkColor: [20, 20, 24]
            });
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
          else if (filterId === 'tf_deepinvert') {
            resTensor = tf.scalar(255).sub(t);
          }
          else {
            const min = t.min();
            const max = t.max();
            resTensor = t.sub(min).div(max.sub(min).maximum(1)).mul(255);
          }

          let adjusted = resTensor.toFloat().div(255);
          adjusted = adjusted.add((brightness - 100) / 100).clipByValue(0, 1);
          adjusted = adjusted.sub(0.5).mul(contrast / 100).add(0.5).clipByValue(0, 1);
          const grayAdj = adjusted.mean(2).expandDims(2) as tf.Tensor3D;
          adjusted = grayAdj.add(adjusted.sub(grayAdj).mul(saturation / 100)).clipByValue(0, 1);

          return adjusted.mul(255).toInt();
        });

        if (runId !== filterRunId) return;
        const resultCanvas = document.createElement('canvas');
        resultCanvas.width = previewCanvas.width;
        resultCanvas.height = previewCanvas.height;
        await tf.browser.toPixels(processedTensor as tf.Tensor3D, resultCanvas);
        if (runId !== filterRunId) return;
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        ctx.drawImage(resultCanvas, 0, 0);

        applyPostEffects(ctx, previewCanvas.width, previewCanvas.height);
        // draw overlays (text)
        drawTextOverlays(ctx);
        updateHistogram();
      } catch (error) {
        filterError = error instanceof Error ? error.message : 'TensorFlow.js could not render this filter.';
        console.error("TensorFlow filter error:", error);
      } finally {
        inputTensor?.dispose();
        processedTensor?.dispose();
        if (runId === filterRunId) isProcessing = false;
      }
    }
  };

  const resetAdjustments = () => {
    brightness = 100;
    contrast = 100;
    saturation = 100;
    hueRotate = 0;
    blurAmount = 0;
    glowEnabled = false;
    vignetteIntensity = 0;
    grainAmount = 0;
    applyFilter();
  };

  const openComparisonModal = () => {
    if (!previewCanvas) return;
    const mimeType = subjectMaskEnabled ? 'image/png' : 'image/jpeg';
    filteredDataUrl = previewCanvas.toDataURL(mimeType, subjectMaskEnabled ? undefined : 0.95);
    isModalOpen = true;
  };

  const applyVibeFilter = async (filterId: string) => {
    const match = filterCategories.flatMap(category => category.filters).find(filter => filter.id === filterId);
    if (!match || !previewCanvas) return null;
    await applyFilter(match.id, match.type);
    return previewCanvas.toDataURL('image/jpeg', 0.85);
  };

  const openFullImagePreview = () => {
    if (!previewCanvas) return;
    const mimeType = subjectMaskEnabled ? 'image/png' : 'image/jpeg';
    filteredDataUrl = previewCanvas.toDataURL(mimeType, subjectMaskEnabled ? undefined : 0.95);
    isFullImageModalOpen = true;
  };

  const exportImage = async () => {
    if (!previewCanvas) return;
    exportError = '';

    try {
      if (exportFormat === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const preserveTransparency = subjectMaskEnabled && subjectSegmentation !== null;
        const imageType = preserveTransparency ? 'PNG' : 'JPEG';
        const dataUrl = preserveTransparency
          ? previewCanvas.toDataURL('image/png')
          : previewCanvas.toDataURL('image/jpeg', compressionQuality / 100);
        const orientation = previewCanvas.width >= previewCanvas.height ? 'landscape' : 'portrait';
        const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4', compress: true });
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const scale = Math.min(
          (pageWidth - margin * 2) / previewCanvas.width,
          (pageHeight - margin * 2) / previewCanvas.height
        );
        const imageWidth = previewCanvas.width * scale;
        const imageHeight = previewCanvas.height * scale;
        pdf.addImage(dataUrl, imageType, (pageWidth - imageWidth) / 2, (pageHeight - imageHeight) / 2, imageWidth, imageHeight, undefined, 'FAST');
        pdf.save(`studio_artwork_${activeFilterId}.pdf`);
        return;
      }

      const preserveTransparency = subjectMaskEnabled && subjectSegmentation !== null;
      const outputFormat = preserveTransparency ? 'png' : exportFormat;
      const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
      const quality = outputFormat === 'png' ? undefined : compressionQuality / 100;
      const dataUrl = previewCanvas.toDataURL(mimeType, quality);

      const link = document.createElement('a');
      link.download = `studio_artwork_${activeFilterId}.${outputFormat}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      exportError = error instanceof Error ? error.message : 'The image could not be exported.';
    }
  };

  onMount(() => {
    if (rawImageObj) {
      applyFilter('normal', 'canvas');
    }
  });

  $effect(() => {
    brightness;
    contrast;
    saturation;
    hueRotate;
    blurAmount;
    glowEnabled;
    glowColor;
    glowIntensity;
    vignetteIntensity;
    grainAmount;
    subjectSegmentation;
    subjectMaskEnabled;
    subjectMaskFeather;
    if (rawImageObj !== previousRawImage) {
      previousRawImage = rawImageObj;
      subjectSegmentation = null;
      subjectMaskEnabled = false;
    }
    if (rawImageObj && previewCanvas) {
      applyFilter(activeFilterId, engineType);
    }
  });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Filter Matrix Sidebar + Pro Adjustments & Histogram -->
  <div class="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6 max-h-[720px] overflow-y-auto">
    <div class="flex items-center justify-between border-b border-gray-100 pb-2">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:chart-histogram" class="text-primary text-lg" />
        <h3 class="font-bold text-sm text-dark">Studio & Histogram Analyzer</h3>
      </div>
      {#if isProcessing}
        <span class="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
          <Icon icon="mdi:loading" class="animate-spin text-xs" /> Computing
        </span>
      {/if}
    </div>

    <!-- Real-time RGB Histogram Analyzer -->
    <div class="bg-gray-900 p-3 rounded-2xl border border-gray-800 space-y-1.5">
      <div class="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-wider">
        <span>RGB Luminance Histogram</span>
        <span class="flex items-center gap-2">
          <span class="text-red-400">R</span> <span class="text-green-400">G</span> <span class="text-blue-400">B</span>
        </span>
      </div>
      <div class="w-full h-24 bg-black/60 rounded-xl overflow-hidden border border-gray-800 flex items-center justify-center">
        <canvas bind:this={histogramCanvas} width="256" height="96" class="w-full h-full object-fill"></canvas>
      </div>
    </div>

    <!-- Fine-Tune Sliders Panel -->
    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
      <div class="flex justify-between items-center">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Fine-Tune Controls</h4>
        <button type="button" onclick={resetAdjustments} class="text-[10px] font-semibold text-primary hover:underline cursor-pointer">Reset All</button>
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

    <!-- --- NEW: Text Overlay Customization Panel --- -->
    <div class="space-y-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
      <div class="flex items-center justify-between">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-dark font-mono flex items-center gap-1">
          <Icon icon="mdi:format-text" class="text-primary text-base" /> Text Editor Overlay
        </h4>
        <button
          type="button"
          onclick={addTextOverlay}
          class="px-2.5 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
        >
          <Icon icon="mdi:plus" /> Add Text
        </button>
      </div>

      {#if textOverlays.length > 0}
        <div class="space-y-3 pt-2">
          <!-- Text Layer Selector -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1">
            {#each textOverlays as overlay, index}
              <button
                type="button"
                onclick={() => activeTextId = overlay.id}
                class="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer {activeTextId === overlay.id ? 'bg-primary text-white shadow-xs' : 'bg-white text-dark border border-gray-200 hover:bg-gray-100'}"
              >
                Text #{index + 1}
              </button>
            {/each}
          </div>

          {#if activeTextId}
            {@const activeText = textOverlays.find(o => o.id === activeTextId)}
            {#if activeText}
              <div class="space-y-2.5 pt-2 border-t border-gray-200">
                <div>
                  <label class="block text-[11px] font-bold text-gray-600 mb-1">Content</label>
                  <input
                    type="text"
                    bind:value={activeText.text}
                    class="w-full px-3 py-1.5 bg-white dark:bg-dark dark:text-light border border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-600 mb-1">Font Family</label>
                    <select
                      bind:value={activeText.fontFamily}
                      class="w-full p-1.5 bg-white dark:bg-dark dark:text-light border border-gray-200 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      {#each FONT_OPTIONS as font}
                        <option value={font} style="font-family: '{font}'">{font}</option>
                      {/each}
                    </select>
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold text-gray-600 mb-1">Font Size ({activeText.fontSize}px)</label>
                    <div class="flex items-center gap-1.5">
                      <input
                        type="range"
                        bind:value={activeText.fontSize}
                        min="8"
                        max="400"
                        class="w-full accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        bind:value={activeText.fontSize}
                        min="8"
                        max="400"
                        class="w-14 p-1 bg-white dark:bg-dark dark:text-light border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div class="flex items-center gap-2">
                    <label class="text-[11px] font-bold text-gray-600">Text Color:</label>
                    <input type="color" bind:value={activeText.color} class="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white shadow-xs" />
                  </div>

                  <label class="flex items-center gap-1.5 text-xs font-semibold text-dark cursor-pointer">
                    <input type="checkbox" bind:checked={activeText.isBold} class="rounded text-primary cursor-pointer" /> Bold
                  </label>

                  <label class="flex items-center gap-1.5 text-xs font-semibold text-dark cursor-pointer">
                    <input type="checkbox" bind:checked={activeText.isItalic} class="rounded text-primary cursor-pointer" /> Italic
                  </label>

                  <label class="flex items-center gap-1.5 text-xs font-semibold text-dark cursor-pointer">
                    <input type="checkbox" bind:checked={activeText.hasBackground} class="rounded text-primary cursor-pointer" /> Box
                  </label>

                  <button
                    type="button"
                    onclick={() => activeText && removeTextOverlay(activeText.id)}
                    class="text-[11px] text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>

                <!-- Effects -->
                <div class="space-y-2 pt-2 border-t border-gray-200">
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="flex items-center gap-1.5 text-xs font-semibold text-dark cursor-pointer">
                        <input type="checkbox" bind:checked={activeText.shadowEnabled} class="rounded text-primary cursor-pointer" /> Drop Shadow
                      </label>
                      <input type="color" bind:value={activeText.shadowColor} class="w-7 h-7 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                    </div>
                    {#if activeText.shadowEnabled}
                      <div class="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-500">
                        <label>Blur {activeText.shadowBlur}<input type="range" min="0" max="50" bind:value={activeText.shadowBlur} class="w-full accent-primary" /></label>
                        <label>X {activeText.shadowOffsetX}<input type="range" min="-30" max="30" bind:value={activeText.shadowOffsetX} class="w-full accent-primary" /></label>
                        <label>Y {activeText.shadowOffsetY}<input type="range" min="-30" max="30" bind:value={activeText.shadowOffsetY} class="w-full accent-primary" /></label>
                      </div>
                    {/if}
                  </div>

                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="flex items-center gap-1.5 text-xs font-semibold text-dark cursor-pointer">
                        <input type="checkbox" bind:checked={activeText.glowEnabled} class="rounded text-primary cursor-pointer" /> Outer Glow
                      </label>
                      <input type="color" bind:value={activeText.glowColor} class="w-7 h-7 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                    </div>
                    {#if activeText.glowEnabled}
                      <label class="block text-[10px] font-bold text-gray-500">Intensity {activeText.glowBlur}<input type="range" min="1" max="100" bind:value={activeText.glowBlur} class="w-full accent-primary" /></label>
                    {/if}
                  </div>

                  <!-- Stroke -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="flex items-center gap-1.5 text-xs font-semibold text-dark cursor-pointer">
                        <input type="checkbox" bind:checked={activeText.strokeEnabled} class="rounded text-primary cursor-pointer" /> Stroke
                      </label>
                      <input type="color" bind:value={activeText.strokeColor} class="w-7 h-7 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                    </div>
                    {#if activeText.strokeEnabled}
                      <label class="block text-[10px] font-bold text-gray-500">Width {activeText.strokeWidth}<input type="range" min="1" max="40" bind:value={activeText.strokeWidth} class="w-full accent-primary" /></label>
                    {/if}
                  </div>

                  <!-- Blend / Mask -->
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="block text-xs font-bold text-gray-600 mb-1">Blend Mode</label>
                      <select bind:value={activeText.blendMode} class="p-1.5 bg-white border border-gray-200 rounded-lg text-xs">
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
                      <label class="flex items-center gap-1.5 text-xs font-semibold text-dark cursor-pointer">
                        <input type="checkbox" bind:checked={activeText.maskEnabled} class="rounded text-primary cursor-pointer" /> Mask Fill
                      </label>
                      <input type="color" bind:value={activeText.maskColor} class="w-7 h-7 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="flex items-center gap-1.5 text-xs font-semibold text-dark cursor-pointer">
                        <input type="checkbox" bind:checked={activeText.innerShadowEnabled} class="rounded text-primary cursor-pointer" /> Inner Shadow
                      </label>
                      <input type="color" bind:value={activeText.innerShadowColor} class="w-7 h-7 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                    </div>
                    {#if activeText.innerShadowEnabled}
                      <div class="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-500">
                        <label>Blur {activeText.innerShadowBlur}<input type="range" min="0" max="30" bind:value={activeText.innerShadowBlur} class="w-full accent-primary" /></label>
                        <label>X {activeText.innerShadowOffsetX}<input type="range" min="-20" max="20" bind:value={activeText.innerShadowOffsetX} class="w-full accent-primary" /></label>
                        <label>Y {activeText.innerShadowOffsetY}<input type="range" min="-20" max="20" bind:value={activeText.innerShadowOffsetY} class="w-full accent-primary" /></label>
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            {/if}
          {/if}
        </div>
      {:else}
        <p class="text-[11px] text-gray-400 italic py-1 text-center">Click "Add Text" to start typing on the photo</p>
      {/if}
    </div>

    <!-- Advanced Effects Panel (Vignette, Grain, Glow) -->
    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
      <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Atmosphere & Depth FX</h4>

      <div>
        <div class="flex justify-between text-[11px] font-medium text-gray-600 mb-0.5">
          <span>Vignette Depth</span><span>{vignetteIntensity}%</span>
        </div>
        <input type="range" bind:value={vignetteIntensity} min="0" max="100" class="w-full accent-primary cursor-pointer" />
      </div>

      <div>
        <div class="flex justify-between text-[11px] font-medium text-gray-600 mb-0.5">
          <span>Film Grain / Paper Texture</span><span>{grainAmount}%</span>
        </div>
        <input type="range" bind:value={grainAmount} min="0" max="50" class="w-full accent-primary cursor-pointer" />
      </div>

      <div class="pt-2 border-t border-gray-200/60">
        <label class="flex items-center justify-between text-xs font-semibold cursor-pointer text-dark mb-2">
          <span class="flex items-center gap-1.5"><Icon icon="mdi:lightbulb-on-outline" /> Ambient Glow</span>
          <input type="checkbox" bind:checked={glowEnabled} class="rounded accent-primary w-4 h-4" />
        </label>
        {#if glowEnabled}
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] text-gray-500 mb-0.5">Color</label>
              <input type="color" bind:value={glowColor} class="w-full h-7 rounded border border-gray-300 cursor-pointer p-0.5" />
            </div>
            <div>
              <label class="block text-[10px] text-gray-500 mb-0.5">Intensity: {glowIntensity}px</label>
              <input type="range" bind:value={glowIntensity} min="5" max="50" class="w-full accent-primary mt-1" />
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="space-y-1">
      <div class="relative">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          bind:value={filterSearch}
          aria-label="Search filters"
          placeholder="Search 300+ filters, including TensorFlow sketches"
          class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-dark outline-none focus:border-primary"
        />
      </div>
      <p class="text-[10px] text-gray-500">{visibleFilterCount} filters</p>
    </div>

    {#each visibleFilterCategories as category}
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

  </div>

  <!-- Canvas Preview Area with Before/After & Loader Overlay -->
  <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[500px] relative">

    <div class="w-full space-y-3 border-b border-gray-200 pb-4 mb-4">
      <h3 class="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Export & Compression</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 items-end">
        <div>
          <span class="block text-[11px] font-semibold mb-1 text-gray-700">Format</span>
          <select aria-label="Export format" bind:value={exportFormat} class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-dark">
            <option value="jpeg">JPEG (.jpg)</option>
            <option value="png">PNG (.png)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>
        </div>
        <div>
          <label for="export-quality" class="block text-[11px] font-semibold mb-1 text-gray-700">Quality: {compressionQuality}%</label>
          <input id="export-quality" type="range" bind:value={compressionQuality} min="10" max="100" disabled={exportFormat === 'png'} class="w-full accent-primary cursor-pointer disabled:opacity-40 mt-2" />
        </div>
        <button type="button" onclick={openComparisonModal} class="w-full bg-dark hover:bg-black text-light font-semibold py-2.5 rounded-lg text-xs shadow transition cursor-pointer flex items-center justify-center gap-2">
          <Icon icon="mdi:compare" class="text-sm" /> Compare
        </button>
        <button type="button" onclick={exportImage} class="w-full bg-primary hover:bg-primary-dark text-light font-semibold py-2.5 rounded-lg text-xs shadow transition cursor-pointer flex items-center justify-center gap-2">
          <Icon icon="mdi:export-variant" class="text-sm" /> Export {exportFormat.toUpperCase()}
        </button>
      </div>
      {#if exportError}
        <p role="alert" class="text-xs text-danger">{exportError}</p>
      {/if}
    </div>
    
    <!-- Top Comparison Toolbar -->
    <div class="w-full flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
      <span class="text-xs font-semibold text-gray-600">
        Preview Mode: <strong class="text-dark">{showOriginal ? 'Original Source' : `Filtered (${activeFilterId})`}</strong>
      </span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick={() => isVibeModalOpen = true}
          disabled={!rawImageObj}
          class="px-4 py-1.5 bg-primary text-light rounded-lg text-xs font-bold transition shadow-xs hover:bg-primary-dark disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          <Icon icon="mdi:auto-fix" /> Vibe Search
        </button>
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
        <button
          type="button"
          onclick={openFullImagePreview}
          disabled={!previewCanvas || isProcessing}
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-dark transition hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
          aria-label="Open full-screen processed image preview"
          title="Full-screen preview"
        >
          <Icon icon="mdi:fullscreen" class="text-lg" />
        </button>
      </div>
    </div>

    {#if filterError}
      <p role="alert" class="w-full mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-danger">TensorFlow filter failed: {filterError}</p>
    {/if}

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
      <canvas
        bind:this={previewCanvas}
        class="max-w-full max-h-[500px] object-contain block {showOriginal ? 'hidden' : ''}"
        onpointerdown={handlePointerDown}
        onpointermove={handlePointerMove}
        onpointerup={handlePointerUp}
        onpointercancel={handlePointerUp}
      ></canvas>
    </div>
  </div>
</div>

<!-- Render ImageModal Component -->
<ImageModal 
  bind:isOpen={isModalOpen} 
  originalSrc={rawImageObj?.src || ''} 
  filteredSrc={filteredDataUrl} 
/>

<FullImageModal bind:isOpen={isFullImageModalOpen} imageSrc={filteredDataUrl} />

<VibeSearchModal bind:isOpen={isVibeModalOpen} imageSrc={rawImageObj?.src || ''} onApply={applyVibeFilter} />