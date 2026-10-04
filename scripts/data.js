const batchOneFilters = [
  {
    filterId: 'sketch_outline',
    title: '✏️ TF Clean Line Outlines',
    description: 'Clean precise edge detection lines for technical and structural drawing outlines.',
    category: 'Master Sketch & Pen Suite',
    type: 'tensorflow',
    tags: ['sketch', 'outline', 'lines', 'clean', 'technical'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_minimal',
    title: '🖋️ TF Minimalist Contours',
    description: 'Minimalist contour lines highlighting essential shapes and structural boundaries.',
    category: 'Master Sketch & Pen Suite',
    type: 'tensorflow',
    tags: ['sketch', 'minimal', 'contours', 'lines', 'simple'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_graphite',
    title: '📝 Soft Graphite Pencil',
    description: 'Soft graphite pencil shading with smooth gradations, subtle blur, and high contrast detail.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(140%) brightness(110%) blur(0.5px)',
    tags: ['graphite', 'pencil', 'soft', 'sketch', 'monochrome'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_crosshatch',
    title: '✒️ Fine Ink Pen & Hatch',
    description: 'Detailed cross-hatching ink pen lines with inverted tone accents and deep contrast.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(220%) brightness(95%) invert(15%)',
    tags: ['ink', 'crosshatch', 'pen', 'hatch', 'fine'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_charcoal',
    title: '🪵 Deep Charcoal Sketch',
    description: 'Heavy raw vine charcoal lines, deep blacks, and textured paper blur for dramatic contrast.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(250%) brightness(85%) blur(0.8px)',
    tags: ['charcoal', 'sketch', 'dark', 'textured', 'dramatic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_detailed_portrait',
    title: '👤 TF Professional Pencil Portrait',
    description: 'Fine art pencil portrait shading optimized for human features, skin textures, and depth.',
    category: 'Master Sketch & Pen Suite',
    type: 'tensorflow',
    tags: ['portrait', 'pencil', 'professional', 'face', 'shading'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_stipple_dot',
    title: '⚫ TF Pointillism Stipple Ink',
    description: 'Pointillist stippling ink effect using density dot matrices to simulate shadow and form.',
    category: 'Master Sketch & Pen Suite',
    type: 'tensorflow',
    tags: ['stipple', 'dot', 'pointillism', 'ink', 'texture'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_blueprint_sketch',
    title: '📏 TF Architectural Line Study',
    description: 'Precise architectural line study with blueprint alignment and structural layout grids.',
    category: 'Architectural & Technical',
    type: 'tensorflow',
    tags: ['blueprint', 'architectural', 'lines', 'drafting', 'study'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_lithograph',
    title: '🏛️ TF Antique Lithograph Press',
    description: 'Classic antique lithograph press texture with grain, stone matrix plate feel, and faded darks.',
    category: 'Classic & Vintage Press',
    type: 'tensorflow',
    tags: ['lithograph', 'antique', 'press', 'vintage', 'stone'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_calligraphy',
    title: '✒️ Heavy Calligraphy Nib Ink',
    description: 'High contrast heavy calligraphy nib strokes with dramatic ink flow intensity.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(300%) brightness(90%)',
    tags: ['calligraphy', 'nib', 'ink', 'heavy', 'strokes'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_gestural',
    title: '⚡ Gestural Quick Contour',
    description: 'Fast gestural contour sketch with expressive lines and dynamic movement.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(190%) brightness(115%) blur(0.4px)',
    tags: ['gestural', 'contour', 'quick', 'movement', 'sketch'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_architectural',
    title: '📐 Precise Drafting Line',
    description: 'Clean high contrast drafting line effect with subtle structural inversion.',
    category: 'Architectural & Technical',
    type: 'canvas',
    css: 'grayscale(100%) contrast(240%) brightness(105%) invert(5%)',
    tags: ['drafting', 'precise', 'architectural', 'lines', 'clean'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_vellum',
    title: '📜 Translucent Vellum Pencil',
    description: 'Warm sepia-tinted pencil drawing on translucent vellum tracing paper.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) sepia(30%) contrast(150%) brightness(110%)',
    tags: ['vellum', 'tracing', 'pencil', 'sepia', 'translucent'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_newsprint',
    title: '📰 Newsprint Quick Sketch',
    description: 'Textured quick newspaper print sketch with vintage sepia undertones.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) sepia(20%) contrast(170%) brightness(100%)',
    tags: ['newsprint', 'newspaper', 'quick', 'vintage', 'rough'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_01',
    title: '🖋️ 2H Hard Technical Pencil',
    description: 'Light crisp 2H technical pencil strokes for delicate construction lines.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(130%) brightness(120%)',
    tags: ['pencil', '2h', 'hard', 'technical', 'light'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_02',
    title: '✏️ 4B Soft Dark Graphite',
    description: 'Rich dark soft graphite shading with deep shadows and velvety tones.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(190%) brightness(85%) blur(0.4px)',
    tags: ['graphite', '4b', 'soft', 'dark', 'shading'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_03',
    title: '🪵 6B Extra Dark Charcoal',
    description: 'Extremely deep charcoal blacks with high contrast and smoky blur.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(280%) brightness(75%) blur(0.7px)',
    tags: ['charcoal', '6b', 'dark', 'smoky', 'black'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_04',
    title: '✒️ Archival Micron Pen 0.1',
    description: 'Ultra-fine 0.1mm archival micron technical ink pen line work.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(250%) brightness(95%)',
    tags: ['pen', 'micron', 'archival', 'fine', 'ink'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_05',
    title: '🖋️ Archival Micron Pen 0.5',
    description: 'Medium-weight 0.5mm archival pen lines for bold contouring.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(210%) brightness(100%)',
    tags: ['pen', 'micron', '0.5', 'medium', 'ink'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_06',
    title: '🖌️ Chinese Bamboo Brush Ink',
    description: 'Traditional Chinese bamboo brush sumi ink with dramatic wet bleed and high contrast.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(320%) brightness(80%) blur(0.9px)',
    tags: ['brush', 'chinese', 'sumi', 'ink', 'traditional'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_07',
    title: '✒️ Japanese Sumi-E Ink Wash',
    description: 'Soft expressive Japanese Sumi-E ink wash with gentle gradients and atmospheric blur.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(180%) brightness(110%) blur(1.2px)',
    tags: ['sumi-e', 'japanese', 'wash', 'ink', 'soft'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_08',
    title: '📜 Antique Parchment Sketch',
    description: 'Aged parchment paper aesthetic with heavy sepia tones and classic pencil texture.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) sepia(70%) contrast(160%) brightness(105%)',
    tags: ['parchment', 'antique', 'sepia', 'aged', 'vintage'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_09',
    title: '🏛️ Renaissance Silverpoint',
    description: 'Delicate Renaissance silverpoint metallic stylus drawing with subtle sepia warmth.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) sepia(20%) contrast(140%) brightness(115%)',
    tags: ['silverpoint', 'renaissance', 'classical', 'metallic', 'stylus'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_10',
    title: '📐 Blueprint Cyanotype',
    description: 'Classic cyanotype blueprint effect featuring deep blue hues and high contrast lines.',
    category: 'Architectural & Technical',
    type: 'canvas',
    css: 'grayscale(100%) invert(95%) hue-rotate(190deg) contrast(220%)',
    tags: ['blueprint', 'cyanotype', 'blue', 'architectural', 'technical'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_11',
    title: '📐 Sepia Architectural Draft',
    description: 'Vintage sepia-toned architectural draft layout with inverted high-contrast plotting.',
    category: 'Architectural & Technical',
    type: 'canvas',
    css: 'grayscale(100%) invert(90%) sepia(100%) hue-rotate(-30deg) contrast(200%)',
    tags: ['sepia', 'architectural', 'draft', 'vintage', 'blueprint'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_12',
    title: '📝 Vintage Ledger Pencil',
    description: 'Handwritten ledger paper pencil marks with nostalgic sepia shading.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) sepia(45%) contrast(150%) brightness(108%)',
    tags: ['ledger', 'vintage', 'pencil', 'notebook', 'nostalgic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_13',
    title: '📰 Rough Newsprint Etching',
    description: 'Gritty newsprint etching style with high-contrast printed dot and line textures.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) contrast(210%) brightness(102%) sepia(10%)',
    tags: ['newsprint', 'etching', 'rough', 'gritty', 'print'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_14',
    title: '🖊️ Ballpoint Pen Blue Sketch',
    description: 'Vibrant blue ballpoint pen ink drawing style with high saturation and sharp contrast.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'saturate(300%) hue-rotate(210deg) contrast(170%) brightness(95%)',
    tags: ['ballpoint', 'pen', 'blue', 'ink', 'sketch'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_15',
    title: '🖊️ Ballpoint Pen Red Sketch',
    description: 'Classic red ballpoint pen grading and margin sketch aesthetic.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'saturate(300%) hue-rotate(330deg) contrast(180%) brightness(90%)',
    tags: ['ballpoint', 'pen', 'red', 'ink', 'margin'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_16',
    title: '🪵 Compressed Willow Charcoal',
    description: 'Intense compressed willow charcoal expression with heavy blacks and atmospheric blur.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(300%) brightness(70%) blur(1px)',
    tags: ['charcoal', 'willow', 'compressed', 'dark', 'expressive'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_17',
    title: '🪵 White Chalk on Black Board',
    description: 'Inverted chalk drawing effect simulating white pastel and chalk on a black chalkboard.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) invert(100%) contrast(250%) brightness(110%)',
    tags: ['chalk', 'white', 'blackboard', 'inverted', 'pastel'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_18',
    title: '🪵 Sanguine Red Chalk Study',
    description: 'Traditional sanguine red chalk figure study with warm reddish-brown earthy tones.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) sepia(100%) hue-rotate(-35deg) saturate(250%) contrast(140%)',
    tags: ['sanguine', 'red', 'chalk', 'study', 'figure'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_19',
    title: '🪵 Conte Crayon Noir',
    description: 'Rich velvety Conte crayon noir shading with deep dramatic contrast.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(260%) brightness(82%) blur(0.6px)',
    tags: ['conte', 'crayon', 'noir', 'black', 'shading'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_20',
    title: '🌾 Tinted Tone Paper Sketch',
    description: 'Classic toned tan paper sketch effect with balanced highlights and warm midtones.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) sepia(35%) contrast(165%) brightness(102%)',
    tags: ['toned', 'paper', 'tan', 'sketch', 'warm'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_21',
    title: '✏️ Cross-Hatch Fine Shade',
    description: 'Intricate fine cross-hatching shade pattern for dimensional depth.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(240%) brightness(90%)',
    tags: ['crosshatch', 'shade', 'fine', 'depth', 'lines'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_22',
    title: '✏️ Diagonal Parallel Hatch',
    description: 'Clean parallel diagonal hatch lines providing subtle tonal values.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(190%) brightness(105%) blur(0.3px)',
    tags: ['diagonal', 'hatch', 'parallel', 'lines', 'tonal'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_23',
    title: '✒️ Contour Line Drawing',
    description: 'Pure high-contrast contour line art defining pure outer edges and forms.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(280%) brightness(98%)',
    tags: ['contour', 'line', 'drawing', 'pure', 'edges'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_24',
    title: '🖋️ Minimalist Gesture Pen',
    description: 'Light minimalist gesture pen strokes for clean airy compositions.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(170%) brightness(112%)',
    tags: ['minimalist', 'gesture', 'pen', 'airy', 'clean'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_25',
    title: '📝 Rough Aesthetic Scribble',
    description: 'Expressive rough aesthetic scribble with raw energy and texture.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(200%) brightness(105%) blur(0.5px)',
    tags: ['scribble', 'rough', 'aesthetic', 'expressive', 'raw'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_26',
    title: '🖌️ Gouache Line & Wash',
    description: 'Gouache paint line and wash combination with subtle color hints and high contrast.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(160%) brightness(110%) saturate(120%)',
    tags: ['gouache', 'wash', 'paint', 'line', 'color'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_27',
    title: '✒️ Fountain Pen Fluid Stroke',
    description: 'Elegant fountain pen fluid ink strokes with smooth contrast gradation.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(220%) brightness(95%)',
    tags: ['fountain', 'pen', 'fluid', 'ink', 'strokes'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_28',
    title: '🖋️ Dip Pen & Liquid Ink',
    description: 'Old-school dip pen and heavy liquid ink with rich dark concentrations.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(290%) brightness(88%)',
    tags: ['dip', 'pen', 'liquid', 'ink', 'dark'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_29',
    title: '📝 Editorial Cartoon Ink',
    description: 'Bold comic and editorial cartoon inking style with punchy high contrast lines.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(270%) brightness(102%)',
    tags: ['editorial', 'cartoon', 'comic', 'ink', 'bold'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_30',
    title: '🪵 Academic Life Drawing Charcoal',
    description: 'Classical academic life drawing charcoal with soft tonal modeling and dark outlines.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(210%) brightness(88%) blur(0.6px)',
    tags: ['academic', 'life', 'drawing', 'charcoal', 'classical'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_31',
    title: '📜 Antique Manuscript Quill',
    description: 'Aged manuscript quill ink script with heavy sepia stain and antique contrast.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) sepia(85%) contrast(190%) brightness(95%)',
    tags: ['manuscript', 'quill', 'antique', 'sepia', 'script'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_32',
    title: '📐 Mechanical Draftsman Pen',
    description: 'Rigid mechanical draftsman pen lines with razor-sharp technical precision.',
    category: 'Architectural & Technical',
    type: 'canvas',
    css: 'grayscale(100%) contrast(230%) brightness(108%)',
    tags: ['mechanical', 'draftsman', 'pen', 'precision', 'technical'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_33',
    title: '✒️ Comic Book Inker Pro',
    description: 'Professional comic book inker style with heavy shadow blocks and bold outlines.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(310%) brightness(90%)',
    tags: ['comic', 'inker', 'pro', 'shadows', 'outlines'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_34',
    title: '🖋️ Manga Speed Pen Stroke',
    description: 'Dynamic manga speed pen lines with high contrast velocity and sharp edges.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(280%) brightness(100%)',
    tags: ['manga', 'speed', 'pen', 'dynamic', 'sharp'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_35',
    title: '📝 Storyboard Rough Pencil',
    description: 'Loose storyboard rough pencil sketch with quick motion lines and soft blur.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(150%) brightness(115%) blur(0.7px)',
    tags: ['storyboard', 'rough', 'pencil', 'motion', 'loose'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_36',
    title: '✏️ Hard Pastel Pencil Sketch',
    description: 'Subtle hard pastel pencil drawing with soft texture and bright highlights.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(135%) brightness(125%)',
    tags: ['pastel', 'pencil', 'hard', 'texture', 'highlights'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_37',
    title: '🪵 Soft Pastel Sketch Shade',
    description: 'Soft pastel blending effect with rich tonal gradients and hazy artistic texture.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(175%) brightness(105%) blur(0.8px)',
    tags: ['pastel', 'soft', 'shading', 'blending', 'hazy'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_38',
    title: '✒️ Copperplate Calligraphy Ink',
    description: 'Fine copperplate calligraphy ink lines with extreme contrast and delicate hair strokes.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(300%) brightness(85%)',
    tags: ['copperplate', 'calligraphy', 'ink', 'fine', 'delicate'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_39',
    title: '🖋️ Gothic Blackletter Ink',
    description: 'Heavy Gothic blackletter ink style with thick vertical pillars and maximum contrast.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(340%) brightness(75%)',
    tags: ['gothic', 'blackletter', 'ink', 'heavy', 'thick'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_40',
    title: '📝 Italic Nib Handwriting',
    description: 'Classic italic nib handwriting script with clean diagonal stroke contrast.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(220%) brightness(96%)',
    tags: ['italic', 'nib', 'handwriting', 'script', 'clean'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_41',
    title: '📐 Engineering Isometric Grid',
    description: 'Engineering isometric drafting aesthetic with structured grid lines and high clarity.',
    category: 'Architectural & Technical',
    type: 'canvas',
    css: 'grayscale(100%) contrast(190%) brightness(110%) invert(8%)',
    tags: ['engineering', 'isometric', 'grid', 'drafting', 'technical'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_42',
    title: '🏛️ Etching Plate Copperline',
    description: 'Fine copperplate etching aesthetic with warm sepia plate tone and crisp incisions.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) contrast(210%) brightness(98%) sepia(15%)',
    tags: ['etching', 'plate', 'copper', 'sepia', 'crisp'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_43',
    title: '🏛️ Woodcut Block Print',
    description: 'Bold woodcut block print effect with high contrast black patches and carved textures.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) contrast(350%) brightness(70%)',
    tags: ['woodcut', 'block', 'print', 'bold', 'carved'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_44',
    title: '🏛️ Linocut Impression',
    description: 'Expressive linocut stamp impression style with rich dark tones and carved linework.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) contrast(280%) brightness(85%)',
    tags: ['linocut', 'impression', 'stamp', 'dark', 'carved'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_45',
    title: '🏛️ Mezzotint Tone Shading',
    description: 'Smooth mezzotint tonal engraving texture with rich gradient blacks and subtle blur.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) contrast(170%) brightness(92%) blur(0.5px)',
    tags: ['mezzotint', 'tone', 'shading', 'engraving', 'smooth'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_46',
    title: '🏛️ Aquatint Fine Etch',
    description: 'Fine aquatint printmaking texture with delicate granular tone gradations.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) contrast(160%) brightness(102%) blur(0.4px)',
    tags: ['aquatint', 'etch', 'printmaking', 'granular', 'fine'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_47',
    title: '📜 Papyrus Sketch Texture',
    description: 'Warm textured papyrus paper background sketch with heavy sepia antique tones.',
    category: 'Classic & Vintage Press',
    type: 'canvas',
    css: 'grayscale(100%) sepia(60%) contrast(140%) brightness(112%)',
    tags: ['papyrus', 'texture', 'antique', 'sepia', 'warm'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_48',
    title: '🌾 Rice Paper Sumi Wash',
    description: 'Delicate translucent rice paper wash effect with soft natural blur and minimal sepia.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) sepia(15%) contrast(130%) brightness(118%) blur(0.6px)',
    tags: ['rice', 'paper', 'sumi', 'wash', 'translucent'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_49',
    title: '✏️ Designer Concept Sketch',
    description: 'Modern industrial designer concept sketch with crisp contours and light soft blur.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(160%) brightness(110%) blur(0.3px)',
    tags: ['designer', 'concept', 'sketch', 'industrial', 'modern'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cs_50',
    title: '✒️ Master Illustrator Lineart',
    description: 'Sharp professional master illustrator clean line art with high contrast detailing.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(260%) brightness(98%)',
    tags: ['master', 'illustrator', 'lineart', 'clean', 'professional'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  }
];

// Batch Two Filters: Cinematic & Film Grades

const batchTwoFilters = [
  {
    filterId: 'cine_technicolor_35',
    title: '🎬 1935 Technicolor Two-Strip',
    description: 'Vintage 1935 two-strip Technicolor film grade with rich warm sepia tones, saturated color shifts, and classic cinema atmosphere.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'sepia(40%) saturate(220%) hue-rotate(-15deg) contrast(120%)',
    tags: ['technicolor', 'vintage', '1935', 'cinema', 'warm', 'sepia'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_blade_runner',
    title: '🌧️ Blade Runner Amber & Teal',
    description: 'Sci-fi dystopian atmosphere with high contrast amber and teal color grading inspired by futuristic urban nightscapes.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'contrast(130%) saturate(140%) hue-rotate(25deg) sepia(20%)',
    tags: ['blade runner', 'cyberpunk', 'amber', 'teal', 'sci-fi', 'dystopian'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_matrix_green',
    title: '💻 The Matrix Terminal Code',
    description: 'Monochrome digital terminal aesthetic with vibrant green tint, high saturation, and intense hacker code contrast.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'grayscale(100%) sepia(100%) hue-rotate(85deg) saturate(400%) contrast(150%)',
    tags: ['matrix', 'green', 'terminal', 'digital', 'cyber', 'hacker'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_cyberpunk_neon',
    title: '⚡ Cyberpunk Neon District',
    description: 'Ultra-saturated neon pink and purple urban glow with heavy contrast for futuristic cyberpunk night scenes.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'saturate(300%) contrast(150%) hue-rotate(290deg)',
    tags: ['cyberpunk', 'neon', 'pink', 'night', 'futuristic', 'urban'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_kodachrome_64',
    title: '🎞️ Classic Kodachrome 64',
    description: 'Legendary vintage slide film look featuring high contrast, punchy warm saturation, and timeless rich color depth.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'contrast(140%) saturate(160%) sepia(15%) brightness(105%)',
    tags: ['kodachrome', 'slide film', 'vintage', 'classic', 'warm', 'rich'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_panavision_noir',
    title: '🕵️ Panavision High-Contrast Noir',
    description: 'Dramatic black and white film noir grade with deep crushed shadows, bright highlights, and high silver contrast.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'grayscale(100%) contrast(210%) brightness(85%)',
    tags: ['noir', 'black and white', 'panavision', 'dramatic', 'shadows', 'classic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_bleach_bypass',
    title: '🧪 Silver Bleach Bypass Film',
    description: 'Gritty war-movie bleach bypass process with low color saturation, high contrast grain, and metallic highlights.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'grayscale(50%) contrast(190%) brightness(110%)',
    tags: ['bleach bypass', 'gritty', 'war', 'metallic', 'desaturated', 'film'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_cross_process',
    title: '🧪 Cross-Processed Slide Stock',
    description: 'Unconventional experimental cross-processed slide film look with surreal shifting hues and heightened contrast.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'saturate(200%) hue-rotate(320deg) contrast(130%)',
    tags: ['cross process', 'experimental', 'surreal', 'slide film', 'vibrant'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_teal_orange',
    title: '🎬 Hollywood Blockbuster Teal & Orange',
    description: 'Modern Hollywood blockbuster color palette balancing cool teal shadows with warm orange skin tones.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'contrast(125%) saturate(150%) hue-rotate(15deg)',
    tags: ['teal', 'orange', 'blockbuster', 'hollywood', 'modern', 'cinematic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_vintage_70s',
    title: '📻 1970s Warm Fade Film',
    description: 'Nostalgic 1970s retro aesthetic with faded warm sepia tones, soft contrast, and relaxed saturation.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'sepia(60%) contrast(85%) brightness(110%) saturate(75%)',
    tags: ['1970s', 'retro', 'vintage', 'faded', 'nostalgic', 'warm'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_nordic_ice',
    title: '❄️ Nordic Noir Cold Frost',
    description: 'Bleak, icy Scandinavian thriller aesthetic with cool blue shifts, low saturation, and crisp contrast.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'hue-rotate(195deg) saturate(70%) contrast(120%) brightness(105%)',
    tags: ['nordic', 'noir', 'cold', 'frost', 'blue', 'thriller'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_sunset_noir',
    title: '🌇 Golden Hour Sunset Drama',
    description: 'Emotional golden hour sunset lighting with intense warm sepia and crimson shifts for dramatic storytelling.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'sepia(45%) saturate(180%) hue-rotate(-25deg) contrast(130%)',
    tags: ['sunset', 'golden hour', 'warm', 'dramatic', 'emotional', 'cinematic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_sepia_dream',
    title: '📜 Antique Sepia Cinema',
    description: 'Deep historic antique sepia look reminiscent of silent era motion pictures and old photography archives.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'sepia(90%) contrast(120%) brightness(105%)',
    tags: ['sepia', 'antique', 'silent era', 'historic', 'archive', 'classic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_polaroid_600',
    title: '📸 Vintage Polaroid Fade',
    description: 'Instant film aesthetic with soft washed-out contrast, bright exposure, and gentle sepia border tinting.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'contrast(90%) brightness(120%) saturate(70%) sepia(25%)',
    tags: ['polaroid', 'instant film', 'vintage', 'faded', 'soft', 'retro'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_super_8',
    title: '📼 Super 8 Home Movie Grain',
    description: 'Nostalgic home movie texture with high contrast grain, warm sepia undertones, and slight optical blur.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'contrast(150%) saturate(120%) sepia(40%) blur(0.3px)',
    tags: ['super 8', 'home movie', 'grain', 'nostalgic', 'retro', 'home video'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_technicolor_3strip',
    title: '🎨 Technicolor 3-Strip Vibrant',
    description: 'Technicolor three-strip process simulation featuring hyper-vibrant primary color separation and lush radiance.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'saturate(240%) contrast(130%) brightness(102%)',
    tags: ['technicolor', 'vibrant', 'primary colors', 'lush', 'colorful', 'retro film'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_ghibli_anime',
    title: '🌸 Anime Studio Ghibli Vibrant',
    description: 'Whimsical, luminous anime art style inspired by hand-painted pastoral skies and vibrant natural landscapes.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'brightness(112%) saturate(160%) contrast(105%) hue-rotate(5deg)',
    tags: ['anime', 'ghibli', 'vibrant', 'whimsical', 'painterly', 'bright'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_sin_city',
    title: '❤ Sin City Selective Red',
    description: 'High-contrast graphic novel style with absolute monochrome background and striking selective red color pop.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'grayscale(100%) contrast(250%) saturate(500%) hue-rotate(-40deg)',
    tags: ['sin city', 'selective color', 'red', 'monochrome', 'graphic novel', 'dramatic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_fuji_velvia',
    title: '🌲 Fujifilm Velvia Landscape',
    description: 'Professional landscape transparency film simulation with ultra-vivid greens, deep shadows, and high contrast punch.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'saturate(220%) contrast(135%) brightness(98%)',
    tags: ['fujifilm', 'velvia', 'landscape', 'vivid', 'nature', 'greens'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'cine_edward_hopper',
    title: '🎨 Cinematic Painterly Light',
    description: 'Evocative painterly realism inspired by classic cinematic framing, quiet lighting, and subtle warm tones.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'contrast(115%) saturate(130%) sepia(15%) brightness(108%)',
    tags: ['hopper', 'painterly', 'artistic', 'cinematic', 'quiet', 'light'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  }
];

// batch 3 starts

const batchThreeFilters = [
  {
    filterId: 'normal',
    title: '🌟 Original Studio',
    description: 'Original unedited studio image with clean default balancing and no color transformations.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'none',
    tags: ['original', 'normal', 'clean', 'default', 'unedited'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'studio_soft',
    title: '✨ Soft Portrait Glow',
    description: 'Soft portrait glow with gentle brightening, reduced harsh contrast, and subtle smoothing blur for flattering facial features.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(105%) contrast(95%) blur(0.3px) saturate(105%)',
    tags: ['soft', 'portrait', 'glow', 'smooth', 'flattering', 'bright'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'studio_crisp',
    title: '💎 High Definition Edge',
    description: 'High definition crisp edge enhancement with heightened contrast and punchy clarity for sharp, striking details.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(135%) saturate(110%) brightness(102%)',
    tags: ['crisp', 'hd', 'high definition', 'sharp', 'clarity', 'detail'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'matte_film',
    title: '🎞 Matte Cinematic Film',
    description: 'Matte cinematic film finish featuring subdued contrast, lifted blacks, and a gentle vintage touch for an organic look.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(90%) brightness(105%) saturate(85%) sepia(15%)',
    tags: ['matte', 'cinematic', 'film', 'subdued', 'organic', 'vintage'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'rich_shadows',
    title: '🌑 Rich Shadow Balance',
    description: 'Balanced contrast enhancement focusing on rich shadow depth and vibrant midtones to create a grounded, deep look.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(120%) brightness(95%) saturate(115%)',
    tags: ['shadows', 'rich', 'balance', 'depth', 'contrast', 'dark'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'studio_clarity',
    title: '🔍 Ultra Clarity & Definition',
    description: 'Aggressive clarity enhancement with high contrast and boosted saturation to make every texture pop.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(150%) saturate(120%) brightness(105%)',
    tags: ['clarity', 'definition', 'texture', 'punchy', 'vibrant', 'sharp'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_porcelain',
    title: '🧖‍♀️ Porcelain Skin Softening',
    description: 'Porcelain skin softening filter providing a luminous bright complexion with minimized contrast and delicate blur.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(108%) contrast(90%) blur(0.4px) saturate(98%)',
    tags: ['porcelain', 'skin', 'softening', 'smooth', 'bright', 'beauty'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_high_fashion',
    title: '👠 High Fashion Editorial Contrast',
    description: 'High fashion editorial contrast look with dramatic tonal separation, sleek tones, and striking visual presence.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(160%) saturate(110%) brightness(102%) grayscale(10%)',
    tags: ['editorial', 'fashion', 'high contrast', 'dramatic', 'sleek', 'magazine'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_warm_ivory',
    title: '🦢 Warm Ivory Portrait Tone',
    description: 'Warm ivory portrait tone with gentle sepia infusion and balanced brightness for classic studio photography.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'sepia(18% ) brightness(106%) saturate(105%) contrast(102%)',
    tags: ['ivory', 'warm', 'portrait', 'tone', 'sepia', 'classic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_cool_porcelain',
    title: '❄️ Cool Porcelain Skin Balance',
    description: 'Cool porcelain skin tone balance featuring refreshing blue hue shifts and crisp high-key brightness.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'hue-rotate(185deg) saturate(85%) contrast(105%) brightness(104%)',
    tags: ['cool', 'porcelain', 'skin', 'blue', 'crisp', 'balance'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_bronze_tan',
    title: '🏽 Sun-Kissed Bronze Glow',
    description: 'Sun-kissed bronze tan color grade with rich warm sepia tones and enhanced saturation for a healthy summer glow.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'sepia(35% ) saturate(130%) contrast(110%) brightness(98%)',
    tags: ['bronze', 'tan', 'sun-kissed', 'warm', 'summer', 'glow'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_caramel_skin',
    title: '🍮 Caramel Tone Retouch',
    description: 'Caramel skin tone enhancement with smooth warm undertones and balanced contrast for a rich complexion.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'sepia(25% ) saturate(120%) contrast(108%) brightness(102%)',
    tags: ['caramel', 'skin', 'tone', 'warm', 'smooth', 'complexion'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_matte_skin',
    title: '🧊 Anti-Shine Matte Finish',
    description: 'Anti-shine matte finish reducing specular highlights and controlling brightness for a flat, matte appearance.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(115%) brightness(96%) saturate(90%)',
    tags: ['matte', 'anti-shine', 'flat', 'controlled', 'finish', 'skin'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_airbrushed',
    title: '💨 Studio Airbrushed Look',
    description: 'Professional studio airbrushed look with soft focus blurring and brightened lighting for flawless skin appearance.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(110%) contrast(92%) blur(0.6px) saturate(102%)',
    tags: ['airbrushed', 'flawless', 'smooth', 'studio', 'soft focus', 'beauty'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_commercial_pop',
    title: '🏷️ Commercial Product Pop',
    description: 'Commercial product pop grade with heightened contrast, vivid saturation, and punchy brightness for ads.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(140%) saturate(130%) brightness(104%)',
    tags: ['commercial', 'product', 'pop', 'vivid', 'advertising', 'punchy'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_clean_headshot',
    title: '👤 Clean Corporate Headshot',
    description: 'Clean corporate headshot color grade with crisp professional contrast and balanced natural brightness.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(115%) brightness(105%) saturate(102%)',
    tags: ['corporate', 'headshot', 'clean', 'professional', 'business', 'portrait'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_beautifying',
    title: '🌸 Soft Focus Beautifying',
    description: 'Soft focus beautifying filter providing subtle brightness and gentle diffusion for a dreamy portrait feel.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(107%) contrast(95%) blur(0.5px)',
    tags: ['beautifying', 'soft focus', 'dreamy', 'gentle', 'diffuse', 'portrait'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_vibrant_lips',
    title: '💄 Rich Accent Saturation',
    description: 'Rich accent saturation filter boosting vivid tones and color depth to make features pop out.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'saturate(145%) contrast(115%) brightness(102%)',
    tags: ['vibrant', 'accent', 'saturation', 'pop', 'rich', 'vivid'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_deep_tan',
    title: '🏽 Deep Sunlit Retouch',
    description: 'Deep sunlit retouch filter featuring strong sepia warmth and rich golden undertones.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'sepia(40% ) saturate(140%) contrast(112%) brightness(95%)',
    tags: ['deep tan', 'sunlit', 'golden', 'warm', 'sepia', 'rich'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_silk_skin',
    title: '🧵 Silk Texture Smoothness',
    description: 'Silk texture smoothness filter creating a luxurious fine-grain soft touch on portrait subjects.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(106%) contrast(94%) blur(0.45px)',
    tags: ['silk', 'smooth', 'texture', 'luxurious', 'soft', 'skin'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_glamour_glow',
    title: '✨ 90s Glamour Glow',
    description: 'Classic 90s glamour glow with dreamlike soft diffusion, bright highlights, and nostalgic warm sheen.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(115%) contrast(88%) blur(0.8px) saturate(110%)',
    tags: ['glamour', '90s', 'glow', 'dreamy', 'nostalgic', 'soft'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_studio_key',
    title: '💡 High Key Studio Lighting',
    description: 'High key studio lighting simulation featuring bright, clean highlights and minimal shadows.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(125%) contrast(95%) saturate(95%)',
    tags: ['high key', 'bright', 'studio lighting', 'clean', 'highlights', 'minimal shadows'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_low_key',
    title: '🔦 Low Key Dramatic Shadows',
    description: 'Low key dramatic shadow look with deep blacks, high punchy contrast, and moody atmosphere.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(75%) contrast(170%) saturate(110%)',
    tags: ['low key', 'dramatic', 'shadows', 'moody', 'dark', 'contrast'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_rim_light',
    title: '⚡ Edge Rim Light Enhancement',
    description: 'Edge rim light enhancement boosting contrast and highlights to outline silhouettes and subjects dramatically.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(165%) brightness(108%) saturate(120%)',
    tags: ['rim light', 'edge', 'highlight', 'silhouette', 'dramatic', 'contrast'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_studio_fill',
    title: '🛋️ Balanced Studio Fill Light',
    description: 'Balanced studio fill light effect opening up shadows with clean, natural lighting compensation.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(110%) contrast(100%) saturate(105%)',
    tags: ['fill light', 'balanced', 'studio', 'natural', 'shadow recovery', 'even'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_neutral_bal',
    title: '⚖️ Neutral Gray Balancer',
    description: 'Neutral gray balance filter normalizing color temperature and providing steady professional midtones.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'grayscale(20%) contrast(110%) brightness(102%)',
    tags: ['neutral', 'gray', 'balance', 'normalize', 'professional', 'midtone'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_sharp_eyes',
    title: '👁️ High-Frequency Detail Sharp',
    description: 'High-frequency detail sharpening filter maximizing edge definition and eye clarity.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(155%) saturate(110%)',
    tags: ['sharp', 'detail', 'eyes', 'high-frequency', 'clarity', 'definition'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_subtle_warm',
    title: '🌤️ Subtle Morning Warmth',
    description: 'Subtle morning warmth filter adding a gentle touch of sunlit amber to portraits.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'sepia(12%) brightness(103%) saturate(108%)',
    tags: ['warmth', 'morning', 'subtle', 'sunlit', 'amber', 'portrait'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_cool_tone',
    title: '🧊 Crisp Architectural White',
    description: 'Crisp architectural white balance with cool hue shifts and modern clean aesthetics.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'hue-rotate(190deg) saturate(90%) brightness(105%)',
    tags: ['cool', 'white balance', 'crisp', 'modern', 'clean', 'architectural'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_golden_skin',
    title: '🍯 Golden Hour Portrait Balance',
    description: 'Golden hour portrait balance infusing rich warm tones and flattering illumination.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'sepia(30%) saturate(135%) contrast(105%)',
    tags: ['golden hour', 'warm', 'skin', 'portrait', 'flattering', 'glow'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_peachy_glow',
    title: '🍑 Soft Peachy Glow',
    description: 'Soft peachy glow with delicate pinkish-orange undertones and radiant skin finishing.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'sepia(15%) hue-rotate(-10deg) saturate(120%) brightness(106%)',
    tags: ['peachy', 'glow', 'soft', 'pink', 'radiant', 'skin'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_rose_complexion',
    title: '🌹 Rose Complexion Tint',
    description: 'Rose complexion tint adding healthy pinkish warmth and vitality to portraits.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'hue-rotate(345deg) saturate(125%) brightness(104%)',
    tags: ['rose', 'complexion', 'tint', 'pink', 'warmth', 'vitality'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_olive_skin',
    title: '🫒 Olive Skin Complexion',
    description: 'Olive skin complexion balance optimized for Mediterranean and neutral undertones.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'hue-rotate(45deg) saturate(90%) contrast(105%)',
    tags: ['olive', 'skin', 'complexion', 'undertones', 'neutral', 'portrait'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_espresso_tone',
    title: '☕ Rich Espresso Tone',
    description: 'Rich espresso tone filter providing deep contrast and warm dark skin tone definition.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'sepia(50%) contrast(130%) brightness(90%)',
    tags: ['espresso', 'rich', 'dark', 'skin tone', 'contrast', 'warm'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_alabaster',
    title: '🦢 Alabaster White Balance',
    description: 'Alabaster white balance filter delivering clean, pale porcelain skin highlights.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(112%) contrast(92%) saturate(95%)',
    tags: ['alabaster', 'white balance', 'clean', 'pale', 'highlights', 'porcelain'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_ivory_glow',
    title: '✨ Polished Ivory Glow',
    description: 'Polished ivory glow with subtle warm sheen and elegant professional radiance.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(108%) contrast(98%) sepia(10%)',
    tags: ['ivory', 'glow', 'polished', 'elegant', 'radiance', 'professional'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_velvet_skin',
    title: '🧸 Velvet Texture Tone',
    description: 'Velvet texture tone creating a rich, tactile, soft-touch fabric feel on skin.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(105%) brightness(102%) blur(0.25px)',
    tags: ['velvet', 'texture', 'tone', 'soft touch', 'tactile', 'smooth'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_satin_finish',
    title: '🎗️ Satin Gloss Finish',
    description: 'Satin gloss finish adding gentle luminosity and sleek polished contrast.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(120%) brightness(104%) saturate(105%)',
    tags: ['satin', 'gloss', 'finish', 'luminosity', 'sleek', 'polished'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_crystal_clear',
    title: '💎 Crystal Clear Retouch',
    description: 'Crystal clear retouch filter offering pristine high-contrast optical clarity.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(140%) brightness(105%) saturate(112%)',
    tags: ['crystal clear', 'pristine', 'clarity', 'sharp', 'clean', 'bright'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_studio_master',
    title: '👑 Master Studio Grade',
    description: 'Master studio grade color profile built for elite portfolio and commercial use.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(130%) brightness(103%) saturate(110%)',
    tags: ['master', 'studio grade', 'portfolio', 'commercial', 'elite', 'professional'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_natural_balance',
    title: '🌿 True-to-Life Natural',
    description: 'True-to-life natural balance preserving authentic skin tones and environmental colors.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(105%) brightness(101%) saturate(102%)',
    tags: ['natural', 'authentic', 'true-to-life', 'skin tones', 'balanced', 'subtle'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_pro_portrait',
    title: '📷 Professional Portrait Polish',
    description: 'Professional portrait polish combining controlled contrast and healthy skin vibrancy.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(118%) brightness(104%) saturate(106%)',
    tags: ['professional', 'portrait', 'polish', 'vibrancy', 'skin', 'studio'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_soft_contrast',
    title: '☁️ Soft Contrast Enhancer',
    description: 'Soft contrast enhancer flattening extreme darks for an approachable, gentle aesthetic.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(92%) brightness(106%) saturate(102%)',
    tags: ['soft contrast', 'gentle', 'approachable', 'low contrast', 'bright'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_dynamic_range',
    title: '📈 Dynamic Range Recovery',
    description: 'Dynamic range recovery tool balancing overly bright highlights and deep shadows.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(110%) brightness(105%) saturate(115%)',
    tags: ['dynamic range', 'recovery', 'balanced', 'highlights', 'shadows', 'exposure'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_highlight_saver',
    title: '☀️ Highlight Tone Optimizer',
    description: 'Highlight tone optimizer recovering blown-out whites and sharpening structural highlights.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(95%) contrast(125%) saturate(105%)',
    tags: ['highlight', 'saver', 'optimizer', 'exposure', 'recovery', 'contrast'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_shadow_lift',
    title: '🔦 Shadow Detail Enhancer',
    description: 'Shadow detail enhancer lifting dark areas to reveal hidden elements in low-light regions.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(115%) contrast(90%) saturate(105%)',
    tags: ['shadow lift', 'detail', 'enhancer', 'low-light', 'brightness', 'reveal'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_midtone_punch',
    title: '🎯 Midtone Structural Punch',
    description: 'Midtone structural punch filter emphasizing mid-range contrast and subject pop.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(145%) brightness(101%)',
    tags: ['midtone', 'structural', 'punch', 'contrast', 'mid-range', 'pop'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_editorial_clean',
    title: '📰 Editorial Clean Finish',
    description: 'Editorial clean finish providing precise professional tuning for magazine prints.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(122%) brightness(103%) saturate(98%)',
    tags: ['editorial', 'clean', 'finish', 'magazine', 'print', 'professional'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_catalog_look',
    title: '📖 Studio Catalog Standard',
    description: 'Studio catalog standard lighting and color calibration for reliable merchandise display.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(115%) brightness(105%) saturate(105%)',
    tags: ['catalog', 'standard', 'studio', 'merchandise', 'reliable', 'clean'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_magazine_cover',
    title: '🌟 Magazine Cover Grade',
    description: 'Magazine cover grade with eye-catching contrast and vibrant saturation for max impact.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'contrast(135%) brightness(102%) saturate(118%)',
    tags: ['magazine cover', 'vibrant', 'impact', 'striking', 'glossy', 'grade'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'retouch_skin_perfection',
    title: '💖 Ultimate Skin Perfection',
    description: 'Ultimate skin perfection filter combining ideal brightness, softness, and natural skin warmth.',
    category: 'Studio Retouch & Portrait',
    type: 'canvas',
    css: 'brightness(106%) contrast(93%) blur(0.35px) saturate(102%)',
    tags: ['skin', 'perfection', 'flawless', 'smooth', 'warmth', 'beauty'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  }
];

// Batch 4

const batchFourFilters = [
  {
    filterId: 'tf_edge',
    title: '🧠 TF Sobel Edge Tensor',
    description: 'TensorFlow-driven Sobel edge detection tensor filter extracting precise structural outlines and geometric boundaries.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'sobel', 'edge', 'detection', 'tensor', 'structural'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_luminance',
    title: '📐 TF Neural Luminance Matrix',
    description: 'Neural luminance matrix processing optimizing tonal distribution and luminance channels across pixel arrays.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'neural', 'luminance', 'matrix', 'tonal', 'processing'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_deepinvert',
    title: '🔬 TF Deep Channel Inversion',
    description: 'Deep channel inversion tensor network mapping unexpected color shifts and high-contrast photographic negatives.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'deep', 'inversion', 'channels', 'negative', 'contrast'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_normalize',
    title: '⚡ TF Dynamic Range Normalization',
    description: 'Dynamic range normalization tensor script automatically balancing shadow clipping and highlight blowout.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'dynamic range', 'normalization', 'exposure', 'tensor', 'balance'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_cartoon',
    title: '🎨 TF Cartoon Stylization',
    description: 'Neural cartoon stylization model simplifying complex photographic textures into clean animated cel-shading.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'cartoon', 'stylization', 'cel-shading', 'animated', 'neural'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_style',
    title: '🎨 TF Painterly Color Blocks',
    description: 'Painterly color block neural transfer separating images into expressive fine art patches.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'painterly', 'color blocks', 'neural transfer', 'art', 'expressive'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_deepdream',
    title: '🌌 TF Multi-Scale Dream Texture',
    description: 'Multi-scale deep dream neural network amplification creating recursive psychedelic textures and patterns.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'deepdream', 'multi-scale', 'psychedelic', 'recursive', 'neural'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_emboss',
    title: '🗿 TF Laplacian Emboss',
    description: 'Laplacian emboss tensor convolution bringing out rugged 3D stone-carved relief textures.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'laplacian', 'emboss', '3d', 'relief', 'convolution'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_sharpen',
    title: '🔪 TF High-Pass Sharpen Matrix',
    description: 'High-pass sharpen matrix tensor operation enhancing ultra-fine details and micro-textures.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'high-pass', 'sharpen', 'matrix', 'detail', 'micro-texture'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'tf_thermal',
    title: '🌡️ TF Thermal Heatmap',
    description: 'Thermal heatmap false-color tensor conversion translating luminance gradients into infrared temperatures.',
    category: 'TensorFlow Neural Suite',
    type: 'tensorflow',
    tags: ['tensorflow', 'thermal', 'heatmap', 'infrared', 'false-color', 'gradients'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  }
];

// Batch 5

const batchGraphiteFilters = [
  {
    filterId: 'graphite_hb_light_study',
    title: '✏️ HB Light Study',
    description: 'Delicate HB light pencil study providing clean, balanced gray midtones and precise structural shading.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'hb', 'light', 'pencil', 'study', 'clean', 'midtones'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_2b_portrait_pencil',
    title: '✏️ 2B Portrait Pencil',
    description: 'Smooth 2B portrait pencil grade optimized for soft skin gradients and expressive facial features.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', '2b', 'portrait', 'pencil', 'soft', 'skin', 'gradients'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_4b_soft_shading',
    title: '✏️ 4B Soft Shading',
    description: 'Rich 4B soft graphite shading delivering deep shadows and smooth velvety tone transitions.',
    category: 'TensorGraphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', '4b', 'soft', 'shading', 'deep shadows', 'velvety'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_6b_rich_graphite',
    title: '✏️ 6B Rich Graphite',
    description: 'Intense 6B rich graphite mark-making with dark, bold strokes and high-contrast tonal depth.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', '6b', 'rich', 'bold', 'dark', 'contrast', 'depth'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_8b_deep_graphite',
    title: '✏️ 8B Deep Graphite',
    description: 'Extremely dark 8B deep graphite effect crushing midtones into dramatic, near-black shadows.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', '8b', 'deep', 'dark', 'near-black', 'dramatic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_10b_heavy_graphite',
    title: '✏️ 10B Heavy Graphite',
    description: 'Maximum density 10B heavy graphite lead effect with compressed charcoal-like darkness and heavy texture.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', '10b', 'heavy', 'compressed', 'darkness', 'texture'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_h_fine_drafting_lead',
    title: '✏️ H Fine Drafting Lead',
    description: 'Crisp H hard drafting lead style with razor-sharp, thin construction lines and light silver tones.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'h', 'fine', 'drafting', 'lead', 'crisp', 'thin lines'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_smudged_charcoal_pencil',
    title: '✏️ Smudged Charcoal Pencil',
    description: 'Softly smudged charcoal pencil aesthetic with hazy atmospheric blending and organic finger-smear textures.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['charcoal', 'pencil', 'smudged', 'hazy', 'atmospheric', 'blending'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_cross_grain_graphite',
    title: '✏️ Cross-Grain Graphite',
    description: 'Textured cross-grain graphite pass highlighting coarse paper tooth and directional hatch patterns.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'cross-grain', 'textured', 'paper tooth', 'hatch'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_tonal_portrait_blend',
    title: '✏️ Tonal Portrait Blend',
    description: 'Smooth tonal portrait blending style emphasizing continuous gradations across facial forms.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'tonal', 'portrait', 'blend', 'smooth', 'gradations'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_expressive_broad_lead',
    title: '✏️ Expressive Broad Lead',
    description: 'Loose expressive broad lead sketch featuring dynamic flat-edge strokes and energetic gestures.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'expressive', 'broad lead', 'loose', 'energetic', 'flat-edge'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_paper_grain_study',
    title: '✏️ Paper Grain Study',
    description: 'Detailed paper grain study capturing micro-textural highlights and speckled graphite deposits.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'paper grain', 'study', 'micro-texture', 'speckled'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_hard_lead_fine_grain',
    title: '✏️ Hard Lead Fine Grain',
    description: 'Precise hard lead fine grain rendering ideal for architectural details and botanical illustrations.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'hard lead', 'fine grain', 'precise', 'botanical'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_soft_lead_shadow_pass',
    title: '✏️ Soft Lead Shadow Pass',
    description: 'Layered soft lead shadow pass deepening core shadows and projecting volumetric form.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'soft lead', 'shadow pass', 'volumetric', 'form'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_layered_graphite_hatch',
    title: '✏️ Layered Graphite Hatch',
    description: 'Multi-directional layered graphite hatching for rich architectural and academic cross-hatch shading.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'layered', 'hatch', 'cross-hatch', 'academic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_bright_paper_pencil',
    title: '✏️ Bright Paper Pencil',
    description: 'High-key bright paper pencil look with clean stark highlights and delicate silver linework.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'bright paper', 'high-key', 'highlights', 'silver'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_deep_value_graphite',
    title: '✏️ Deep Value Graphite',
    description: 'High-contrast deep value graphite rendering exploring the full spectrum from stark white to absolute dark.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'deep value', 'high contrast', 'spectrum', 'dark'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_feathered_pencil_contour',
    title: '✏️ Feathered Pencil Contour',
    description: 'Soft feathered pencil contouring with gentle overlapping sketch strokes defining edges.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'feathered', 'contour', 'soft', 'overlapping', 'edges'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_broad_shading_pencil',
    title: '✏️ Broad Shading Pencil',
    description: 'Flat broad shading pencil pass covering large background zones with consistent graphite tone.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'broad shading', 'flat', 'background', 'consistent'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_fine_grain_portrait',
    title: '✏️ Fine Grain Portrait',
    description: 'Refined fine-grain portrait sketch balancing crisp feature lines with subtle skin tones.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'fine grain', 'portrait', 'refined', 'features', 'skin'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_velvet_graphite_blend',
    title: '✏️ Velvet Graphite Blend',
    description: 'Luxurious velvet graphite blend providing seamless transitions and smudge-free elegance.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'velvet', 'blend', 'seamless', 'smooth', 'elegant'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_heavy_artist_pencil',
    title: '✏️ Heavy Artist Pencil',
    description: 'Raw heavy artist pencil texture simulating professional 19th-century sketching pads.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'heavy', 'artist', 'raw', 'vintage', 'sketchpad'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_ultra_fine_lead_pass',
    title: '✏️ Ultra-Fine Lead Pass',
    description: 'Intricate ultra-fine lead pass focusing on microscopic line precision and hyper-detailed linework.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'ultra-fine', 'lead', 'microscopic', 'precision', 'detailed'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_deep_tone_charcoal_mix',
    title: '✏️ Deep Tone Charcoal Mix',
    description: 'Hybrid deep tone graphite and charcoal mix offering unmatched shadow density.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'charcoal', 'mix', 'deep tone', 'shadow density', 'hybrid'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_stippled_lead_grain',
    title: '✏️ Stippled Lead Grain',
    description: 'Textured stippled lead grain pattern creating an organic pointillist graphite surface.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'stippled', 'lead grain', 'pointillist', 'organic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_contour_shading_pass',
    title: '✏️ Contour Shading Pass',
    description: 'Contour-following shading pass wrapping tonal values tightly around three-dimensional volumes.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'contour', 'shading pass', 'volumes', '3d'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_structured_graphite_mesh',
    title: '✏️ Structured Graphite Mesh',
    description: 'Geometric structured graphite mesh overlay giving drawings a technical, calculated blueprint edge.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'structured', 'mesh', 'geometric', 'technical'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_organic_smudge_pass',
    title: '✏️ Organic Smudge Pass',
    description: 'Natural organic smudge pass creating soft, misty transitions and dreamy focal diffusion.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'organic', 'smudge', 'misty', 'dreamy', 'soft'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_matte_graphite_pass',
    title: '✏️ Matte Graphite Pass',
    description: 'Non-reflective matte graphite finish eliminating glare for a flat, velvety pencil drawing look.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'matte', 'non-reflective', 'flat', 'velvety'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_high_density_lead',
    title: '✏️ High-Density Lead',
    description: 'High-density lead simulation packing solid, uncompromising midtone weight across the entire frame.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'high-density', 'lead', 'solid', 'midtones', 'weight'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_textured_paper_study',
    title: '✏️ Textured Paper Study',
    description: 'Heavy textured paper study accentuating the valleys and peaks of rough sketching stock.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'textured paper', 'study', 'rough stock', 'valleys'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_raw_graphite_dust',
    title: '✏️ Raw Graphite Dust',
    description: 'Atmospheric raw graphite dust effect scattering fine gray particulate shadows across highlights.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'raw dust', 'atmospheric', 'particulate', 'shadows'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_precision_shading_pass',
    title: '✏️ Precision Shading Pass',
    description: 'Clean precision shading pass engineered for immaculate academic proportion rendering.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'precision', 'shading', 'academic', 'proportion'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_subtle_tone_gradient',
    title: '✏️ Subtle Tone Gradient',
    description: 'Whisper-soft tone gradient transition for minimal, clean minimalist art compositions.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'subtle tone', 'gradient', 'minimalist', 'soft'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'graphite_master_artist_pencil',
    title: '✏️ Master Artist Pencil',
    description: 'Comprehensive master artist pencil finish combining the best elements of weight, line, and tone.',
    category: 'Tensor Graphite & Pencil',
    type: 'tensorflow',
    tags: ['graphite', 'master artist', 'pencil', 'comprehensive', 'pro'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  }
];

// Batch 6

const batchCharcoalFilters = [
  {
    filterId: 'charcoal_willow_pass',
    title: '🪵 Willow Charcoal Pass',
    description: 'Expressive willow charcoal pass with dark velvety blacks, organic smudge textures, and rich academic depth.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['charcoal', 'willow', 'dark', 'velvety', 'smudge', 'academic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_compressed_vine_ink',
    title: '🪵 Compressed Vine Ink',
    description: 'Dense compressed vine ink lines offering deep shadow concentration and dramatic contrast presence.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['charcoal', 'compressed', 'vine ink', 'dense', 'shadow', 'contrast'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_deep_shadow_block',
    title: '🪵 Deep Shadow Block',
    description: 'Heavy shadow blocking filter designed to crush mid-tones into powerful, high-contrast silhouette blocks.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['charcoal', 'deep shadow', 'block', 'silhouette', 'high contrast', 'dark'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_rich_ink_wash',
    title: '🪵 Rich Ink Wash',
    description: 'Fluid sumi ink wash simulation featuring wet bleed edges, soft dilution gradients, and organic pooling.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['ink wash', 'sumi', 'fluid', 'wet bleed', 'gradients', 'organic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_sumi_e_black_stroke',
    title: '🪵 Sumi-E Black Stroke',
    description: 'Traditional Japanese Sumi-E brush stroke rendering with expressive pressure variation and bold black ink.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['sumi-e', 'japanese', 'stroke', 'brush', 'bold ink', 'traditional'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_heavy_carbon_core',
    title: '🪵 Heavy Carbon Core',
    description: 'Intense carbon core rendering delivering impenetrable dark values and ultra-sharp core shadows.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['carbon', 'core', 'heavy', 'impenetrable', 'dark values', 'sharp shadows'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_smudged_charcoal_dust',
    title: '🪵 Smudged Charcoal Dust',
    description: 'Atmospheric charcoal dust smudging creating smoky backgrounds and hazy, dreamlike transitions.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['charcoal dust', 'smudged', 'atmospheric', 'smoky', 'hazy', 'dreamy'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_dark_monolith_pass',
    title: '🪵 Dark Monolith Pass',
    description: 'Monumental dark monolith pass creating solid, statuesque shadow masses with stark visual weight.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['monolith', 'dark', 'statuesque', 'shadow masses', 'visual weight'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_expressive_ink_splash',
    title: '🪵 Expressive Ink Splash',
    description: 'Dynamic ink splash and splatter simulation introducing chaotic artistic energy and raw contrast.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['ink splash', 'expressive', 'splatter', 'chaotic', 'artistic energy', 'raw'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_velvet_shadow_pass',
    title: '🪵 Velvet Shadow Pass',
    description: 'Luxurious velvet shadow pass softening the boundaries between darks and mid-tones with plush smoothness.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['velvet', 'shadow pass', 'luxurious', 'soft', 'smooth', 'mid-tones'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_deep_void_charcoal',
    title: '🪵 Deep Void Charcoal',
    description: 'Total blackness extraction filter pushing background zones into an infinite deep void of matte charcoal.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['deep void', 'charcoal', 'total black', 'infinite', 'matte', 'darkness'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_high_contrast_ink',
    title: '🪵 High Contrast Ink',
    description: 'Punchy high contrast ink style eliminating gray mud to leave stark black strokes against bright paper.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['high contrast', 'ink', 'stark', 'black and white', 'clean', 'graphic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_raw_vine_charcoal',
    title: '🪵 Raw Vine Charcoal',
    description: 'Unrefined raw vine charcoal effect keeping the scratchy, brittle texture of natural organic sticks.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['raw', 'vine charcoal', 'unrefined', 'scratchy', 'brittle', 'organic'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_soft_carbon_blend',
    title: '🪵 Soft Carbon Blend',
    description: 'Gentle carbon blending filter producing clean, rounded tonal volumes with minimal harsh edge artifacts.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['soft carbon', 'blend', 'gentle', 'rounded volumes', 'clean'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_aggressive_charcoal_stroke',
    title: '🪵 Aggressive Charcoal Stroke',
    description: 'Fierce, energetic charcoal application with jagged contrast shifts and raw expressionist texture.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['aggressive', 'charcoal stroke', 'fierce', 'jagged', 'expressionist', 'raw'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_gothic_ink_pass',
    title: '🪵 Gothic Ink Pass',
    description: 'Dark, brooding Gothic ink pass optimized for dramatic architectural and atmospheric mood pieces.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['gothic', 'ink pass', 'brooding', 'dark', 'architectural', 'moody'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_deep_obsidian_shade',
    title: '🪵 Deep Obsidian Shade',
    description: 'Mirror-polished obsidian dark shading providing a sleek, glass-like dark tone aesthetic.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['obsidian', 'deep shade', 'polished', 'sleek', 'dark tone', 'glass-like'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_dense_carbon_matrix',
    title: '🪵 Dense Carbon Matrix',
    description: 'Mathematically dense carbon matrix grid overlaying complex pixel structures with dark ink weight.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['dense carbon', 'matrix', 'grid', 'pixel structure', 'ink weight'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_subtle_charcoal_wash',
    title: '🪵 Subtle Charcoal Wash',
    description: 'Light grey charcoal wash providing delicate, airy shadow undertones without crushing highlights.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['subtle', 'charcoal wash', 'light grey', 'airy', 'shadow undertones'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_intense_shadow_pass',
    title: '🪵 Intense Shadow Pass',
    description: 'Punchy shadow enhancement filter driving maximum depth into the darkest regions of the frame.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['intense shadow', 'pass', 'punchy', 'maximum depth', 'darkest regions'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_textured_vine_stroke',
    title: '🪵 Textured Vine Stroke',
    description: 'Rough vine stroke texturing simulating coarse paper tooth and broken charcoal particulate lines.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['textured vine', 'stroke', 'rough', 'paper tooth', 'broken lines'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_matte_carbon_layer',
    title: '🪵 Matte Carbon Layer',
    description: 'Flat matte carbon coating that removes all glossy sheen to leave a pure, chalky black finish.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['matte carbon', 'layer', 'flat', 'no gloss', 'chalky', 'black finish'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_rich_liquid_ink',
    title: '🪵 Rich Liquid Ink',
    description: 'Glossy wet liquid ink pass mimicking freshly pooled calligraphy ink drying on parchment.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['rich liquid ink', 'glossy', 'wet', 'calligraphy', 'drying', 'parchment'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_deep_monochromatic_core',
    title: '🪵 Deep Monochromatic Core',
    description: 'Centered monochromatic dark core establishing powerful focal gravity and high contrast framing.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['monochromatic core', 'deep', 'focal gravity', 'high contrast', 'framing'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_expressive_charcoal_pass',
    title: '🪵 Expressive Charcoal Pass',
    description: 'Freehand expressive charcoal pass combining organic finger smudges with bold sweeping strokes.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['expressive charcoal', 'freehand', 'organic', 'finger smudges', 'sweeping strokes'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_heavy_shadow_gradient',
    title: '🪵 Heavy Shadow Gradient',
    description: 'Graduated heavy shadow fade transitioning smoothly from impenetrable black to soft silver tones.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['heavy shadow', 'gradient', 'fade', 'smooth transition', 'black to silver'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_dark_contoured_ink',
    title: '🪵 Dark Contoured Ink',
    description: 'Heavy ink outlining following structural contours with commanding thickness and dark density.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['dark contoured', 'ink', 'outlining', 'structural', 'thickness', 'density'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'charcoal_velvety_vine_shade',
    title: '🪵 Velvety Vine Shade',
    description: 'Soft velvety vine shade providing luxurious tactile shading for classical portraiture.',
    category: 'Tensor Charcoal & Ink',
    type: 'tensorflow',
    tags: ['velvety', 'vine shade', 'soft', 'tactile', 'classical portraiture'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  }
];

// Batch 7

export const batchContourFilters = [
  {
    filterId: 'contour_fine_contour',
    title: '🖊️ Fine Contour',
    description: 'Delicate single-pixel fine contour line tracing outlining core shapes with precision and clarity.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['contour', 'fine', 'outline', 'precision', 'lines', 'delicate'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_clean_outline',
    title: '🖊️ Clean Outline',
    description: 'Crisp clean outline extraction filter isolating clean structural borders from background textures.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['outline', 'clean', 'borders', 'structural', 'crisp', 'isolation'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_soft_edge_study',
    title: '🖊️ Soft Edge Study',
    description: 'Soft edge study filter blending fine contour lines with gentle gradient shading for a harmonious look.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['edge', 'soft', 'study', 'gradient', 'shading', 'harmonious'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_bold_gesture_lines',
    title: '🖊️ Bold Gesture Lines',
    description: 'Thick, confident gesture lines capturing dynamic movement and expressive shape flow.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['gesture', 'bold', 'lines', 'dynamic', 'movement', 'expressive'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_minimal_contours',
    title: '🖊️ Minimalist Contours',
    description: 'Minimalist contour lines stripping away all non-essential data to highlight pure silhouette geometry.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['minimal', 'contours', 'geometry', 'silhouette', 'pure', 'clean'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_double_weight_outline',
    title: '🖊️ Double-Weight Outline',
    description: 'Layered double-weight outline effect providing a dual-stroke comic book ink definition.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['double weight', 'outline', 'comic book', 'ink', 'layered', 'stroke'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_portrait_contour',
    title: '🖊️ Portrait Contour',
    description: 'Specialized portrait contour tracing accentuating facial features, eyes, and jawlines.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['portrait', 'contour', 'facial features', 'tracing', 'jawline', 'eyes'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_architectural_contour',
    title: '🖊️ Architectural Contour',
    description: 'Rigid architectural contour drawing focusing on structural perspective and straight-edge precision.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['architectural', 'contour', 'perspective', 'precision', 'straight-edge'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_high_contrast_ink',
    title: '🖊️ High-Contrast Ink Contour',
    description: 'High-contrast ink contour rendering with solid black lines against stark white backgrounds.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['high-contrast', 'ink', 'contour', 'solid black', 'white background'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_loose_gesture_study',
    title: '🖊️ Loose Gesture Study',
    description: 'Loosely sketched contour lines with organic variation and playful hand-drawn imperfections.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['loose', 'gesture study', 'hand-drawn', 'organic', 'playful'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_whisper_thin_outline',
    title: '🖊️ Whisper Thin Outline',
    description: 'Extremely delicate whisper-thin outline tracing for subtle, ethereal illustration styles.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['whisper thin', 'outline', 'delicate', 'ethereal', 'subtle', 'illustration'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_confident_brush_contour',
    title: '🖊️ Confident Brush Contour',
    description: 'Variable-width ink brush contour simulating fluid calligraphic hand control.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['brush contour', 'variable-width', 'ink brush', 'calligraphic', 'fluid'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_broken_edge_drawing',
    title: '🖊️ Broken Edge Drawing',
    description: 'Textured broken edge contour lines simulating dashed and interrupted sketching strokes.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['broken edge', 'drawing', 'dashed', 'interrupted', 'textured strokes'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_continuous_line_study',
    title: '🖊️ Continuous Line Study',
    description: 'Unbroken continuous line contour rendering capturing form in a single sweeping path aesthetic.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['continuous line', 'study', 'unbroken', 'single path', 'form'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_soft_portrait_edges',
    title: '🖊️ Soft Portrait Edges',
    description: 'Gentle contour pass with blurred thresholding for soft portrait separation.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['soft portrait', 'edges', 'blurred threshold', 'separation', 'gentle'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_graphic_black_contour',
    title: '🖊️ Graphic Black Contour',
    description: 'Posterized graphic black contour lines optimized for pop art and modern illustration.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['graphic black', 'contour', 'posterized', 'pop art', 'modern illustration'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_expressive_face_lines',
    title: '🖊️ Expressive Face Lines',
    description: 'Dynamic contour lines focusing on facial structure and emotional expression topography.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['expressive face', 'lines', 'facial structure', 'emotion', 'topography'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_light_gesture_pass',
    title: '🖊️ Light Gesture Pass',
    description: 'Faint light gesture tracing providing foundational line art without visual clutter.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['light gesture', 'pass', 'faint', 'foundational', 'line art', 'clean'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_heavy_silhouette_ink',
    title: '🖊️ Heavy Silhouette Ink',
    description: 'Bold, thick outer silhouette contour wrapping around subjects with commanding weight.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['heavy silhouette', 'ink', 'bold', 'outer contour', 'commanding weight'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'contour_contour_detail_pass',
    title: '🖊️ Contour Detail Pass',
    description: 'Comprehensive contour detail pass capturing both outer margins and internal texture lines.',
    category: 'Tensor Contour & Line',
    type: 'tensorflow',
    tags: ['contour detail', 'pass', 'margins', 'internal texture', 'comprehensive'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  }
];

// Batch 8

export const batchHatchingFilters = [
  {
    filterId: 'hatch_single_diagonal',
    title: '✒️ Single Diagonal Hatch',
    description: 'Clean parallel diagonal hatching lines providing uniform tonal value and classic etching shade.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['hatch', 'diagonal', 'parallel', 'tonal value', 'etching', 'lines'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_fine_crosshatch',
    title: '✒️ Fine Crosshatch',
    description: 'Intricate fine crosshatching intersecting at acute angles to build rich, dense shadow depths.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['crosshatch', 'fine', 'intersecting', 'shadow depths', 'dense', 'ink'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_dense_crosshatch',
    title: '✒️ Dense Crosshatch',
    description: 'Heavy multi-layered crosshatching compressing mid-tones into dark, velvety shadow fields.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['crosshatch', 'dense', 'heavy', 'multi-layered', 'shadow fields', 'dark'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_loose_parallel',
    title: '✒️ Loose Parallel Hatch',
    description: 'Relaxed, spaced-out parallel hatch strokes giving an airy, hand-drawn illustrative feel.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['parallel hatch', 'loose', 'spaced', 'airy', 'hand-drawn', 'illustrative'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_four_way_ink',
    title: '✒️ Four-Way Ink Hatch',
    description: 'Complex four-way directional ink hatching for complete academic form modeling and contour shading.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['four-way', 'hatch', 'directional', 'academic', 'form modeling', 'contour'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_shadow_hatch',
    title: '✒️ Shadow Hatch',
    description: 'Targeted shadow hatching algorithm focusing exclusively on low-light regions to maximize depth.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['shadow hatch', 'targeted', 'low-light', 'depth', 'contrast'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_etching_hatch',
    title: '✒️ Etching Hatch',
    description: 'Copperplate-style etching hatch simulation with sharp, precision-grooved line patterns.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['etching hatch', 'copperplate', 'sharp', 'precision', 'line patterns'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_fine_nib',
    title: '✒️ Fine Nib Hatching',
    description: 'Ultra-fine nib pen hatching capturing microscopic textures and delicate skin gradations.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['fine nib', 'hatching', 'ultra-fine', 'microscopic', 'textures', 'delicate'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_bold_nib',
    title: '✒️ Bold Nib Hatching',
    description: 'Thick bold nib hatch marks delivering graphic impact and high-contrast comic book shadow style.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['bold nib', 'hatching', 'thick', 'graphic impact', 'comic book', 'shadow'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_illustration_crosshatch',
    title: '✒️ Illustration Crosshatch',
    description: 'Classic book illustration crosshatching providing balanced editorial tone and visual clarity.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['illustration', 'crosshatch', 'classic', 'book style', 'editorial', 'tone'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_wide_spaced',
    title: '✒️ Wide-Spaced Hatch',
    description: 'Wide-spaced line hatching for open, minimalist graphic art with plenty of breathing room.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['wide-spaced', 'hatch', 'open', 'minimalist', 'graphic art', 'clean'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_tight_shadow',
    title: '✒️ Tight Shadow Crosshatch',
    description: 'Extremely tight high-density crosshatching built for pitch-black shadow zones.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['tight shadow', 'crosshatch', 'high-density', 'pitch-black', 'shadow zones'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_light_pencil',
    title: '✒️ Light Pencil Hatch',
    description: 'Soft pencil hatching pass offering gentle, low-contrast tonal separation.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['light pencil', 'hatch', 'soft', 'low-contrast', 'tonal separation'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_heavy_ink',
    title: '✒️ Heavy Ink Hatch',
    description: 'Heavy ink hatch pass using saturated dark lines for intense dramatic contrast.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['heavy ink', 'hatch', 'saturated', 'dark lines', 'dramatic contrast'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_portrait_form',
    title: '✒️ Portrait Form Hatching',
    description: 'Anatomically aligned crosshatch shading wrapping smoothly around facial contours.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['portrait form', 'hatching', 'anatomical', 'facial contours', 'wrapping'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_angled_shade',
    title: '✒️ Angled Shade Lines',
    description: 'Dynamic angled shade lines creating directional momentum and stylistic perspective.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['angled shade', 'lines', 'dynamic', 'directional', 'momentum', 'perspective'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_layered_nib',
    title: '✒️️ Layered Nib Crosshatch',
    description: 'Multi-tiered nib crosshatching building sophisticated depth and textural complexity.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['layered nib', 'crosshatch', 'multi-tiered', 'sophisticated depth', 'textural'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_soft_parallel',
    title: '✒️ Soft Parallel Shading',
    description: 'Blurred soft parallel shading lines for hazy, atmospheric background transitions.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['soft parallel', 'shading', 'blurred', 'hazy', 'atmospheric', 'background'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_deep_black_crosshatch',
    title: '✒️ Deep Black Crosshatch',
    description: 'Deep black high-density crosshatching crushing highlights into maximum shadow drama.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['deep black', 'crosshatch', 'high-density', 'shadow drama', 'crushed highlights'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'hatch_open_line',
    title: '✒️ Open Line Hatching',
    description: 'Spacious open line hatching style allowing white paper luminosity to shine through.',
    category: 'Tensor Pen Hatching',
    type: 'tensorflow',
    tags: ['open line', 'hatching', 'spacious', 'white paper', 'luminosity', 'clean'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  }
];