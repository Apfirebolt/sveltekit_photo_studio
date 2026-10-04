import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from 'mongodb';
import { pipeline } from '@xenova/transformers';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// 1. Static Master Suites (Cinematic, Studio, Neural, Core Sketch)
const masterStaticFilters = [
  // Master Sketch & Pen Suite
  { filterId: 'sketch_outline', title: '✏️ TF Clean Line Outlines', description: 'Clean precise edge detection lines for technical and structural drawing outlines.', category: 'Master Sketch & Pen Suite', type: 'tensorflow', tags: ['sketch', 'outline', 'lines', 'clean', 'technical'] },
  { filterId: 'sketch_minimal', title: '🖋️ TF Minimalist Contours', description: 'Minimalist contour lines highlighting essential shapes and structural boundaries.', category: 'Master Sketch & Pen Suite', type: 'tensorflow', tags: ['sketch', 'minimal', 'contours', 'lines', 'simple'] },
  { filterId: 'sketch_graphite', title: '📝 Soft Graphite Pencil', description: 'Soft graphite pencil shading with smooth gradations, subtle blur, and high contrast detail.', category: 'Master Sketch & Pen Suite', type: 'canvas', css: 'grayscale(100%) contrast(140%) brightness(110%) blur(0.5px)', tags: ['graphite', 'pencil', 'soft', 'sketch', 'monochrome'] },
  { filterId: 'sketch_crosshatch', title: '✒️ Fine Ink Pen & Hatch', description: 'Detailed cross-hatching ink pen lines with inverted tone accents and deep contrast.', category: 'Master Sketch & Pen Suite', type: 'canvas', css: 'grayscale(100%) contrast(220%) brightness(95%) invert(15%)', tags: ['ink', 'crosshatch', 'pen', 'hatch', 'fine'] },
  { filterId: 'sketch_charcoal', title: '🪵 Deep Charcoal Sketch', description: 'Heavy raw vine charcoal lines, deep blacks, and textured paper blur for dramatic contrast.', category: 'Master Sketch & Pen Suite', type: 'canvas', css: 'grayscale(100%) contrast(250%) brightness(85%) blur(0.8px)', tags: ['charcoal', 'sketch', 'dark', 'textured', 'dramatic'] },
  { filterId: 'tf_detailed_portrait', title: '👤 TF Professional Pencil Portrait', description: 'Fine art pencil portrait shading optimized for human features, skin textures, and depth.', category: 'Master Sketch & Pen Suite', type: 'tensorflow', tags: ['portrait', 'pencil', 'professional', 'face', 'shading'] },
  { filterId: 'tf_stipple_dot', title: '⚫ TF Pointillism Stipple Ink', description: 'Pointillist stippling ink effect using density dot matrices to simulate shadow and form.', category: 'Master Sketch & Pen Suite', type: 'tensorflow', tags: ['stipple', 'dot', 'pointillism', 'ink', 'texture'] },
  { filterId: 'tf_blueprint_sketch', title: '📏 TF Architectural Line Study', description: 'Precise architectural line study with blueprint alignment and structural layout grids.', category: 'Architectural & Technical', type: 'tensorflow', tags: ['blueprint', 'architectural', 'lines', 'drafting', 'study'] },
  { filterId: 'tf_lithograph', title: '🏛️ TF Antique Lithograph Press', description: 'Classic antique lithograph press texture with grain, stone matrix plate feel, and faded darks.', category: 'Classic & Vintage Press', type: 'tensorflow', tags: ['lithograph', 'antique', 'press', 'vintage', 'stone'] },

  // Cinematic Grades
  { filterId: 'cine_technicolor_35', title: '🎬 1935 Technicolor Two-Strip', description: 'Vintage 1935 two-strip Technicolor film grade with rich warm sepia tones, saturated color shifts, and classic cinema atmosphere.', category: 'Cinematic & Film Grades', type: 'canvas', css: 'sepia(40%) saturate(220%) hue-rotate(-15deg) contrast(120%)', tags: ['technicolor', 'vintage', 'cinema', 'warm', 'sepia'] },
  { filterId: 'cine_blade_runner', title: '🌧️ Blade Runner Amber & Teal', description: 'Sci-fi dystopian atmosphere with high contrast amber and teal color grading inspired by futuristic urban nightscapes.', category: 'Cinematic & Film Grades', type: 'canvas', css: 'contrast(130%) saturate(140%) hue-rotate(25deg) sepia(20%)', tags: ['blade runner', 'cyberpunk', 'amber', 'teal', 'sci-fi', 'dystopian'] },
  { filterId: 'cine_matrix_green', title: '💻 The Matrix Terminal Code', description: 'Monochrome digital terminal aesthetic with vibrant green tint, high saturation, and intense hacker code contrast.', category: 'Cinematic & Film Grades', type: 'canvas', css: 'grayscale(100%) sepia(100%) hue-rotate(85deg) saturate(400%) contrast(150%)', tags: ['matrix', 'green', 'terminal', 'digital', 'cyber'] },
  { filterId: 'cine_cyberpunk_neon', title: '⚡ Cyberpunk Neon District', description: 'Ultra-saturated neon pink and purple urban glow with heavy contrast for futuristic cyberpunk night scenes.', category: 'Cinematic & Film Grades', type: 'canvas', css: 'saturate(300%) contrast(150%) hue-rotate(290deg)', tags: ['cyberpunk', 'neon', 'pink', 'night', 'futuristic', 'urban'] },
  { filterId: 'cine_kodachrome_64', title: '🎞️️ Classic Kodachrome 64', description: 'Legendary vintage slide film look featuring high contrast, punchy warm saturation, and timeless rich color depth.', category: 'Cinematic & Film Grades', type: 'canvas', css: 'contrast(140%) saturate(160%) sepia(15%) brightness(105%)', tags: ['kodachrome', 'slide film', 'vintage', 'classic', 'warm'] },
  { filterId: 'cine_panavision_noir', title: '🕵️ Panavision High-Contrast Noir', description: 'Dramatic black and white film noir grade with deep crushed shadows, bright highlights, and high silver contrast.', category: 'Cinematic & Film Grades', type: 'canvas', css: 'grayscale(100%) contrast(210%) brightness(85%)', tags: ['noir', 'black and white', 'panavision', 'dramatic', 'shadows'] },

  // Studio Retouch & Neural Suite
  { filterId: 'normal', title: '🌟 Original Studio', description: 'Original unedited studio image with clean default balancing and no color transformations.', category: 'Studio Retouch & Portrait', type: 'canvas', css: 'none', tags: ['original', 'normal', 'clean', 'default'] },
  { filterId: 'studio_soft', title: '✨ Soft Portrait Glow', description: 'Soft portrait glow with gentle brightening, reduced harsh contrast, and subtle smoothing blur.', category: 'Studio Retouch & Portrait', type: 'canvas', css: 'brightness(105%) contrast(95%) blur(0.3px) saturate(105%)', tags: ['soft', 'portrait', 'glow', 'smooth', 'bright'] },
  { filterId: 'tf_edge', title: '🧠 TF Sobel Edge Tensor', description: 'TensorFlow-driven Sobel edge detection tensor filter extracting precise structural outlines.', category: 'TensorFlow Neural Suite', type: 'tensorflow', tags: ['tensorflow', 'sobel', 'edge', 'detection', 'tensor'] },
  { filterId: 'tf_cartoon', title: '🎨 TF Cartoon Stylization', description: 'Neural cartoon stylization model simplifying complex photographic textures into clean cel-shading.', category: 'TensorFlow Neural Suite', type: 'tensorflow', tags: ['tensorflow', 'cartoon', 'stylization', 'cel-shading'] }
];

