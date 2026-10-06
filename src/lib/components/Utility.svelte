<script lang="ts">
  import Icon from "@iconify/svelte";
  import JSZip from "jszip";
  import ImageTracer from "imagetracerjs";
  import { onDestroy } from "svelte";

  type OutputFormat = "jpeg" | "webp" | "png" | "pdf" | "svg";
  type RasterFormat = "jpeg" | "webp" | "png";
  type NamingMode = "original" | "numeric" | "alpha" | "random";
  type ResizeMode = "none" | "fit" | "fill" | "exact";
  type WatermarkPos = "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  type FrameStyle = "browser" | "android" | "iphone" | "ipad" | "macbook" | "polaroid" | "gallery" | "film" | "neon" | "border" | "forest" | "glossy";
  type QueuedImage = { id: number; file: File; previewUrl: string };
  type Summary = { count: number; originalBytes: number; outputBytes: number; fileName: string };

  const MAX_FILE_MB = 25;
  const SVG_TRACE_MAX_PX = 1000;
  const FRAME_OPTIONS: { id: FrameStyle; label: string }[] = [
    { id: "browser", label: "Browser Window" },
    { id: "iphone", label: "iPhone Bezel" },
    { id: "android", label: "Android Device" },
    { id: "ipad", label: "iPad Bezel" },
    { id: "macbook", label: "MacBook Pro" },
    { id: "polaroid", label: "Polaroid Print" },
    { id: "gallery", label: "Gallery Wood Frame" },
    { id: "film", label: "Film Strip" },
    { id: "neon", label: "Neon Glow" },
    { id: "border", label: "Clean White Border" },
    { id: "forest", label: "Forest Frame" },
    { id: "glossy", label: "Glossy Frame" },
    // add more frame options 
  ];
  const MIME: Record<RasterFormat, string> = {
    jpeg: "image/jpeg",
    webp: "image/webp",
    png: "image/png",
  };

  const filterCategories = [
    {
      name: "Sketch & Drawing Styles",
      filters: [
        { id: 'sketch_graphite', name: '📝 Soft Graphite Pencil', type: 'canvas', css: 'grayscale(100%) contrast(140%) brightness(110%) blur(0.5px)' },
        { id: 'sketch_crosshatch', name: '✒️ Fine Ink Pen & Hatch', type: 'canvas', css: 'grayscale(100%) contrast(220%) brightness(95%) invert(15%)' },
        { id: 'sketch_charcoal', name: '🪵 Deep Charcoal Sketch', type: 'canvas', css: 'grayscale(100%) contrast(250%) brightness(85%) blur(0.8px)' },
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
        { id: 'cs_14', name: '🖊 Ballpoint Pen Blue Sketch', type: 'canvas', css: 'saturate(300%) hue-rotate(210deg) contrast(170%) brightness(95%)' },
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
        { id: 'cs_36', name: '✏ Hard Pastel Pencil Sketch', type: 'canvas', css: 'grayscale(100%) contrast(135%) brightness(125%)' },
        { id: 'cs_37', name: '🪵 Soft Pastel Sketch Shade', type: 'canvas', css: 'grayscale(100%) contrast(175%) brightness(105%) blur(0.8px)' },
        { id: 'cs_38', name: '✒️ Copperplate Calligraphy Ink', type: 'canvas', css: 'grayscale(100%) contrast(300%) brightness(85%)' },
        { id: 'cs_39', name: '🖋️ Gothic Blackletter Ink', type: 'canvas', css: 'grayscale(100%) contrast(340%) brightness(75%)' },
        { id: 'cs_40', name: '📝 Italic Nib Handwriting', type: 'canvas', css: 'grayscale(100%) contrast(220%) brightness(96%)' },
        { id: 'cs_41', name: '📐 Engineering Isometric Grid', type: 'canvas', css: 'grayscale(100%) contrast(190%) brightness(110%) invert(8%)' },
        { id: 'cs_42', name: '🏛️️ Etching Plate Copperline', type: 'canvas', css: 'grayscale(100%) contrast(210%) brightness(98%) sepia(15%)' },
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
      name: "Cinematic & Film Grades",
      filters: [
        { id: 'cine_technicolor_35', name: '🎬 1935 Technicolor Two-Strip', type: 'canvas', css: 'sepia(40%) saturate(220%) hue-rotate(-15deg) contrast(120%)' },
        { id: 'cine_blade_runner', name: '🌧️ Blade Runner Amber & Teal', type: 'canvas', css: 'contrast(130%) saturate(140%) hue-rotate(25deg) sepia(20%)' },
        { id: 'cine_matrix_green', name: '💻 The Matrix Terminal Code', type: 'canvas', css: 'grayscale(100%) sepia(100%) hue-rotate(85deg) saturate(400%) contrast(150%)' },
        { id: 'cine_cyberpunk_neon', name: '⚡ Cyberpunk Neon District', type: 'canvas', css: 'saturate(300%) contrast(150%) hue-rotate(290deg)' },
        { id: 'cine_kodachrome_64', name: '🎞️ Classic Kodachrome 64', type: 'canvas', css: 'contrast(140%) saturate(160%) sepia(15%) brightness(105%)' },
        { id: 'cine_panavision_noir', name: '🕵 Panavision High-Contrast Noir', type: 'canvas', css: 'grayscale(100%) contrast(210%) brightness(85%)' },
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
        { id: 'retouch_warm_ivory', name: '🦢 Warm Ivory Portrait Tone', type: 'canvas', css: 'sepia(18%) brightness(106%) saturate(105%) contrast(102%)' },
        { id: 'retouch_cool_porcelain', name: '❄️ Cool Porcelain Skin Balance', type: 'canvas', css: 'hue-rotate(185deg) saturate(85%) contrast(105%) brightness(104%)' },
        { id: 'retouch_bronze_tan', name: '🏽 Sun-Kissed Bronze Glow', type: 'canvas', css: 'sepia(35%) saturate(130%) contrast(110%) brightness(98%)' },
        { id: 'retouch_caramel_skin', name: '🍮 Caramel Tone Retouch', type: 'canvas', css: 'sepia(25%) saturate(120%) contrast(108%) brightness(102%)' },
        { id: 'retouch_matte_skin', name: '🧊 Anti-Shine Matte Finish', type: 'canvas', css: 'contrast(115%) brightness(96%) saturate(90%)' },
        { id: 'retouch_airbrushed', name: '💨 Studio Airbrushed Look', type: 'canvas', css: 'brightness(110%) contrast(92%) blur(0.6px) saturate(102%)' },
        { id: 'retouch_commercial_pop', name: '🏷️ Commercial Product Pop', type: 'canvas', css: 'contrast(140%) saturate(130%) brightness(104%)' },
        { id: 'retouch_clean_headshot', name: '👤 Clean Corporate Headshot', type: 'canvas', css: 'contrast(115%) brightness(105%) saturate(102%)' },
        { id: 'retouch_beautifying', name: '🌸 Soft Focus Beautifying', type: 'canvas', css: 'brightness(107%) contrast(95%) blur(0.5px)' },
        { id: 'retouch_vibrant_lips', name: '💄 Rich Accent Saturation', type: 'canvas', css: 'saturate(145%) contrast(115%) brightness(102%)' },
        { id: 'retouch_deep_tan', name: '🏽 Deep Sunlit Retouch', type: 'canvas', css: 'sepia(40%) saturate(140%) contrast(112%) brightness(95%)' },
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
        { id: 'retouch_soft_contrast', name: '☁ Soft Contrast Enhancer', type: 'canvas', css: 'contrast(92%) brightness(106%) saturate(102%)' },
        { id: 'retouch_dynamic_range', name: '📈 Dynamic Range Recovery', type: 'canvas', css: 'contrast(110%) brightness(105%) saturate(115%)' },
        { id: 'retouch_highlight_saver', name: '☀️ Highlight Tone Optimizer', type: 'canvas', css: 'brightness(95%) contrast(125%) saturate(105%)' },
        { id: 'retouch_shadow_lift', name: '🔦 Shadow Detail Enhancer', type: 'canvas', css: 'brightness(115%) contrast(90%) saturate(105%)' },
        { id: 'retouch_midtone_punch', name: '🎯 Midtone Structural Punch', type: 'canvas', css: 'contrast(145%) brightness(101%)' },
        { id: 'retouch_editorial_clean', name: '📰 Editorial Clean Finish', type: 'canvas', css: 'contrast(122%) brightness(103%) saturate(98%)' },
        { id: 'retouch_catalog_look', name: '📖 Studio Catalog Standard', type: 'canvas', css: 'contrast(115%) brightness(105%) saturate(105%)' },
        { id: 'retouch_magazine_cover', name: '🌟 Magazine Cover Grade', type: 'canvas', css: 'contrast(135%) brightness(102%) saturate(118%)' },
        { id: 'retouch_skin_perfection', name: '💖 Ultimate Skin Perfection', type: 'canvas', css: 'brightness(106%) contrast(93%) blur(0.35px) saturate(102%)' }
      ]
    }
  ];

  const allCanvasFilters = filterCategories.flatMap((cat) => cat.filters);

  let nextId = 0;
  let images = $state<QueuedImage[]>([]);
  let reduction = $state(30);
  let format = $state<OutputFormat>("jpeg");
  let naming = $state<NamingMode>("numeric");
  let prefix = $state("");
  let svgColors = $state(16);

  // Frame options
  let addFrame = $state(false);
  let frameStyle = $state<FrameStyle>("browser");
  let framePadding = $state(48);

  // Filter selection states
  let filterSearchQuery = $state("");
  let applyFilter = $state(false);
  let selectedFilterId = $state("normal");
  let feelingLucky = $state(false);

  // Other utility states
  let resizeMode = $state<ResizeMode>("none");
  let targetWidth = $state(1200);
  let targetHeight = $state(1200);
  let padColor = $state("#ffffff");

  let watermarkText = $state("");
  let watermarkPos = $state<WatermarkPos>("bottom-right");
  let watermarkOpacity = $state(50);

  let brightness = $state(100);
  let contrast = $state(100);

  let isDragging = $state(false);
  let isProcessing = $state(false);
  let progress = $state(0);
  let errorMessage = $state("");
  let summary = $state<Summary | null>(null);

  const filteredCategories = $derived(
    filterCategories.map((cat) => ({
      ...cat,
      filters: cat.filters.filter((f) => f.name.toLowerCase().includes(filterSearchQuery.toLowerCase())),
    })).filter((cat) => cat.filters.length > 0)
  );

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const addFiles = (files: File[]) => {
    errorMessage = "";
    summary = null;
    const rejected: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        rejected.push(`${file.name} (not an image)`);
      } else if (file.size > MAX_FILE_MB * 1024 * 1024) {
        rejected.push(`${file.name} (over ${MAX_FILE_MB} MB)`);
      } else {
        images.push({ id: nextId++, file, previewUrl: URL.createObjectURL(file) });
      }
    }
    if (rejected.length > 0) errorMessage = `Skipped: ${rejected.join(", ")}`;
  };

  const handleFileInput = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    addFiles(Array.from(input.files ?? []));
    input.value = "";
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging = false;
    addFiles(Array.from(event.dataTransfer?.files ?? []));
  };

  const handleDragLeave = (event: DragEvent) => {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
      isDragging = false;
    }
  };

  const removeImage = (id: number) => {
    const target = images.find((image) => image.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    images = images.filter((image) => image.id !== id);
    summary = null;
  };

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    images = [];
    summary = null;
    errorMessage = "";
  };

  const alphaLabel = (index: number) => {
    let label = "";
    let value = index;
    do {
      label = String.fromCharCode(65 + (value % 26)) + label;
      value = Math.floor(value / 26) - 1;
    } while (value >= 0);
    return label;
  };

  const randomLabel = () =>
    Array.from(crypto.getRandomValues(new Uint8Array(4)), (byte) => byte.toString(16).padStart(2, "0")).join("");

  const sanitize = (value: string) => value.replace(/[\\/:*?"<>|]+/g, "_").trim();

  const extensionFor = (mimeType: string) =>
    mimeType === "image/jpeg" ? "jpg" : mimeType === "image/webp" ? "webp" : mimeType === "image/svg+xml" ? "svg" : "png";

  const makeName = (index: number, file: File, extension: string, used: Set<string>) => {
    const original = file.name.replace(/\.[^.]+$/, "") || file.name;
    const base =
      naming === "original" ? original : naming === "numeric" ? String(index + 1) : naming === "alpha" ? alphaLabel(index) : randomLabel();
    const candidate = sanitize(`${prefix}${base}`) || "image";

    let name = candidate;
    let suffix = 2;
    while (used.has(`${name}.${extension}`.toLowerCase())) name = `${candidate}_${suffix++}`;
    used.add(`${name}.${extension}`.toLowerCase());
    return `${name}.${extension}`;
  };

  const processCanvas = (bitmap: ImageBitmap, activeCssFilter?: string) => {
    let w = bitmap.width;
    let h = bitmap.height;
    let dx = 0;
    let dy = 0;
    let dw = w;
    let dh = h;

    let finalW = w;
    let finalH = h;

    if (resizeMode !== "none") {
      const tw = targetWidth || w;
      const th = targetHeight || h;

      if (resizeMode === "exact") {
        finalW = tw;
        finalH = th;
        dw = tw;
        dh = th;
      } else if (resizeMode === "fit") {
        const ratio = Math.min(tw / w, th / h);
        finalW = Math.round(w * ratio);
        finalH = Math.round(h * ratio);
        dw = finalW;
        dh = finalH;
      } else if (resizeMode === "fill") {
        finalW = tw;
        finalH = th;
        const ratio = Math.max(tw / w, th / h);
        dw = Math.round(w * ratio);
        dh = Math.round(h * ratio);
        dx = Math.round((tw - dw) / 2);
        dy = Math.round((th - dh) / 2);
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = finalW;
    canvas.height = finalH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available.");

    if (format === "jpeg" || resizeMode === "fill" || resizeMode === "exact") {
      ctx.fillStyle = padColor;
      ctx.fillRect(0, 0, finalW, finalH);
    }

    let filterString = "";
    if (activeCssFilter && activeCssFilter !== "none") filterString += `${activeCssFilter} `;
    if (brightness !== 100) filterString += `brightness(${brightness}%) `;
    if (contrast !== 100) filterString += `contrast(${contrast}%) `;
    if (filterString.trim()) ctx.filter = filterString.trim();

    ctx.drawImage(bitmap, dx, dy, dw, dh);
    ctx.filter = "none";

    if (watermarkText.trim()) {
      ctx.font = `${Math.max(12, Math.round(finalW * 0.03))}px sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity / 100})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${watermarkOpacity / 100})`;
      ctx.lineWidth = 2;

      const metrics = ctx.measureText(watermarkText);
      const textW = metrics.width;
      const padding = 20;

      let wx = padding;
      let wy = finalH - padding;

      if (watermarkPos === "bottom-right") {
        wx = finalW - textW - padding;
        wy = finalH - padding;
      } else if (watermarkPos === "top-right") {
        wx = finalW - textW - padding;
        wy = padding + 20;
      } else if (watermarkPos === "top-left") {
        wx = padding;
        wy = padding + 20;
      } else if (watermarkPos === "center") {
        wx = (finalW - textW) / 2;
        wy = finalH / 2;
      }

      ctx.strokeText(watermarkText, wx, wy);
      ctx.fillText(watermarkText, wx, wy);
    }

    return addFrame ? applyFrame(canvas) : canvas;
  };

  const traceToSvg = async (canvas: HTMLCanvasElement) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const scale = Math.min(1, SVG_TRACE_MAX_PX / Math.max(canvas.width, canvas.height));
    const source = document.createElement("canvas");
    source.width = Math.max(1, Math.round(canvas.width * scale));
    source.height = Math.max(1, Math.round(canvas.height * scale));
    const ctx = source.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available.");
    ctx.drawImage(canvas, 0, 0, source.width, source.height);

    const svg = ImageTracer.imagedataToSVG(ctx.getImageData(0, 0, source.width, source.height), {
      numberofcolors: svgColors,
      viewbox: true,
    });
    return new Blob([svg], { type: "image/svg+xml" });
  };

  const applyFrame = (src: HTMLCanvasElement) => {
    const w = src.width;
    const h = src.height;
    // Decoration sizes scale with image size so frames look the same at any resolution.
    const u = Math.max(0.5, Math.max(w, h) / 1000);
    const pad = Math.round(framePadding * u);

    const stage = (width: number, height: number, from: string, to = from) => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not available.");
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, from);
      gradient.addColorStop(1, to);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return { canvas, ctx };
    };

    const lift = (ctx: CanvasRenderingContext2D, blur: number, offsetY: number, alpha: number, draw: () => void) => {
      ctx.save();
      ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      ctx.shadowBlur = blur * u;
      ctx.shadowOffsetY = offsetY * u;
      draw();
      ctx.restore();
    };

    const place = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number | number[] = 0) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.clip();
      ctx.drawImage(src, x, y);
      ctx.restore();
    };

    switch (frameStyle) {
      case "browser": {
        const bar = 40 * u;
        const r = 12 * u;
        const { canvas, ctx } = stage(w + pad * 2, h + bar + pad * 2, "#4f46e5", "#9333ea");
        lift(ctx, 30, 15, 0.35, () => {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w, h + bar, r);
          ctx.fill();
        });
        ctx.fillStyle = "#f3f4f6";
        ctx.beginPath();
        ctx.roundRect(pad, pad, w, bar, [r, r, 0, 0]);
        ctx.fill();
        ["#ef4444", "#f59e0b", "#10b981"].forEach((color, index) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(pad + (20 + index * 20) * u, pad + bar / 2, 5 * u, 0, Math.PI * 2);
          ctx.fill();
        });
        place(ctx, pad, pad + bar, [0, 0, r, r]);
        return canvas;
      }
      case "iphone": {
        const bezel = 24 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#0f172a", "#334155");
        lift(ctx, 40, 20, 0.5, () => {
          ctx.fillStyle = "#1e293b";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, 44 * u);
          ctx.fill();
        });
        place(ctx, pad + bezel, pad + bezel, 28 * u);
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.roundRect(pad + bezel + w * 0.36, pad + bezel + 12 * u, w * 0.28, 26 * u, 13 * u);
        ctx.fill();
        return canvas;
      }
      case "android": {
        const bezel = 24 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#0f172a", "#334155");
        lift(ctx, 40, 20, 0.5, () => {
          ctx.fillStyle = "#1e293b";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, 44 * u);
          ctx.fill();
        });
        place(ctx, pad + bezel, pad + bezel, 28 * u);
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.roundRect(pad + bezel + w * 0.36, pad + bezel + 12 * u, w * 0.28, 26 * u, 13 * u);
        ctx.fill();
        return canvas;
      }
      case "ipad": {
        const bezel = 30 * u;
        const { canvas, ctx } = stage(w + bezel * 2 + pad * 2, h + bezel * 2 + pad * 2, "#cbd5e1", "#94a3b8");
        lift(ctx, 36, 18, 0.4, () => {
          ctx.fillStyle = "#111827";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + bezel * 2, h + bezel * 2, 36 * u);
          ctx.fill();
        });
        place(ctx, pad + bezel, pad + bezel, 14 * u);
        ctx.fillStyle = "#374151";
        ctx.beginPath();
        ctx.arc(pad + bezel + w / 2, pad + bezel / 2, 4 * u, 0, Math.PI * 2);
        ctx.fill();
        return canvas;
      }
      case "macbook": {
        const top = 36 * u;
        const side = 72 * u;
        const baseH = 30 * u;
        const { canvas, ctx } = stage(w + side * 2 + pad * 2, pad + top + h + 12 * u + baseH + pad, "#1e1b4b", "#312e81");
        const x = pad + side;
        const y = pad + top;
        lift(ctx, 35, 15, 0.4, () => {
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.roundRect(x - 12 * u, y - 12 * u, w + 24 * u, h + 24 * u, 12 * u);
          ctx.fill();
        });
        place(ctx, x, y);
        ctx.fillStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.roundRect(x - 60 * u, y + h + 12 * u, w + 120 * u, baseH, [0, 0, 8 * u, 8 * u]);
        ctx.fill();
        return canvas;
      }
      case "polaroid": {
        const edge = 28 * u;
        const bottom = 100 * u;
        const { canvas, ctx } = stage(w + edge * 2 + pad * 2, h + edge + bottom + pad * 2, "#e7e5e4", "#d6d3d1");
        lift(ctx, 28, 12, 0.3, () => {
          ctx.fillStyle = "#fafaf9";
          ctx.beginPath();
          ctx.roundRect(pad, pad, w + edge * 2, h + edge + bottom, 4 * u);
          ctx.fill();
        });
        place(ctx, pad + edge, pad + edge);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = u;
        ctx.strokeRect(pad + edge, pad + edge, w, h);
        return canvas;
      }
      case "gallery": {
        const wood = 28 * u;
        const mat = 40 * u;
        const frameW = w + (wood + mat) * 2;
        const frameH = h + (wood + mat) * 2;
        const { canvas, ctx } = stage(frameW + pad * 2, frameH + pad * 2, "#f5f5f4", "#e7e5e4");
        lift(ctx, 30, 14, 0.4, () => {
          const grain = ctx.createLinearGradient(pad, pad, pad + frameW, pad + frameH);
          grain.addColorStop(0, "#a16207");
          grain.addColorStop(1, "#713f12");
          ctx.fillStyle = grain;
          ctx.fillRect(pad, pad, frameW, frameH);
        });
        ctx.fillStyle = "#fafaf9";
        ctx.fillRect(pad + wood, pad + wood, frameW - wood * 2, frameH - wood * 2);
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 2 * u;
        ctx.strokeRect(pad + wood, pad + wood, frameW - wood * 2, frameH - wood * 2);
        place(ctx, pad + wood + mat, pad + wood + mat);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
        ctx.strokeRect(pad + wood + mat, pad + wood + mat, w, h);
        return canvas;
      }
      case "film": {
        const side = 64 * u;
        const edge = 22 * u;
        const stripW = w + side * 2;
        const stripH = h + edge * 2;
        const { canvas, ctx } = stage(stripW + pad * 2, stripH + pad * 2, "#27272a", "#18181b");
        lift(ctx, 24, 10, 0.5, () => {
          ctx.fillStyle = "#0a0a0a";
          ctx.fillRect(pad, pad, stripW, stripH);
        });
        const holeW = 22 * u;
        const holeH = 30 * u;
        ctx.fillStyle = "#e5e7eb";
        for (let y = pad + 16 * u; y + holeH <= pad + stripH - 8 * u; y += 52 * u) {
          ctx.beginPath();
          ctx.roundRect(pad + (side - holeW) / 2, y, holeW, holeH, 5 * u);
          ctx.roundRect(pad + side + w + (side - holeW) / 2, y, holeW, holeH, 5 * u);
          ctx.fill();
        }
        place(ctx, pad + side, pad + edge);
        return canvas;
      }
      case "forest": {
        const m = pad + 24 * u;
        const { canvas, ctx } = stage(w + m * 2, h + m * 2, "#0b2e0b", "#1a2e1a");
        place(ctx, m, m);
        const glow = (color: string, inset: number, width: number, blur: number) => {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = width * u;
          ctx.shadowColor = color;
          ctx.shadowBlur = blur * u;
          ctx.strokeRect(m - inset * u, m - inset * u, w + inset * 2 * u, h + inset * 2 * u);
          ctx.restore();
        };
        glow("#22c55e", 8, 5, 30);
        glow("#16a34a", 18, 3, 24);
        return canvas;
      }
      case "glossy": {
        const m = pad + 24 * u;
        const { canvas, ctx } = stage(w + m * 2, h + m * 2, "#1a1a1a", "#333333");
        place(ctx, m, m);
        const glow = (color: string, inset: number, width: number, blur: number) => {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = width * u;
          ctx.shadowColor = color;
          ctx.shadowBlur = blur * u;
          ctx.strokeRect(m - inset * u, m - inset * u, w + inset * 2 * u, h + inset * 2 * u);
          ctx.restore();
        };
        glow("#ffffff", 8, 5, 30);
        glow("#cccccc", 18, 3, 24);
        return canvas;
      }
      case "neon": {
        const m = pad + 24 * u;
        const { canvas, ctx } = stage(w + m * 2, h + m * 2, "#0b1020", "#1a0b2e");
        place(ctx, m, m);
        const glow = (color: string, inset: number, width: number, blur: number) => {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = width * u;
          ctx.shadowColor = color;
          ctx.shadowBlur = blur * u;
          ctx.strokeRect(m - inset * u, m - inset * u, w + inset * 2 * u, h + inset * 2 * u);
          ctx.restore();
        };
        glow("#22d3ee", 8, 5, 30);
        glow("#e879f9", 18, 3, 24);
        return canvas;
      }
      default: {
        const { canvas, ctx } = stage(w + pad * 2, h + pad * 2, "#ffffff");
        lift(ctx, 16, 6, 0.2, () => {
          ctx.drawImage(src, pad, pad);
        });
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = u;
        ctx.strokeRect(pad, pad, w, h);
        return canvas;
      }
    }
  };

  const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
    new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Image encoding failed."))), type, quality),
    );

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const pickFilterCss = () => {
    if (!applyFilter) return "none";
    if (feelingLucky) return allCanvasFilters[Math.floor(Math.random() * allCanvasFilters.length)].css;
    return allCanvasFilters.find((filter) => filter.id === selectedFilterId)?.css ?? "none";
  };

  const exportImages = async (queue: QueuedImage[], quality: number, originalBytes: number) => {
    const used = new Set<string>();
    const outputs: { name: string; blob: Blob }[] = [];

    for (const [index, item] of queue.entries()) {
      const bitmap = await createImageBitmap(item.file);
      const canvas = processCanvas(bitmap, pickFilterCss());
      bitmap.close();
      const blob =
        format === "svg"
          ? await traceToSvg(canvas)
          : await canvasToBlob(canvas, MIME[format as RasterFormat], quality);

      outputs.push({ name: makeName(index, item.file, extensionFor(blob.type), used), blob });
      progress = Math.round(((index + 1) / queue.length) * 100);
    }

    const outputBytes = outputs.reduce((total, output) => total + output.blob.size, 0);
    if (outputs.length === 1) {
      downloadBlob(outputs[0].blob, outputs[0].name);
      summary = { count: 1, originalBytes, outputBytes, fileName: outputs[0].name };
      return;
    }

    const zip = new JSZip();
    outputs.forEach((output) => zip.file(output.name, output.blob));
    const zipName = `${sanitize(prefix)}processed_images.zip`;
    downloadBlob(await zip.generateAsync({ type: "blob" }), zipName);
    summary = { count: outputs.length, originalBytes, outputBytes, fileName: zipName };
  };

  const exportPdf = async (queue: QueuedImage[], quality: number, originalBytes: number) => {
    const { jsPDF } = await import("jspdf");
    let pdf: InstanceType<typeof jsPDF> | null = null;

    for (const [index, item] of queue.entries()) {
      const bitmap = await createImageBitmap(item.file);
      const canvas = processCanvas(bitmap, pickFilterCss());
      bitmap.close();
      const { width, height } = canvas;
      const orientation = width >= height ? "landscape" : "portrait";
      const dataUrl = canvas.toDataURL("image/jpeg", quality);

      if (!pdf) pdf = new jsPDF({ orientation, unit: "px", format: [width, height], compress: true });
      else pdf.addPage([width, height], orientation);
      pdf.addImage(dataUrl, "JPEG", 0, 0, width, height, undefined, "FAST");
      progress = Math.round(((index + 1) / queue.length) * 100);
    }

    if (!pdf) return;
    const blob = pdf.output("blob");
    const fileName = `${sanitize(prefix)}images.pdf`;
    downloadBlob(blob, fileName);
    summary = { count: queue.length, originalBytes, outputBytes: blob.size, fileName };
  };

  const processAll = async () => {
    if (images.length === 0 || isProcessing) return;
    isProcessing = true;
    progress = 0;
    errorMessage = "";
    summary = null;

    const queue = [...images];
    const quality = (100 - reduction) / 100;
    const originalBytes = queue.reduce((total, item) => total + item.file.size, 0);

    try {
      if (format === "pdf") await exportPdf(queue, quality, originalBytes);
      else await exportImages(queue, quality, originalBytes);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Processing failed.";
    } finally {
      isProcessing = false;
    }
  };

  onDestroy(() => images.forEach((image) => URL.revokeObjectURL(image.previewUrl)));
