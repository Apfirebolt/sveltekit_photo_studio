// --- 1. Base Data & Configurations ---

export const tensorSketchFamilies = [
  { id: 'graphite', title: 'Tensor Graphite & Pencil Studies (35+)', icon: '✏️', names: ['HB Light Study', '2B Portrait Pencil', '4B Soft Shading', '6B Rich Graphite', '8B Deep Graphite', '10B Heavy Graphite', 'H Fine Drafting Lead', 'Smudged Charcoal Pencil', 'Cross-Grain Graphite', 'Tonal Portrait Blend', 'Expressive Broad Lead', 'Paper Grain Study', 'Hard Lead Fine Grain', 'Soft Lead Shadow Pass', 'Layered Graphite Hatch', 'Bright Paper Pencil', 'Deep Value Graphite', 'Feathered Pencil Contour', 'Broad Shading Pencil', 'Fine Grain Portrait', 'Velvet Graphite Blend', 'Heavy Artist Pencil', 'Ultra-Fine Lead Pass', 'Deep Tone Charcoal', 'Stippled Lead Grain', 'Contour Shading Pass', 'Structured Graphite Mesh', 'Organic Smudge Pass', 'Matte Graphite Pass', 'High-Density Lead', 'Textured Paper Study', 'Raw Graphite Dust', 'Precision Shading Pass', 'Subtle Tone Gradient', 'Master Artist Pencil'] },
  { id: 'charcoal', title: 'Tensor Charcoal & Ink Washes (30+)', icon: '🪵', names: ['Willow Charcoal Pass', 'Compressed Vine Ink', 'Deep Shadow Block', 'Rich Ink Wash', 'Sum-e Black Stroke', 'Heavy Carbon Core', 'Smudged Charcoal Dust', 'Dark Monolith Pass', 'Expressive Ink Splash', 'Velvet Shadow Pass', 'Deep Void Charcoal', 'High Contrast Ink', 'Raw Vine Charcoal', 'Soft Carbon Blend', 'Aggressive Charcoal Stroke', 'Gothic Ink Pass', 'Deep Obsidian Shade', 'Dense Carbon Matrix', 'Subtle Charcoal Wash', 'Intense Shadow Pass', 'Textured Vine Stroke', 'Matte Carbon Layer', 'Rich Liquid Ink', 'Deep Monochromatic Core', 'Expressive Charcoal Pass', 'Heavy Shadow Gradient', 'Dark Contoured Ink', 'Velvety Vine Shade'] },
  { id: 'contour', title: 'Tensor Contour & Line Sketches (20)', icon: '🖊️', names: ['Fine Contour', 'Clean Outline', 'Soft Edge Study', 'Bold Gesture Lines', 'Minimal Contours', 'Double-Weight Outline', 'Portrait Contour', 'Architectural Contour', 'High-Contrast Ink', 'Loose Gesture Study', 'Whisper Thin Outline', 'Confident Brush Contour', 'Broken Edge Drawing', 'Continuous Line Study', 'Soft Portrait Edges', 'Graphic Black Contour', 'Expressive Face Lines', 'Light Gesture Pass', 'Heavy Silhouette Ink', 'Contour Detail Pass'] },
  { id: 'hatching', title: 'Tensor Pen Hatching & Crosshatch (20)', icon: '✒️', names: ['Single Diagonal Hatch', 'Fine Crosshatch', 'Dense Crosshatch', 'Loose Parallel Hatch', 'Four-Way Ink Hatch', 'Shadow Hatch', 'Etching Hatch', 'Fine Nib Hatching', 'Bold Nib Hatching', 'Illustration Crosshatch', 'Wide-Spaced Hatch', 'Tight Shadow Crosshatch', 'Light Pencil Hatch', 'Heavy Ink Hatch', 'Portrait Form Hatching', 'Angled Shade Lines', 'Layered Nib Crosshatch', 'Soft Parallel Shading', 'Deep Black Crosshatch', 'Open Line Hatching'] },
  { id: 'engraving', title: 'Tensor Engraving & Lithography (20)', icon: '🖋️', names: ['Copperplate Engraving', 'Woodcut Linework', 'Antique Etching', 'Lithographic Pencil', 'Newsprint Engraving', 'Fine-Line Etching', 'Bold Relief Print', 'Soft Plate Tone', 'Vintage Ink Press', 'Detailed Engraver', 'Fine Copperplate Lines', 'Deep Wood Engraving', 'Soft Litho Shading', 'Classic Steel Etch', 'Textured Relief Study', 'Antique Plate Hatching', 'Fine Intaglio Detail', 'Bold Pressed Ink', 'Tonal Engraving', 'Cross-Line Print Study'] },
  { id: 'stippling', title: 'Tensor Stipple & Dot-Pen Studies (20)', icon: '⚫', names: ['Fine Stipple', 'Portrait Dotwork', 'Sparse Pointillism', 'Dense Ink Dots', 'Soft Halftone Pencil', 'Bold Halftone Pen', 'Micro-Dot Shading', 'Loose Stipple Study', 'Graphic Dot Screen', 'Tonal Pointillism', 'Fine Nib Dot Shading', 'Airy Stipple Portrait', 'Dense Shadow Dotwork', 'Wide Halftone Screen', 'Soft Grain Pointillism', 'Graphic Ink Stipple', 'Microtone Dot Study', 'Bold Screenprint Dots', 'Sparse Pencil Stipple', 'Layered Dot Shading'] },
  { id: 'technical', title: 'Tensor Technical & Architectural Pen (10)', icon: '📐', names: ['Drafting Pencil', 'Blueprint Line Study', 'Fine Technical Pen', 'Architectural Ink', 'Measured Contours', 'Precision Outline', 'Plan Drawing', 'Structural Edge Study', 'Technical Crosshatch', 'Clean Diagram Ink'] }
] as const;

