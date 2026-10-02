<script lang="ts">
  import { onMount } from "svelte";
  import * as tf from "@tensorflow/tfjs";
  import Icon from "@iconify/svelte";
  import ImageModal from "$lib/components/ImageModal.svelte";
  import FullImageModal from "$lib/components/FullImageModal.svelte";

  let { rawImageObj }: { rawImageObj: HTMLImageElement | null } = $props();

  let previewCanvas = $state<HTMLCanvasElement | null>(null);
  let histogramCanvas = $state<HTMLCanvasElement | null>(null);
  let activeFilterId = $state<string>('normal');
  let filterSearch = $state('');
  let isProcessing = $state(false);
  let filterError = $state('');
  let filterRunId = 0;
  let isDetectingSubject = $state(false);
  let subjectMaskEnabled = $state(false);
  let subjectMaskFeather = $state(1);
  let subjectMaskError = $state('');
  let subjectSegmentation = $state<{ width: number; height: number; data: Uint8Array } | null>(null);
  let engineType = $state<'canvas' | 'tensorflow'>('canvas');
  let showOriginal = $state(false);

  let isModalOpen = $state(false);
  let isFullImageModalOpen = $state(false);
  let filteredDataUrl = $state('');

  let exportFormat = $state<'jpeg' | 'png' | 'pdf'>('jpeg');
  let compressionQuality = $state(90);
  let exportError = $state('');
  let previousRawImage: HTMLImageElement | null = null;
  let bodyPixModel: Awaited<ReturnType<typeof import('@tensorflow-models/body-pix').load>> | null = null;

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

  type SketchFamily = 'graphite' | 'charcoal' | 'contour' | 'hatching' | 'engraving' | 'stippling' | 'technical';
  type SketchFilter = { family: SketchFamily; variation: number };
  type CartoonFilter = {
    blurSize: number;
    colorLevels: number;
    edgeThreshold: number;
    edgeStrength: number;
    saturation: number;
    inkColor: [number, number, number];
  };
  type FilterDefinition = {
    id: string;
    name: string;
    type: 'canvas' | 'tensorflow';
    css?: string;
    sketch?: SketchFilter;
    cartoon?: CartoonFilter;
  };

  const tensorSketchFamilies = [
    {
      id: 'graphite',
      title: 'Tensor Graphite & Pencil Studies (35+)',
      icon: '✏️',
      names: [
        'HB Light Study', '2B Portrait Pencil', '4B Soft Shading', '6B Rich Graphite', 
        '8B Deep Graphite', '10B Heavy Graphite', 'H Fine Drafting Lead', 'Smudged Charcoal Pencil', 
        'Cross-Grain Graphite', 'Tonal Portrait Blend', 'Expressive Broad Lead', 'Paper Grain Study', 
        'Hard Lead Fine Grain', 'Soft Lead Shadow Pass', 'Layered Graphite Hatch', 'Bright Paper Pencil', 
        'Deep Value Graphite', 'Feathered Pencil Contour', 'Broad Shading Pencil', 'Fine Grain Portrait', 
        'Velvet Graphite Blend', 'Heavy Artist Pencil', 'Ultra-Fine Lead Pass', 'Deep Tone Charcoal',
        'Stippled Lead Grain', 'Contour Shading Pass', 'Structured Graphite Mesh', 'Organic Smudge Pass',
        'Matte Graphite Pass', 'High-Density Lead', 'Textured Paper Study', 'Raw Graphite Dust',
        'Precision Shading Pass', 'Subtle Tone Gradient', 'Master Artist Pencil'
      ]
    },
    {
      id: 'charcoal',
      title: 'Tensor Charcoal & Ink Washes (30+)',
      icon: '🪵',
      names: [
        'Willow Charcoal Pass', 'Compressed Vine Ink', 'Deep Shadow Block', 'Rich Ink Wash',
        'Sum-e Black Stroke', 'Heavy Carbon Core', 'Smudged Charcoal Dust', 'Dark Monolith Pass',
        'Expressive Ink Splash', 'Velvet Shadow Pass', 'Deep Void Charcoal', 'High Contrast Ink',
        'Raw Vine Charcoal', 'Soft Carbon Blend', 'Aggressive Charcoal Stroke', 'Gothic Ink Pass',
        'Deep Obsidian Shade', 'Dense Carbon Matrix', 'Subtle Charcoal Wash', 'Intense Shadow Pass',
        'Textured Vine Stroke', 'Matte Carbon Layer', 'Rich Liquid Ink', 'Deep Monochromatic Core',
        'Expressive Charcoal Pass', 'Heavy Shadow Gradient', 'Dark Contoured Ink', 'Velvety Vine Shade'
      ]
    },
    {
      id: 'contour',
      title: 'Tensor Contour & Line Sketches (20)',
      icon: '🖊️',
      names: ['Fine Contour', 'Clean Outline', 'Soft Edge Study', 'Bold Gesture Lines', 'Minimal Contours', 'Double-Weight Outline', 'Portrait Contour', 'Architectural Contour', 'High-Contrast Ink', 'Loose Gesture Study', 'Whisper Thin Outline', 'Confident Brush Contour', 'Broken Edge Drawing', 'Continuous Line Study', 'Soft Portrait Edges', 'Graphic Black Contour', 'Expressive Face Lines', 'Light Gesture Pass', 'Heavy Silhouette Ink', 'Contour Detail Pass']
    },
    {
      id: 'hatching',
      title: 'Tensor Pen Hatching & Crosshatch (20)',
      icon: '✒️',
      names: ['Single Diagonal Hatch', 'Fine Crosshatch', 'Dense Crosshatch', 'Loose Parallel Hatch', 'Four-Way Ink Hatch', 'Shadow Hatch', 'Etching Hatch', 'Fine Nib Hatching', 'Bold Nib Hatching', 'Illustration Crosshatch', 'Wide-Spaced Hatch', 'Tight Shadow Crosshatch', 'Light Pencil Hatch', 'Heavy Ink Hatch', 'Portrait Form Hatching', 'Angled Shade Lines', 'Layered Nib Crosshatch', 'Soft Parallel Shading', 'Deep Black Crosshatch', 'Open Line Hatching']
    },
    {
      id: 'engraving',
      title: 'Tensor Engraving & Lithography (20)',
      icon: '🖋️',
      names: ['Copperplate Engraving', 'Woodcut Linework', 'Antique Etching', 'Lithographic Pencil', 'Newsprint Engraving', 'Fine-Line Etching', 'Bold Relief Print', 'Soft Plate Tone', 'Vintage Ink Press', 'Detailed Engraver', 'Fine Copperplate Lines', 'Deep Wood Engraving', 'Soft Litho Shading', 'Classic Steel Etch', 'Textured Relief Study', 'Antique Plate Hatching', 'Fine Intaglio Detail', 'Bold Pressed Ink', 'Tonal Engraving', 'Cross-Line Print Study']
    },
    {
      id: 'stippling',
      title: 'Tensor Stipple & Dot-Pen Studies (20)',
      icon: '⚫',
      names: ['Fine Stipple', 'Portrait Dotwork', 'Sparse Pointillism', 'Dense Ink Dots', 'Soft Halftone Pencil', 'Bold Halftone Pen', 'Micro-Dot Shading', 'Loose Stipple Study', 'Graphic Dot Screen', 'Tonal Pointillism', 'Fine Nib Dot Shading', 'Airy Stipple Portrait', 'Dense Shadow Dotwork', 'Wide Halftone Screen', 'Soft Grain Pointillism', 'Graphic Ink Stipple', 'Microtone Dot Study', 'Bold Screenprint Dots', 'Sparse Pencil Stipple', 'Layered Dot Shading']
    },
    {
      id: 'technical',
      title: 'Tensor Technical & Architectural Pen (10)',
      icon: '📐',
      names: ['Drafting Pencil', 'Blueprint Line Study', 'Fine Technical Pen', 'Architectural Ink', 'Measured Contours', 'Precision Outline', 'Plan Drawing', 'Structural Edge Study', 'Technical Crosshatch', 'Clean Diagram Ink']
    }
  ] as const;

  const tensorSketchCategories = tensorSketchFamilies.map((family) => ({
    name: family.title,
    filters: family.names.map((name, variation) => ({
      id: `tf_sketch_${family.id}_${variation + 1}`,
      name: `${family.icon} TF ${name}`,
      type: 'tensorflow' as const,
      sketch: { family: family.id, variation }
    }))
  }));

  const cartoonInkColors: [number, number, number][] = [
    [24, 24, 28], [36, 28, 54], [20, 48, 70], [65, 34, 26], [32, 60, 42], [12, 12, 16]
  ];
  const cartoonFilterNames = [
    'Classic Cel Animation', 'Bold Comic Book', 'Soft Anime Outline', 'Pastel Storybook Toon',
    'Saturday Morning Cartoon', 'Graphic Novel Ink', 'Clean Vector Toon', 'Retro Print Cartoon',
    'Watercolor Animation', 'High-Key Character Cel', 'Noir Toon Outline', 'Warm Picture Book',
    'Neon Pop Cartoon', 'Muted Editorial Toon', 'Heavy Ink Animation', 'Light Pencil Cartoon',
    'Vintage Comic Halftone', 'Soft Portrait Toon', 'Crisp Studio Animation', 'Limited Palette Toon',
    'Dreamy Pastel Anime', 'Hard Shadow Cel Shade', 'Expressive Brush Cartoon', 'Fine-Line Cartoon'
  ];
  const cartoonCategory = {
    name: 'TensorFlow Cartoonify Styles (24)',
    filters: cartoonFilterNames.map((name, index) => ({
      id: `tf_cartoonify_${String(index + 1).padStart(2, '0')}`,
      name: `🎨 TF ${name}`,
      type: 'tensorflow' as const,
      cartoon: {
        blurSize: [3, 5, 7][Math.floor(index / 4) % 3],
        colorLevels: [4, 5, 6, 7, 8, 9][index % 6],
        edgeThreshold: [28, 42, 58, 76, 96, 122][Math.floor(index / 4) % 6],
        edgeStrength: 0.45 + (index % 6) * 0.1,
        saturation: [0.75, 0.95, 1.15, 1.35, 1.55, 1.75][Math.floor(index / 4) % 6],
        inkColor: cartoonInkColors[index % cartoonInkColors.length]
      }
    }))
  };

  const canvasSketchFamilies = [
    {
      id: 'graphite',
      title: 'Canvas Graphite & Pencil Presets (10)',
      icon: '✏️',
      names: ['2H Drafting Lead', 'HB Everyday Pencil', '2B Portrait Shading', '4B Soft Graphite', '6B Dark Graphite', 'Pencil on Vellum', 'Soft Blend Pencil', 'Bright Paper Study', 'Toned Paper Graphite', 'Expressive Pencil Grain']
    },
    {
      id: 'ink',
      title: 'Canvas Pen & Ink Presets (10)',
      icon: '🖋️',
      names: ['Fine-Liner Outline', 'Bold Brush Ink', 'Blue Ballpoint Study', 'Red Ballpoint Study', 'Fountain Pen Wash', 'Dip Pen Blackline', 'Manga Inker', 'Technical Pen', 'Quill on Parchment', 'White Chalk Ink']
    },
    {
      id: 'charcoal',
      title: 'Canvas Charcoal & Chalk Presets (10)',
      icon: '🪵',
      names: ['Willow Charcoal', 'Compressed Charcoal', 'Chalk on Slate', 'Sanguine Chalk', 'Conte Crayon', 'Soft Charcoal Blend', 'Deep Shadow Charcoal', 'Light Chalk Outline', 'Gesture Charcoal', 'Dusty Charcoal Paper']
    },
    {
      id: 'print',
      title: 'Canvas Etching & Print Presets (10)',
      icon: '🏛️',
      names: ['Copperplate Etching', 'Woodcut Contrast', 'Linocut Ink', 'Antique Lithograph', 'Mezzotint Tone', 'Aquatint Study', 'Newsprint Halftone', 'Relief Print Ink', 'Vintage Engraving', 'Fine Plate Lines']
    },
    {
      id: 'paper',
      title: 'Canvas Paper & Drafting Presets (10)',
      icon: '📐',
      names: ['Blueprint Draft', 'Cyanotype Lines', 'Sepia Architecture', 'Ledger Pencil', 'Rice Paper Wash', 'Parchment Quill', 'Mechanical Draft', 'Isometric Plan', 'Vellum Contour', 'Architectural Ink']
    }
  ] as const;

  const canvasSketchCategories = canvasSketchFamilies.map((family) => ({
    name: family.title,
    filters: family.names.map((name, variation) => {
      const index = variation % 5;
      const cssByFamily: Record<(typeof canvasSketchFamilies)[number]['id'], string[]> = {
        graphite: [
          'grayscale(100%) contrast(125%) brightness(122%)', 'grayscale(100%) contrast(150%) brightness(112%) blur(0.2px)',
          'grayscale(100%) contrast(185%) brightness(100%) blur(0.4px)', 'grayscale(100%) contrast(225%) brightness(90%) blur(0.6px)',
          'grayscale(100%) contrast(270%) brightness(78%) blur(0.8px)'
        ],
        ink: [
          'grayscale(100%) contrast(155%) brightness(118%)', 'grayscale(100%) contrast(205%) brightness(105%)',
          'saturate(260%) hue-rotate(205deg) contrast(165%)', 'saturate(280%) hue-rotate(330deg) contrast(170%)',
          'grayscale(100%) contrast(290%) brightness(88%)'
        ],
        charcoal: [
          'grayscale(100%) contrast(155%) brightness(112%) blur(0.3px)', 'grayscale(100%) contrast(210%) brightness(98%) blur(0.5px)',
          'grayscale(100%) invert(100%) contrast(230%) brightness(110%)', 'sepia(90%) saturate(170%) hue-rotate(330deg) contrast(145%)',
          'grayscale(100%) contrast(300%) brightness(75%) blur(0.9px)'
        ],
        print: [
          'grayscale(100%) contrast(155%) brightness(115%)', 'grayscale(100%) contrast(205%) brightness(102%)',
          'grayscale(100%) contrast(250%) brightness(92%)', 'grayscale(100%) contrast(295%) brightness(82%)',
          'grayscale(100%) sepia(35%) contrast(180%) brightness(102%)'
        ],
        paper: [
          'grayscale(100%) invert(92%) hue-rotate(185deg) contrast(210%)', 'grayscale(100%) sepia(18%) contrast(155%) brightness(115%)',
          'grayscale(100%) sepia(45%) contrast(175%) brightness(106%)', 'grayscale(100%) contrast(205%) brightness(110%) blur(0.25px)',
          'grayscale(100%) sepia(65%) contrast(145%) brightness(112%) blur(0.4px)'
        ]
      };
      return {
        id: `canvas_sketch_${family.id}_${variation + 1}`,
        name: `${family.icon} Canvas ${name}`,
        type: 'canvas' as const,
        css: `${cssByFamily[family.id][index]} brightness(${96 + variation * 0.8}%) contrast(${98 + variation * 0.6}%)`
      };
    })
  }));

  const filterCategories: { name: string; filters: FilterDefinition[] }[] = [
    cartoonCategory,
    ...tensorSketchCategories,
    ...canvasSketchCategories,
    {
      name: "Master Sketch & Pen Suite (50+ Styles)",
      filters: [
        { id: 'sketch_outline', name: '✏️ TF Clean Line Outlines', type: 'tensorflow' },
        { id: 'sketch_minimal', name: '🖋️ TF Minimalist Contours', type: 'tensorflow' },
        { id: 'sketch_graphite', name: '📝 Soft Graphite Pencil', type: 'canvas', css: 'grayscale(100%) contrast(140%) brightness(110%) blur(0.5px)' },
        { id: 'sketch_crosshatch', name: '✒️ Fine Ink Pen & Hatch', type: 'canvas', css: 'grayscale(100%) contrast(220%) brightness(95%) invert(15%)' },
        { id: 'sketch_charcoal', name: '🪵 Deep Charcoal Sketch', type: 'canvas', css: 'grayscale(100%) contrast(250%) brightness(85%) blur(0.8px)' },
        { id: 'tf_detailed_portrait', name: '👤 TF Professional Pencil Portrait', type: 'tensorflow' },
        { id: 'tf_stipple_dot', name: '⚫ TF Pointillism Stipple Ink', type: 'tensorflow' },
        { id: 'tf_blueprint_sketch', name: '📏 TF Architectural Line Study', type: 'tensorflow' },
        { id: 'tf_lithograph', name: '🏛️ TF Antique Lithograph Press', type: 'tensorflow' },
        { id: 'sketch_calligraphy', name: '✒️ Heavy Calligraphy Nib Ink', type: 'canvas', css: 'grayscale(100%) contrast(300%) brightness(90%)' },
        { id: 'sketch_gestural', name: '⚡ Gestural Quick Contour', type: 'canvas', css: 'grayscale(100%) contrast(190%) brightness(115%) blur(0.4px)' },
        { id: 'sketch_architectural', name: '📐 Precise Drafting Line', type: 'canvas', css: 'grayscale(100%) contrast(240%) brightness(105%) invert(5%)' },
        { id: 'sketch_vellum', name: '📜 Translucent Vellum Pencil', type: 'canvas', css: 'grayscale(100%) sepia(30%) contrast(150%) brightness(110%)' },
        { id: 'sketch_newsprint', name: '📰 Newsprint Quick Sketch', type: 'canvas', css: 'grayscale(100%) sepia(20%) contrast(170%) brightness(100%)' },
        { id: 'cs_01', name: '🖋️ 2H Hard Technical Pencil', type: 'canvas', css: 'grayscale(100%) contrast(130%) brightness(120%)' },
        { id: 'cs_02', name: '✏️ 4B Soft Dark Graphite', type: 'canvas', css: 'grayscale(100%) contrast(190%) brightness(85%) blur(0.4px)' },
        { id: 'cs_03', name: '🪵 6B Extra Dark Charcoal', type: 'canvas', css: 'grayscale(100%) contrast(280%) brightness(75%) blur(0.7px)' },
        { id: 'cs_04', name: '✒️ Archival Micron Pen 0.1', type: 'canvas', css: 'grayscale(100%) contrast(250%) brightness(95%)' },
        { id: 'cs_05', name: '🖋️ Archival Micron Pen 0.5', type: 'canvas', css: 'grayscale(100%) contrast(210%) brightness(100%)' },
        { id: 'cs_06', name: '🖌️ Chinese Bamboo Brush Ink', type: 'canvas', css: 'grayscale(100%) contrast(320%) brightness(80%) blur(0.9px)' },
        { id: 'cs_07', name: '✒️ Japanese Sumi-E Ink Wash', type: 'canvas', css: 'grayscale(100%) contrast(180%) brightness(110%) blur(1.2px)' },
        { id: 'cs_08', name: '📜 Antique Parchment Sketch', type: 'canvas', css: 'grayscale(100%) sepia(70%) contrast(160%) brightness(105%)' },
        { id: 'cs_09', name: '🏛️ Renaissance Silverpoint', type: 'canvas', css: 'grayscale(100%) sepia(20%) contrast(140%) brightness(115%)' },
        { id: 'cs_10', name: '📐 Blueprint Cyanotype', type: 'canvas', css: 'grayscale(100%) invert(95%) hue-rotate(190deg) contrast(220%)' },
        { id: 'cs_11', name: '📐 Sepia Architectural Draft', type: 'canvas', css: 'grayscale(100%) invert(90%) sepia(100%) hue-rotate(-30deg) contrast(200%)' },
        { id: 'cs_12', name: '📝 Vintage Ledger Pencil', type: 'canvas', css: 'grayscale(100%) sepia(45%) contrast(150%) brightness(108%)' },
        { id: 'cs_13', name: '📰 Rough Newsprint Etching', type: 'canvas', css: 'grayscale(100%) contrast(210%) brightness(102%) sepia(10%)' },
        { id: 'cs_14', name: '🖊️ Ballpoint Pen Blue Sketch', type: 'canvas', css: 'saturate(300%) hue-rotate(210deg) contrast(170%) brightness(95%)' },
        { id: 'cs_15', name: '🖊️ Ballpoint Pen Red Sketch', type: 'canvas', css: 'saturate(300%) hue-rotate(330deg) contrast(180%) brightness(90%)' },
        { id: 'cs_16', name: '🪵 Compressed Willow Charcoal', type: 'canvas', css: 'grayscale(100%) contrast(300%) brightness(70%) blur(1px)' },
        { id: 'cs_17', name: '🪵 White Chalk on Black Board', type: 'canvas', css: 'grayscale(100%) invert(100%) contrast(250%) brightness(110%)' },
        { id: 'cs_18', name: '🪵 Sanguine Red Chalk Study', type: 'canvas', css: 'grayscale(100%) sepia(100%) hue-rotate(-35deg) saturate(250%) contrast(140%)' },
        { id: 'cs_19', name: '🪵 Conte Crayon Noir', type: 'canvas', css: 'grayscale(100%) contrast(260%) brightness(82%) blur(0.6px)' },
        { id: 'cs_20', name: '🌾 Tinted Tone Paper Sketch', type: 'canvas', css: 'grayscale(100%) sepia(35%) contrast(165%) brightness(102%)' },
        { id: 'cs_21', name: '✏️ Cross-Hatch Fine Shade', type: 'canvas', css: 'grayscale(100%) contrast(240%) brightness(90%)' },
        { id: 'cs_22', name: '✏️ Diagonal Parallel Hatch', type: 'canvas', css: 'grayscale(100%) contrast(190%) brightness(105%) blur(0.3px)' },
        { id: 'cs_23', name: '✒️ Contour Line Drawing', type: 'canvas', css: 'grayscale(100%) contrast(280%) brightness(98%)' },
        { id: 'cs_24', name: '🖋️ Minimalist Gesture Pen', type: 'canvas', css: 'grayscale(100%) contrast(170%) brightness(112%)' },
        { id: 'cs_25', name: '📝 Rough Aesthetic Scribble', type: 'canvas', css: 'grayscale(100%) contrast(200%) brightness(105%) blur(0.5px)' },
        { id: 'cs_26', name: '🖌️ Gouache Line & Wash', type: 'canvas', css: 'grayscale(100%) contrast(160%) brightness(110%) saturate(120%)' },
        { id: 'cs_27', name: '✒️ Fountain Pen Fluid Stroke', type: 'canvas', css: 'grayscale(100%) contrast(220%) brightness(95%)' },
        { id: 'cs_28', name: '🖋️ Dip Pen & Liquid Ink', type: 'canvas', css: 'grayscale(100%) contrast(290%) brightness(88%)' },
        { id: 'cs_29', name: '📝 Editorial Cartoon Ink', type: 'canvas', css: 'grayscale(100%) contrast(270%) brightness(102%)' },
        { id: 'cs_30', name: '🪵 Academic Life Drawing Charcoal', type: 'canvas', css: 'grayscale(100%) contrast(210%) brightness(88%) blur(0.6px)' },
        { id: 'cs_31', name: '📜 Antique Manuscript Quill', type: 'canvas', css: 'grayscale(100%) sepia(85%) contrast(190%) brightness(95%)' },
        { id: 'cs_32', name: '📐 Mechanical Draftsman Pen', type: 'canvas', css: 'grayscale(100%) contrast(230%) brightness(108%)' },
        { id: 'cs_33', name: '✒️ Comic Book Inker Pro', type: 'canvas', css: 'grayscale(100%) contrast(310%) brightness(90%)' },
        { id: 'cs_34', name: '🖋️ Manga Speed Pen Stroke', type: 'canvas', css: 'grayscale(100%) contrast(280%) brightness(100%)' },
        { id: 'cs_35', name: '📝 Storyboard Rough Pencil', type: 'canvas', css: 'grayscale(100%) contrast(150%) brightness(115%) blur(0.7px)' },
        { id: 'cs_36', name: '✏️ Hard Pastel Pencil Sketch', type: 'canvas', css: 'grayscale(100%) contrast(135%) brightness(125%)' },
        { id: 'cs_37', name: '🪵 Soft Pastel Sketch Shade', type: 'canvas', css: 'grayscale(100%) contrast(175%) brightness(105%) blur(0.8px)' },
        { id: 'cs_38', name: '✒️ Copperplate Calligraphy Ink', type: 'canvas', css: 'grayscale(100%) contrast(300%) brightness(85%)' },
        { id: 'cs_39', name: '🖋️ Gothic Blackletter Ink', type: 'canvas', css: 'grayscale(100%) contrast(340%) brightness(75%)' },
        { id: 'cs_40', name: '📝 Italic Nib Handwriting', type: 'canvas', css: 'grayscale(100%) contrast(220%) brightness(96%)' },
        { id: 'cs_41', name: '📐 Engineering Isometric Grid', type: 'canvas', css: 'grayscale(100%) contrast(190%) brightness(110%) invert(8%)' },
        { id: 'cs_42', name: '🏛️ Etching Plate Copperline', type: 'canvas', css: 'grayscale(100%) contrast(210%) brightness(98%) sepia(15%)' },
        { id: 'cs_43', name: '🏛️ Woodcut Block Print', type: 'canvas', css: 'grayscale(100%) contrast(350%) brightness(70%)' },
        { id: 'cs_44', name: '🏛️ Linocut Impression', type: 'canvas', css: 'grayscale(100%) contrast(280%) brightness(85%)' },
        { id: 'cs_45', name: '🏛️ Mezzotint Tone Shading', type: 'canvas', css: 'grayscale(100%) contrast(170%) brightness(92%) blur(0.5px)' },
        { id: 'cs_46', name: '🏛️ Aquatint Fine Etch', type: 'canvas', css: 'grayscale(100%) contrast(160%) brightness(102%) blur(0.4px)' },
        { id: 'cs_47', name: '📜 Papyrus Sketch Texture', type: 'canvas', css: 'grayscale(100%) sepia(60%) contrast(140%) brightness(112%)' },
        { id: 'cs_48', name: '🌾 Rice Paper Sumi Wash', type: 'canvas', css: 'grayscale(100%) sepia(15%) contrast(130%) brightness(118%) blur(0.6px)' },
        { id: 'cs_49', name: '✏️ Designer Concept Sketch', type: 'canvas', css: 'grayscale(100%) contrast(160%) brightness(110%) blur(0.3px)' },
        { id: 'cs_50', name: '✒️ Master Illustrator Lineart', type: 'canvas', css: 'grayscale(100%) contrast(260%) brightness(98%)' }
      ]
    },
    {
      name: "Cinematic & Film Grades (30+ Styles)",
      filters: [
        { id: 'cine_technicolor_35', name: '🎬 1935 Technicolor Two-Strip', type: 'canvas', css: 'sepia(40%) saturate(220%) hue-rotate(-15deg) contrast(120%)' },
        { id: 'cine_blade_runner', name: '🌧️ Blade Runner Amber & Teal', type: 'canvas', css: 'contrast(130%) saturate(140%) hue-rotate(25deg) sepia(20%)' },
        { id: 'cine_matrix_green', name: '💻 The Matrix Terminal Code', type: 'canvas', css: 'grayscale(100%) sepia(100%) hue-rotate(85deg) saturate(400%) contrast(150%)' },
        { id: 'cine_cyberpunk_neon', name: '⚡ Cyberpunk Neon District', type: 'canvas', css: 'saturate(300%) contrast(150%) hue-rotate(290deg)' },
        { id: 'cine_kodachrome_64', name: '🎞️ Classic Kodachrome 64', type: 'canvas', css: 'contrast(140%) saturate(160%) sepia(15%) brightness(105%)' },
        { id: 'cine_panavision_noir', name: '🕵️ Panavision High-Contrast Noir', type: 'canvas', css: 'grayscale(100%) contrast(210%) brightness(85%)' },
        { id: 'cine_bleach_bypass', name: '🧪 Silver Bleach Bypass Film', type: 'canvas', css: 'grayscale(50%) contrast(190%) brightness(110%)' },
        { id: 'cine_cross_process', name: '🧪 Cross-Processed Slide Stock', type: 'canvas', css: 'saturate(200%) hue-rotate(320deg) contrast(130%)' },
        { id: 'cine_teal_orange', name: '🎬 Hollywood Blockbuster Teal & Orange', type: 'canvas', css: 'contrast(125%) saturate(150%) hue-rotate(15deg)' },
        { id: 'cine_vintage_70s', name: '📻 1970s Warm Fade Film', type: 'canvas', css: 'sepia(60%) contrast(85%) brightness(110%) saturate(75%)' },
        { id: 'cine_nordic_ice', name: '❄️ Nordic Noir Cold Frost', type: 'canvas', css: 'hue-rotate(195deg) saturate(70%) contrast(120%) brightness(105%)' },
        { id: 'cine_sunset_noir', name: '🌇 Golden Hour Sunset Drama', type: 'canvas', css: 'sepia(45%) saturate(180%) hue-rotate(-25deg) contrast(130%)' },
        { id: 'cine_sepia_dream', name: '📜 Antique Sepia Cinema', type: 'canvas', css: 'sepia(90%) contrast(120%) brightness(105%)' },
        { id: 'cine_polaroid_600', name: '📸 Vintage Polaroid Fade', type: 'canvas', css: 'contrast(90%) brightness(120%) saturate(70%) sepia(25%)' },
        { id: 'cine_super_8', name: '📼 Super 8 Home Movie Grain', type: 'canvas', css: 'contrast(150%) saturate(120%) sepia(40%) blur(0.3px)' },
        { id: 'cine_technicolor_3strip', name: '🎨 Technicolor 3-Strip Vibrant', type: 'canvas', css: 'saturate(240%) contrast(130%) brightness(102%)' },
        { id: 'cine_ghibli_anime', name: '🌸 Anime Studio Ghibli Vibrant', type: 'canvas', css: 'brightness(112%) saturate(160%) contrast(105%) hue-rotate(5deg)' },
        { id: 'cine_sin_city', name: '❤ Sin City Selective Red', type: 'canvas', css: 'grayscale(100%) contrast(250%) saturate(500%) hue-rotate(-40deg)' },
        { id: 'cine_fuji_velvia', name: '🌲 Fujifilm Velvia Landscape', type: 'canvas', css: 'saturate(220%) contrast(135%) brightness(98%)' },
        { id: 'cine_edward_hopper', name: '🎨 Cinematic Painterly Light', type: 'canvas', css: 'contrast(115%) saturate(130%) sepia(15%) brightness(108%)' }
      ]
    },
    {
      name: "Professional Studio & Retouch",
      filters: [
        { id: 'normal', name: '🌟 Original Studio', type: 'canvas', css: 'none' },
        { id: 'studio_soft', name: '✨ Soft Portrait Glow', type: 'canvas', css: 'brightness(105%) contrast(95%) blur(0.3px) saturate(105%)' },
        { id: 'studio_crisp', name: '💎 High Definition Edge', type: 'canvas', css: 'contrast(135%) saturate(110%) brightness(102%)' },
        { id: 'matte_film', name: '🎞 Matte Cinematic Film', type: 'canvas', css: 'contrast(90%) brightness(105%) saturate(85%) sepia(15%)' },
        { id: 'rich_shadows', name: '🌑 Rich Shadow Balance', type: 'canvas', css: 'contrast(120%) brightness(95%) saturate(115%)' },
        { id: 'studio_clarity', name: '🔍 Ultra Clarity & Definition', type: 'canvas', css: 'contrast(150%) saturate(120%) brightness(105%)' },
        { id: 'retouch_porcelain', name: '🧖‍♀️ Porcelain Skin Softening', type: 'canvas', css: 'brightness(108%) contrast(90%) blur(0.4px) saturate(98%)' },
        { id: 'retouch_high_fashion', name: '👠 High Fashion Editorial Contrast', type: 'canvas', css: 'contrast(160%) saturate(110%) brightness(102%) grayscale(10%)' },
        { id: 'retouch_warm_ivory', name: '🦢 Warm Ivory Portrait Tone', type: 'canvas', css: 'sepia(18% ) brightness(106%) saturate(105%) contrast(102%)' },
        { id: 'retouch_cool_porcelain', name: '❄️ Cool Porcelain Skin Balance', type: 'canvas', css: 'hue-rotate(185deg) saturate(85%) contrast(105%) brightness(104%)' },
        { id: 'retouch_bronze_tan', name: '🏽 Sun-Kissed Bronze Glow', type: 'canvas', css: 'sepia(35% ) saturate(130%) contrast(110%) brightness(98%)' },
        { id: 'retouch_caramel_skin', name: '🍮 Caramel Tone Retouch', type: 'canvas', css: 'sepia(25% ) saturate(120%) contrast(108%) brightness(102%)' },
        { id: 'retouch_matte_skin', name: '🧊 Anti-Shine Matte Finish', type: 'canvas', css: 'contrast(115%) brightness(96%) saturate(90%)' },
        { id: 'retouch_airbrushed', name: '💨 Studio Airbrushed Look', type: 'canvas', css: 'brightness(110%) contrast(92%) blur(0.6px) saturate(102%)' },
        { id: 'retouch_commercial_pop', name: '🏷️ Commercial Product Pop', type: 'canvas', css: 'contrast(140%) saturate(130%) brightness(104%)' },
        { id: 'retouch_clean_headshot', name: '👤 Clean Corporate Headshot', type: 'canvas', css: 'contrast(115%) brightness(105%) saturate(102%)' },
        { id: 'retouch_beautifying', name: '🌸 Soft Focus Beautifying', type: 'canvas', css: 'brightness(107%) contrast(95%) blur(0.5px)' },
        { id: 'retouch_vibrant_lips', name: '💄 Rich Accent Saturation', type: 'canvas', css: 'saturate(145%) contrast(115%) brightness(102%)' },
        { id: 'retouch_deep_tan', name: '🏽 Deep Sunlit Retouch', type: 'canvas', css: 'sepia(40% ) saturate(140%) contrast(112%) brightness(95%)' },
        { id: 'retouch_silk_skin', name: '🧵 Silk Texture Smoothness', type: 'canvas', css: 'brightness(106%) contrast(94%) blur(0.45px)' },
        { id: 'retouch_glamour_glow', name: '✨ 90s Glamour Glow', type: 'canvas', css: 'brightness(115%) contrast(88%) blur(0.8px) saturate(110%)' },
        { id: 'retouch_studio_key', name: '💡 High Key Studio Lighting', type: 'canvas', css: 'brightness(125%) contrast(95%) saturate(95%)' },
        { id: 'retouch_low_key', name: '🔦 Low Key Dramatic Shadows', type: 'canvas', css: 'brightness(75%) contrast(170%) saturate(110%)' },
        { id: 'retouch_rim_light', name: '⚡ Edge Rim Light Enhancement', type: 'canvas', css: 'contrast(165%) brightness(108%) saturate(120%)' },
        { id: 'retouch_studio_fill', name: '🛋️ Balanced Studio Fill Light', type: 'canvas', css: 'brightness(110%) contrast(100%) saturate(105%)' },
        { id: 'retouch_neutral_bal', name: '⚖️ Neutral Gray Balancer', type: 'canvas', css: 'grayscale(20%) contrast(110%) brightness(102%)' },
        { id: 'retouch_sharp_eyes', name: '👁️ High-Frequency Detail Sharp', type: 'canvas', css: 'contrast(155%) saturate(110%)' },
        { id: 'retouch_subtle_warm', name: '🌤️ Subtle Morning Warmth', type: 'canvas', css: 'sepia(12%) brightness(103%) saturate(108%)' },
        { id: 'retouch_cool_tone', name: '🧊 Crisp Architectural White', type: 'canvas', css: 'hue-rotate(190deg) saturate(90%) brightness(105%)' },
        { id: 'retouch_golden_skin', name: '🍯 Golden Hour Portrait Balance', type: 'canvas', css: 'sepia(30%) saturate(135%) contrast(105%)' },
        { id: 'retouch_peachy_glow', name: '🍑 Soft Peachy Glow', type: 'canvas', css: 'sepia(15%) hue-rotate(-10deg) saturate(120%) brightness(106%)' },
        { id: 'retouch_rose_complexion', name: '🌹 Rose Complexion Tint', type: 'canvas', css: 'hue-rotate(345deg) saturate(125%) brightness(104%)' },
        { id: 'retouch_olive_skin', name: '🫒 Olive Skin Complexion', type: 'canvas', css: 'hue-rotate(45deg) saturate(90%) contrast(105%)' },
        { id: 'retouch_espresso_tone', name: '☕ Rich Espresso Tone', type: 'canvas', css: 'sepia(50%) contrast(130%) brightness(90%)' },
        { id: 'retouch_alabaster', name: '🦢 Alabaster White Balance', type: 'canvas', css: 'brightness(112%) contrast(92%) saturate(95%)' },
        { id: 'retouch_ivory_glow', name: '✨ Polished Ivory Glow', type: 'canvas', css: 'brightness(108%) contrast(98%) sepia(10%)' },
        { id: 'retouch_velvet_skin', name: '🧸 Velvet Texture Tone', type: 'canvas', css: 'contrast(105%) brightness(102%) blur(0.25px)' },
        { id: 'retouch_satin_finish', name: '🎗️ Satin Gloss Finish', type: 'canvas', css: 'contrast(120%) brightness(104%) saturate(105%)' },
        { id: 'retouch_crystal_clear', name: '💎 Crystal Clear Retouch', type: 'canvas', css: 'contrast(140%) brightness(105%) saturate(112%)' },
        { id: 'retouch_studio_master', name: '👑 Master Studio Grade', type: 'canvas', css: 'contrast(130%) brightness(103%) saturate(110%)' },
        { id: 'retouch_natural_balance', name: '🌿 True-to-Life Natural', type: 'canvas', css: 'contrast(105%) brightness(101%) saturate(102%)' },
        { id: 'retouch_pro_portrait', name: '📷 Professional Portrait Polish', type: 'canvas', css: 'contrast(118%) brightness(104%) saturate(106%)' },
        { id: 'retouch_soft_contrast', name: '☁️ Soft Contrast Enhancer', type: 'canvas', css: 'contrast(92%) brightness(106%) saturate(102%)' },
        { id: 'retouch_dynamic_range', name: '📈 Dynamic Range Recovery', type: 'canvas', css: 'contrast(110%) brightness(105%) saturate(115%)' },
        { id: 'retouch_highlight_saver', name: '☀️ Highlight Tone Optimizer', type: 'canvas', css: 'brightness(95%) contrast(125%) saturate(105%)' },
        { id: 'retouch_shadow_lift', name: '🔦 Shadow Detail Enhancer', type: 'canvas', css: 'brightness(115%) contrast(90%) saturate(105%)' },
        { id: 'retouch_midtone_punch', name: '🎯 Midtone Structural Punch', type: 'canvas', css: 'contrast(145%) brightness(101%)' },
        { id: 'retouch_editorial_clean', name: '📰 Editorial Clean Finish', type: 'canvas', css: 'contrast(122%) brightness(103%) saturate(98%)' },
        { id: 'retouch_catalog_look', name: '📖 Studio Catalog Standard', type: 'canvas', css: 'contrast(115%) brightness(105%) saturate(105%)' },
        { id: 'retouch_magazine_cover', name: '🌟 Magazine Cover Grade', type: 'canvas', css: 'contrast(135%) brightness(102%) saturate(118%)' },
        { id: 'retouch_skin_perfection', name: '💖 Ultimate Skin Perfection', type: 'canvas', css: 'brightness(106%) contrast(93%) blur(0.35px) saturate(102%)' }
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
        { id: 'tf_emboss', name: '🗿 TF Laplacian Emboss', type: 'tensorflow' },
        { id: 'tf_sharpen', name: '🔪 TF High-Pass Sharpen Matrix', type: 'tensorflow' },
        { id: 'tf_thermal', name: '🌡️ TF Thermal Heatmap', type: 'tensorflow' }
      ]
    }
  ];

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

  const detectSubject = async () => {
    if (!rawImageObj) return;
    isDetectingSubject = true;
    subjectMaskError = '';
    try {
      await tf.ready();
      const bodyPix = await import('@tensorflow-models/body-pix');
      bodyPixModel ??= await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
      });
      const segmentation = await bodyPixModel.segmentPerson(rawImageObj, {
        internalResolution: 'medium',
        segmentationThreshold: 0.7
      });
      subjectSegmentation = {
        width: segmentation.width,
        height: segmentation.height,
        data: segmentation.data
      };
      subjectMaskEnabled = true;
    } catch (error) {
      subjectMaskError = error instanceof Error ? error.message : 'TensorFlow.js could not detect a person in this image.';
    } finally {
      isDetectingSubject = false;
    }
  };

  const applySubjectMask = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!subjectMaskEnabled || !subjectSegmentation) return;

    const { width: maskWidth, height: maskHeight, data } = subjectSegmentation;
    if (!maskWidth || !maskHeight || data.length !== maskWidth * maskHeight) return;

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = maskWidth;
    maskCanvas.height = maskHeight;
    const maskContext = maskCanvas.getContext('2d');
    if (!maskContext) return;

    const maskImage = maskContext.createImageData(maskWidth, maskHeight);
    for (let pixel = 0; pixel < data.length; pixel++) {
      const colorIndex = pixel * 4;
      maskImage.data[colorIndex] = 255;
      maskImage.data[colorIndex + 1] = 255;
      maskImage.data[colorIndex + 2] = 255;
      maskImage.data[colorIndex + 3] = data[pixel] > 0 ? 255 : 0;
    }
    maskContext.putImageData(maskImage, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.filter = subjectMaskFeather > 0 ? `blur(${subjectMaskFeather}px)` : 'none';
    ctx.drawImage(maskCanvas, 0, 0, width, height);
    ctx.restore();
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
      applySubjectMask(ctx, previewCanvas.width, previewCanvas.height);
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
        applySubjectMask(ctx, previewCanvas.width, previewCanvas.height);
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

    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:person-scan" class="text-primary text-base" />
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">Smart Subject Mask</h4>
      </div>
      <p class="text-[11px] leading-relaxed text-gray-600">TensorFlow.js detects and isolates a person. The model loads on demand and runs in your browser.</p>
      <button
        type="button"
        onclick={detectSubject}
        disabled={!rawImageObj || isDetectingSubject}
        class="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-light font-semibold py-2.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-2"
      >
        <Icon icon={isDetectingSubject ? 'mdi:loading' : 'mdi:face-recognition'} class={isDetectingSubject ? 'animate-spin' : ''} />
        {isDetectingSubject ? 'Detecting person...' : subjectSegmentation ? 'Detect person again' : 'Detect & isolate person'}
      </button>
      {#if subjectSegmentation}
        <div class="space-y-2 border-t border-gray-200 pt-3">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] text-gray-600">{subjectMaskEnabled ? 'Person isolated; PNG preserves transparency' : 'Person mask ready'}</span>
            <button type="button" onclick={() => subjectMaskEnabled = !subjectMaskEnabled} class="text-[11px] font-semibold text-primary hover:underline cursor-pointer">
              {subjectMaskEnabled ? 'Show full image' : 'Isolate'}
            </button>
          </div>
          <div>
            <label for="subject-mask-feather" class="flex justify-between text-[11px] font-medium text-gray-600 mb-0.5">
              <span>Mask edge softness</span><span>{subjectMaskFeather}px</span>
            </label>
            <input id="subject-mask-feather" type="range" bind:value={subjectMaskFeather} min="0" max="6" step="0.5" class="w-full accent-primary cursor-pointer" />
          </div>
          <button type="button" onclick={() => { subjectSegmentation = null; subjectMaskEnabled = false; }} class="text-[11px] font-semibold text-gray-500 hover:text-dark cursor-pointer">
            Clear person mask
          </button>
        </div>
      {/if}
      {#if subjectMaskError}
        <p role="alert" class="text-xs text-danger">{subjectMaskError}</p>
      {/if}
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

<FullImageModal bind:isOpen={isFullImageModalOpen} imageSrc={filteredDataUrl} />