</script>

<div class="space-y-6">
  <!-- Dropzone -->
  <div
    role="presentation"
    ondragenter={(event) => { event.preventDefault(); isDragging = true; }}
    ondragover={(event) => event.preventDefault()}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    class="rounded-3xl border-2 border-dashed p-8 text-center shadow-sm transition {isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white'}"
  >
    <Icon icon="mdi:image-multiple-outline" class="mx-auto h-14 w-14 text-gray-400" />
    <p class="mt-2 text-base font-bold text-dark">Drag & drop multiple images here</p>
    <p class="font-mono text-xs text-gray-400">Up to {MAX_FILE_MB} MB per image</p>
    <label class="mt-3 inline-block cursor-pointer rounded-xl bg-primary px-8 py-3 text-xs font-semibold text-light shadow transition hover:bg-primary-dark">
      Select Images
      <input type="file" multiple accept="image/*" onchange={handleFileInput} class="hidden" />
    </label>
  </div>

  {#if errorMessage}
    <p role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">{errorMessage}</p>
  {/if}

  {#if images.length > 0}
    <!-- Preview Grid -->
    <section class="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-dark">
          {images.length} image{images.length === 1 ? "" : "s"} selected
          <span class="font-mono text-xs font-normal text-gray-500">({formatBytes(images.reduce((total, image) => total + image.file.size, 0))})</span>
        </h3>
        <button type="button" onclick={clearImages} class="cursor-pointer text-xs font-semibold text-red-500 hover:underline">Clear all</button>
      </div>
      <ul class="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4 md:grid-cols-6">
        {#each images as image (image.id)}
          <li class="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <img src={image.previewUrl} alt={image.file.name} class="aspect-square w-full object-cover" />
            <button
              type="button"
              onclick={() => removeImage(image.id)}
              aria-label="Remove {image.file.name}"
              class="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Icon icon="mdi:close" class="text-sm" />
            </button>
            <p class="truncate px-2 py-1 text-[10px] text-gray-600" title={image.file.name}>{image.file.name}</p>
            <p class="px-2 pb-1 font-mono text-[10px] text-gray-400">{formatBytes(image.file.size)}</p>
          </li>
        {/each}
      </ul>
    </section>

    <!-- Controls Panel -->
    <section class="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-xs shadow-xs md:grid-cols-2">
      <!-- Compression & Format -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <h4 class="font-bold text-dark">Export & Quality</h4>
        <div class="space-y-1">
          <label for="bulk-reduction" class="block font-semibold text-gray-700">Quality reduction: {reduction}%</label>
          <input id="bulk-reduction" type="range" min="0" max="95" bind:value={reduction} disabled={format === "svg"} class="w-full cursor-pointer accent-primary disabled:opacity-50" />
        </div>
        {#if format === "svg"}
          <div class="space-y-1">
            <label for="svg-colors" class="block font-semibold text-gray-700">SVG colors: {svgColors}</label>
            <input id="svg-colors" type="range" min="2" max="64" bind:value={svgColors} class="w-full cursor-pointer accent-primary" />
            <p class="text-[11px] text-gray-500">Photos are traced into vector shapes, so more colors means more detail and larger files.</p>
          </div>
        {/if}
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="bulk-format" class="block font-semibold text-gray-700">Format</label>
            <select id="bulk-format" bind:value={format} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark">
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
              <option value="png">PNG</option>
              <option value="pdf">PDF</option>
              <option value="svg">SVG (traced vector)</option>
            </select>
          </div>
          <div>
            <label for="bulk-naming" class="block font-semibold text-gray-700">Naming</label>
            <select id="bulk-naming" bind:value={naming} disabled={format === "pdf"} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark disabled:opacity-50">
              <option value="numeric">Numbers</option>
              <option value="alpha">Letters</option>
              <option value="random">Random</option>
              <option value="original">Original</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Smart Resizing -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <h4 class="font-bold text-dark">Smart Resizing</h4>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label for="resize-mode" class="block font-semibold text-gray-700">Mode</label>
            <select id="resize-mode" bind:value={resizeMode} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark">
              <option value="none">Original Size</option>
              <option value="fit">Fit Within Bounds</option>
              <option value="fill">Fill Canvas (Pad)</option>
              <option value="exact">Exact Stretch</option>
            </select>
          </div>
          {#if resizeMode !== "none"}
            <div>
              <label for="pad-color" class="block font-semibold text-gray-700">Padding Color</label>
              <input id="pad-color" type="color" bind:value={padColor} class="h-9 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-1" />
            </div>
          {/if}
        </div>
        {#if resizeMode !== "none"}
          <div class="grid grid-cols-2 gap-2">
            <input type="number" bind:value={targetWidth} placeholder="Max Width (px)" class="rounded-xl border border-gray-200 bg-white p-2" />
            <input type="number" bind:value={targetHeight} placeholder="Max Height (px)" class="rounded-xl border border-gray-200 bg-white p-2" />
          </div>
        {/if}
      </div>

      <!-- Filter Selection & Search -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-dark">Preset Filters</h4>
          <label class="flex cursor-pointer items-center gap-1.5 font-semibold text-dark">
            <input type="checkbox" bind:checked={applyFilter} class="rounded accent-primary" />
            Apply a filter
          </label>
        </div>

        {#if applyFilter}
          <label class="flex w-fit cursor-pointer items-center gap-1.5 font-semibold text-primary">
            <input type="checkbox" bind:checked={feelingLucky} class="rounded accent-primary" />
            🎲 I'm Feeling Lucky
          </label>

          {#if !feelingLucky}
            <div class="space-y-2">
              <input
                type="text"
                bind:value={filterSearchQuery}
                placeholder="🔍 Search filters..."
                class="w-full rounded-xl border border-gray-200 bg-white p-2 text-dark"
              />
              <select bind:value={selectedFilterId} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark">
                {#each filteredCategories as category}
                  <optgroup label={category.name}>
                    {#each category.filters as filter}
                      <option value={filter.id}>{filter.name}</option>
                    {/each}
                  </optgroup>
                {/each}
              </select>
            </div>
          {:else}
            <p class="rounded-xl border border-primary/30 bg-primary/5 p-3 text-center text-primary font-medium">
              ✨ Random canvas filters will be applied to each image automatically upon export!
            </p>
          {/if}
        {/if}
      </div>

      <!-- Frames -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-dark">Frames</h4>
          <label class="flex cursor-pointer items-center gap-1.5 font-semibold text-dark">
            <input type="checkbox" bind:checked={addFrame} class="rounded accent-primary" />
            Add a frame
          </label>
        </div>
        {#if addFrame}
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="frame-style" class="block font-semibold text-gray-700">Style</label>
              <select id="frame-style" bind:value={frameStyle} class="w-full rounded-xl border border-gray-200 bg-white p-2 font-medium text-dark">
                {#each FRAME_OPTIONS as option}
                  <option value={option.id}>{option.label}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="frame-pad" class="block font-semibold text-gray-700">Margin: {framePadding}</label>
              <input id="frame-pad" type="range" min="8" max="100" bind:value={framePadding} class="w-full cursor-pointer accent-primary" />
            </div>
          </div>
          <p class="text-[11px] text-gray-500">Applied after resizing, filter and watermark, and works with every output format.</p>
        {/if}
      </div>

      <!-- Watermarking & Adjustments -->
      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
        <h4 class="font-bold text-dark">Watermark & Adjustments</h4>
        <input type="text" bind:value={watermarkText} placeholder="© Watermark text (optional)" class="w-full rounded-xl border border-gray-200 bg-white p-2" />
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <span class="text-gray-500">Brightness: {brightness}%</span>
            <input type="range" min="50" max="150" bind:value={brightness} class="w-full accent-primary" />
          </div>
          <div class="space-y-1">
            <span class="text-gray-500">Contrast: {contrast}%</span>
            <input type="range" min="50" max="150" bind:value={contrast} class="w-full accent-primary" />
          </div>
        </div>
      </div>
    </section>

    <!-- Action Section -->
    <div class="space-y-3">
      <button
        type="button"
        onclick={processAll}
        disabled={isProcessing}
        class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-light shadow transition hover:bg-primary-dark disabled:opacity-60"
      >
        <Icon icon={isProcessing ? "mdi:loading" : "mdi:folder-zip-outline"} class={isProcessing ? "animate-spin text-base" : "text-base"} />
        {isProcessing ? `Processing ${progress}%` : format === "pdf" ? "Combine into PDF & Download" : "Process & Download All"}
      </button>

      {#if isProcessing}
        <div class="h-2 overflow-hidden rounded-full bg-gray-200">
          <div class="h-full bg-primary transition-all" style="width: {progress}%"></div>
        </div>
      {/if}

      {#if summary}
        {@const change = summary.originalBytes > 0 ? Math.round((1 - summary.outputBytes / summary.originalBytes) * 100) : 0}
        <p class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          Saved <strong>{summary.fileName}</strong> ({summary.count} image{summary.count === 1 ? "" : "s"}):
          {formatBytes(summary.originalBytes)} → {formatBytes(summary.outputBytes)}
          ({Math.abs(change)}% {change >= 0 ? "smaller" : "larger"})
        </p>
      {/if}
    </div>
  {/if}
</div>