export const canvasSketchFamilies = [
  { id: 'graphite', title: 'Canvas Graphite & Pencil Presets (10)', icon: '✏️', names: ['2H Drafting Lead', 'HB Everyday Pencil', '2B Portrait Shading', '4B Soft Graphite', '6B Dark Graphite', 'Pencil on Vellum', 'Soft Blend Pencil', 'Bright Paper Study', 'Toned Paper Graphite', 'Expressive Pencil Grain'] },
  { id: 'ink', title: 'Canvas Pen & Ink Presets (10)', icon: '🖋️', names: ['Fine-Liner Outline', 'Bold Brush Ink', 'Blue Ballpoint Study', 'Red Ballpoint Study', 'Fountain Pen Wash', 'Dip Pen Blackline', 'Manga Inker', 'Technical Pen', 'Quill on Parchment', 'White Chalk Ink'] },
  { id: 'charcoal', title: 'Canvas Charcoal & Chalk Presets (10)', icon: '🪵', names: ['Willow Charcoal', 'Compressed Charcoal', 'Chalk on Slate', 'Sanguine Chalk', 'Conte Crayon', 'Soft Charcoal Blend', 'Deep Shadow Charcoal', 'Light Chalk Outline', 'Gesture Charcoal', 'Dusty Charcoal Paper'] },
  { id: 'print', title: 'Canvas Etching & Print Presets (10)', icon: '🏛️', names: ['Copperplate Etching', 'Woodcut Contrast', 'Linocut Ink', 'Antique Lithograph', 'Mezzotint Tone', 'Aquatint Study', 'Newsprint Halftone', 'Relief Print Ink', 'Vintage Engraving', 'Fine Plate Lines'] },
  { id: 'paper', title: 'Canvas Paper & Drafting Presets (10)', icon: '📐', names: ['Blueprint Draft', 'Cyanotype Lines', 'Sepia Architecture', 'Ledger Pencil', 'Rice Paper Wash', 'Parchment Quill', 'Mechanical Draft', 'Isometric Plan', 'Vellum Contour', 'Architectural Ink'] }
] as const;

