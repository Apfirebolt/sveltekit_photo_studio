import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI in environment variables.");
  process.exit(1);
}

const sampleFilters = [
  {
    filterId: 'cine_cyberpunk_neon',
    title: '⚡ Cyberpunk Neon District',
    description: 'High contrast, hyper-saturated hot pink and electric blue tones with dark moody shadows, sci-fi night atmosphere.',
    category: 'Cinematic & Film Grades',
    type: 'canvas',
    css: 'saturate(300%) contrast(150%) hue-rotate(290deg)',
    tags: ['cyberpunk', 'neon', 'dark', 'night', 'pink', 'blue'],
    // Mock 384-dimensional embedding vector (Replace with real model output in production)
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  },
  {
    filterId: 'sketch_charcoal',
    title: '🪵 Deep Charcoal Sketch',
    description: 'Heavy raw vine charcoal lines, deep blacks, high contrast textured paper sketch for dramatic portraits.',
    category: 'Master Sketch & Pen Suite',
    type: 'canvas',
    css: 'grayscale(100%) contrast(250%) brightness(85%) blur(0.8px)',
    tags: ['charcoal', 'sketch', 'pencil', 'dark', 'monochrome'],
    embedding: Array.from({ length: 384 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4)))
  }
];

async function seedDatabase() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('artist_studio');
    const collection = db.collection('filters');

    await collection.deleteMany({});
    const result = await collection.insertMany(sampleFilters);
    
    console.log(`Successfully seeded ${result.insertedCount} filters into MongoDB.`);
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await client.close();
  }
}

async function deleteFilters() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('artist_studio');
    const collection = db.collection('filters');

    const result = await collection.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} filters from MongoDB.`);
  } catch (err) {
    console.error("Deletion error:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();