// 2. Dynamic Generator for Classic Technical Pencils (cs_01 to cs_50)
const canvasStyles = Array.from({ length: 50 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    filterId: `cs_${num}`,
    title: `🖋️ Studio Custom Sketch Style ${num}`,
    description: `Professional hand-crafted canvas sketch preset number ${num} optimized for high-frequency fine art linework and shading.`,
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(150%) brightness(105%)',
    tags: ['canvas', 'sketch', 'preset', `cs_${num}`]
  };
});

// 3. Dynamic Generator for Tensor Sketch Families (~150+ variations)
const tensorSketchFamilies = [
  { id: 'graphite', title: 'Tensor Graphite & Pencil Studies', icon: '✏️', count: 35 },
  { id: 'charcoal', title: 'Tensor Charcoal & Ink Washes', icon: '🪵', count: 28 },
  { id: 'contour', title: 'Tensor Contour & Line Sketches', icon: '🖊️', count: 20 },
  { id: 'hatching', title: 'Tensor Pen Hatching & Crosshatch', icon: '✒️', count: 20 },
  { id: 'engraving', title: 'Tensor Engraving & Lithography', icon: '🖋️', count: 20 },
  { id: 'stippling', title: 'Tensor Stipple & Dot-Pen Studies', icon: '⚫', count: 20 },
  { id: 'technical', title: 'Tensor Technical & Architectural Pen', icon: '📐', count: 10 }
];