export const cartoonInkColors: [number, number, number][] = [
  [24, 24, 28], [36, 28, 54], [20, 48, 70], [65, 34, 26], [32, 60, 42], [12, 12, 16]
];

export const cartoonFilterNames = [
  'Classic Cel Animation', 'Bold Comic Book', 'Soft Anime Outline', 'Pastel Storybook Toon',
  'Saturday Morning Cartoon', 'Graphic Novel Ink', 'Clean Vector Toon', 'Retro Print Cartoon',
  'Watercolor Animation', 'High-Key Character Cel', 'Noir Toon Outline', 'Warm Picture Book',
  'Neon Pop Cartoon', 'Muted Editorial Toon', 'Heavy Ink Animation', 'Light Pencil Cartoon',
  'Vintage Comic Halftone', 'Soft Portrait Toon', 'Crisp Studio Animation', 'Limited Palette Toon',
  'Dreamy Pastel Anime', 'Hard Shadow Cel Shade', 'Expressive Brush Cartoon', 'Fine-Line Cartoon'
];

export const cinematicFilters = [
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
];

export const professionalStudioFilters = [
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
  { id: 'retouch_soft_contrast', name: '☁️ Soft Contrast Enhancer', type: 'canvas', css: 'contrast(92%) brightness(106%) saturate(102%)' },
  { id: 'retouch_dynamic_range', name: '📈 Dynamic Range Recovery', type: 'canvas', css: 'contrast(110%) brightness(105%) saturate(115%)' },
  { id: 'retouch_highlight_saver', name: '☀️ Highlight Tone Optimizer', type: 'canvas', css: 'brightness(95%) contrast(125%) saturate(105%)' },
  { id: 'retouch_shadow_lift', name: '🔦 Shadow Detail Enhancer', type: 'canvas', css: 'brightness(115%) contrast(90%) saturate(105%)' },
  { id: 'retouch_midtone_punch', name: '🎯 Midtone Structural Punch', type: 'canvas', css: 'contrast(145%) brightness(101%)' },
  { id: 'retouch_editorial_clean', name: '📰 Editorial Clean Finish', type: 'canvas', css: 'contrast(122%) brightness(103%) saturate(98%)' },
  { id: 'retouch_catalog_look', name: '📖 Studio Catalog Standard', type: 'canvas', css: 'contrast(115%) brightness(105%) saturate(105%)' },
  { id: 'retouch_magazine_cover', name: '🌟 Magazine Cover Grade', type: 'canvas', css: 'contrast(135%) brightness(102%) saturate(118%)' },
  { id: 'retouch_skin_perfection', name: '💖 Ultimate Skin Perfection', type: 'canvas', css: 'brightness(106%) contrast(93%) blur(0.35px) saturate(102%)' }
];

export const neuralAndTensorFilters = [
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
];

export const masterSketchPenFilters = [
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
  ...Array.from({ length: 50 }, (_, i) => {
    const id = `cs_${String(i + 1).padStart(2, '0')}`;
    const styles: Record<number, { name: string; css: string }> = {
      0: { name: '🖋️ 2H Hard Technical Pencil', css: 'grayscale(100%) contrast(130%) brightness(120%)' },
      1: { name: '✏️ 4B Soft Dark Graphite', css: 'grayscale(100%) contrast(190%) brightness(85%) blur(0.4px)' },
      2: { name: '🪵 6B Extra Dark Charcoal', css: 'grayscale(100%) contrast(280%) brightness(75%) blur(0.7px)' },
      3: { name: '✒️ Archival Micron Pen 0.1', css: 'grayscale(100%) contrast(250%) brightness(95%)' },
      4: { name: '🖋️ Archival Micron Pen 0.5', css: 'grayscale(100%) contrast(210%) brightness(100%)' },
      5: { name: '🖌️ Chinese Bamboo Brush Ink', css: 'grayscale(100%) contrast(320%) brightness(80%) blur(0.9px)' },
      6: { name: '✒️ Japanese Sumi-E Ink Wash', css: 'grayscale(100%) contrast(180%) brightness(110%) blur(1.2px)' },
      7: { name: '📜 Antique Parchment Sketch', css: 'grayscale(100%) sepia(70%) contrast(160%) brightness(105%)' },
      8: { name: '🏛️ Renaissance Silverpoint', css: 'grayscale(100%) sepia(20%) contrast(140%) brightness(115%)' },
      9: { name: '📐 Blueprint Cyanotype', css: 'grayscale(100%) invert(95%) hue-rotate(190deg) contrast(220%)' },
      10: { name: '📐 Sepia Architectural Draft', css: 'grayscale(100%) invert(90%) sepia(100%) hue-rotate(-30deg) contrast(200%)' },
      11: { name: '📝 Vintage Ledger Pencil', css: 'grayscale(100%) sepia(45%) contrast(150%) brightness(108%)' },
      12: { name: '📰 Rough Newsprint Etching', css: 'grayscale(100%) contrast(210%) brightness(102%) sepia(10%)' },
      13: { name: '🖊️ Ballpoint Pen Blue Sketch', css: 'saturate(300%) hue-rotate(210deg) contrast(170%) brightness(95%)' },
      14: { name: '🖊️ Ballpoint Pen Red Sketch', css: 'saturate(300%) hue-rotate(330deg) contrast(180%) brightness(90%)' },
      15: { name: '🪵 Compressed Willow Charcoal', css: 'grayscale(100%) contrast(300%) brightness(70%) blur(1px)' },
      16: { name: '🪵 White Chalk on Black Board', css: 'grayscale(100%) invert(100%) contrast(250%) brightness(110%)' },
      17: { name: '🪵 Sanguine Red Chalk Study', css: 'grayscale(100%) sepia(100%) hue-rotate(-35deg) saturate(250%) contrast(140%)' },
      18: { name: '🪵 Conte Crayon Noir', css: 'grayscale(100%) contrast(260%) brightness(82%) blur(0.6px)' },
      19: { name: '🌾 Tinted Tone Paper Sketch', css: 'grayscale(100%) sepia(35%) contrast(165%) brightness(102%)' },
      20: { name: '✏️ Cross-Hatch Fine Shade', css: 'grayscale(100%) contrast(240%) brightness(90%)' },
      21: { name: '✏️ Diagonal Parallel Hatch', css: 'grayscale(100%) contrast(190%) brightness(105%) blur(0.3px)' },
      22: { name: '✒️ Contour Line Drawing', css: 'grayscale(100%) contrast(280%) brightness(98%)' },
      23: { name: '🖋️ Minimalist Gesture Pen', css: 'grayscale(100%) contrast(170%) brightness(112%)' },
      24: { name: '📝 Rough Aesthetic Scribble', css: 'grayscale(100%) contrast(200%) brightness(105%) blur(0.5px)' },
      25: { name: '🖌️ Gouache Line & Wash', css: 'grayscale(100%) contrast(160%) brightness(110%) saturate(120%)' },
      26: { name: '✒️ Fountain Pen Fluid Stroke', css: 'grayscale(100%) contrast(220%) brightness(95%)' },
      27: { name: '🖋️ Dip Pen & Liquid Ink', css: 'grayscale(100%) contrast(290%) brightness(88%)' },
      28: { name: '📝 Editorial Cartoon Ink', css: 'grayscale(100%) contrast(270%) brightness(102%)' },
      29: { name: '🪵 Academic Life Drawing Charcoal', css: 'grayscale(100%) contrast(210%) brightness(88%) blur(0.6px)' },
      30: { name: '📜 Antique Manuscript Quill', css: 'grayscale(100%) sepia(85%) contrast(190%) brightness(95%)' },
      31: { name: '📐 Mechanical Draftsman Pen', css: 'grayscale(100%) contrast(230%) brightness(108%)' },
      32: { name: '✒️ Comic Book Inker Pro', css: 'grayscale(100%) contrast(310%) brightness(90%)' },
      33: { name: '🖋️ Manga Speed Pen Stroke', css: 'grayscale(100%) contrast(280%) brightness(100%)' },
      34: { name: '📝 Storyboard Rough Pencil', css: 'grayscale(100%) contrast(150%) brightness(115%) blur(0.7px)' },
      35: { name: '✏️ Hard Pastel Pencil Sketch', css: 'grayscale(100%) contrast(135%) brightness(125%)' },
      36: { name: '🪵 Soft Pastel Sketch Shade', css: 'grayscale(100%) contrast(175%) brightness(105%) blur(0.8px)' },
      37: { name: '✒️ Copperplate Calligraphy Ink', css: 'grayscale(100%) contrast(300%) brightness(85%)' },
      38: { name: '🖋️ Gothic Blackletter Ink', css: 'grayscale(100%) contrast(340%) brightness(75%)' },
      39: { name: '📝 Italic Nib Handwriting', css: 'grayscale(100%) contrast(220%) brightness(96%)' },
      40: { name: '📐 Engineering Isometric Grid', css: 'grayscale(100%) contrast(190%) brightness(110%) invert(8%)' },
      41: { name: '🏛️ Etching Plate Copperline', css: 'grayscale(100%) contrast(210%) brightness(98%) sepia(15%)' },
      42: { name: '🏛️ Woodcut Block Print', css: 'grayscale(100%) contrast(350%) brightness(70%)' },
      43: { name: '🏛️ Linocut Impression', css: 'grayscale(100%) contrast(280%) brightness(85%)' },
      44: { name: '🏛️ Mezzotint Tone Shading', css: 'grayscale(100%) contrast(170%) brightness(92%) blur(0.5px)' },
      45: { name: '🏛️ Aquatint Fine Etch', css: 'grayscale(100%) contrast(160%) brightness(102%) blur(0.4px)' },
      46: { name: '📜 Papyrus Sketch Texture', css: 'grayscale(100%) sepia(60%) contrast(140%) brightness(112%)' },
      47: { name: '🌾 Rice Paper Sumi Wash', css: 'grayscale(100%) sepia(15%) contrast(130%) brightness(118%) blur(0.6px)' },
      48: { name: '✏️ Designer Concept Sketch', type: 'canvas', css: 'grayscale(100%) contrast(160%) brightness(110%) blur(0.3px)' },
      49: { name: '✒️ Master Illustrator Lineart', type: 'canvas', css: 'grayscale(100%) contrast(260%) brightness(98%)' }
    };
    return { id, type: 'canvas' as const, ...styles[i] };
  })
];

// --- 2. Derived Categories & Builders ---

export const cartoonCategory = {
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

export const tensorSketchCategories = tensorSketchFamilies.map((family) => ({
  name: family.title,
  filters: family.names.map((name, variation) => ({
    id: `tf_sketch_${family.id}_${variation + 1}`,
    name: `${family.icon} TF ${name}`,
    type: 'tensorflow' as const,
    sketch: { family: family.id, variation }
  }))
}));

export const canvasSketchCategories = canvasSketchFamilies.map((family) => ({
  name: family.title,
  filters: family.names.map((name, variation) => {
    const index = variation % 5;
    const cssByFamily: Record<string, string[]> = {
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

// --- 3. Master Export Categories ---

export const filterCategories = [
  cartoonCategory,
  ...tensorSketchCategories,
  ...canvasSketchCategories,
  {
    name: "Master Sketch & Pen Suite (50+ Styles)",
    filters: masterSketchPenFilters
  },
  {
    name: "Cinematic & Film Grades (30+ Styles)",
    filters: cinematicFilters
  },
  {
    name: "Professional Studio & Retouch",
    filters: professionalStudioFilters
  },
  {
    name: "Neural & Tensor Matrix (TensorFlow.js)",
    filters: neuralAndTensorFilters
  }
];