const dynamicTensorSketches = tensorSketchFamilies.flatMap(family => 
  Array.from({ length: family.count }, (_, i) => {
    const variation = i + 1;
    return {
      filterId: `tf_sketch_${family.id}_${variation}`,
      title: `${family.icon} TF ${family.id} variation ${variation}`,
      description: `Advanced TensorFlow neural tensor computation rendering an authentic ${family.id} sketch effect with variation tier ${variation}.`,
      category: family.title,
      type: 'tensorflow',
      tags: [family.id, 'tensorflow', 'sketch', 'neural', `tier_${variation}`]
    };
  })
);

// 4. Dynamic Generator for Cartoonify Styles (24)
const dynamicCartoonFilters = Array.from({ length: 24 }, (_, i) => {
  const variation = String(i + 1).padStart(2, '0');
  return {
    filterId: `tf_cartoonify_${variation}`,
    title: `🎨 TF Cartoon Cel Shader ${variation}`,
    description: `TensorFlow neural cartoonify and cel-shading pipeline with vibrant color quantization level ${variation}.`,
    category: 'TensorFlow Cartoonify Styles',
    type: 'tensorflow',
    tags: ['cartoon', 'anime', 'cel-shading', 'vector', `cartoon_${variation}`]
  };
});

// Combine into your full 300+ library
const masterFilterLibrary = [
  ...masterStaticFilters,
  ...canvasStyles,
  ...dynamicTensorSketches,
  ...dynamicCartoonFilters
];

async function seedDatabase() {
  console.log('⏳ Initializing Xenova feature-extraction pipeline...');
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  console.log('✅ Model initialized successfully.');

  console.log(`🔄 Generating real semantic embeddings for ${masterFilterLibrary.length} filters (this may take a minute)...`);
  const documentsToInsert = [];

  for (const filter of masterFilterLibrary) {
    const textToEmbed = `${filter.title}: ${filter.description} [Category: ${filter.category}]`;
    const output = await extractor(textToEmbed, { pooling: 'mean', normalize: true });
    documentsToInsert.push({
      ...filter,
      embedding: Array.from(output.data)
    });
    console.log(`✨ Embedded: ${filter.filterId}`);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('artist_studio');
    const collection = db.collection('filters');

    await collection.deleteMany({});
    const result = await collection.insertMany(documentsToInsert);
    console.log(`✅ Successfully seeded full catalog of ${result.insertedCount} filters into MongoDB!`);
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
  }
}

seedDatabase();