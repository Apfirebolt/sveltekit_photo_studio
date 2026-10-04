import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { pipeline } from '@xenova/transformers';

// Cache singleton pipeline instance across requests
let extractorPromise: Promise<any> | null = null;
async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractorPromise;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return json({ error: 'Prompt is required' }, { status: 400 });
    }

    const extractor = await getExtractor();
    const output = await extractor(prompt, { pooling: 'mean', normalize: true });
    const queryEmbedding = Array.from(output.data);

    const db = await getDb();
    const filters = await db.collection('filters').find({}).toArray();

    let scoredResults = filters.map(filter => ({
      filterId: filter.filterId,
      title: filter.title,
      type: filter.type,
      css: filter.css,
      score: filter.embedding ? cosineSimilarity(queryEmbedding, filter.embedding) : 0
    }));

    // Sort descending by highest similarity score
    scoredResults.sort((a, b) => b.score - a.score);

    if (scoredResults.length === 0) {
      return json({ error: 'No filters available' }, { status: 404 });
    }

    // Return top match and a list of alternative matches for the modal UI
    return json({
      filterId: scoredResults[0].filterId,
      type: scoredResults[0].type,
      score: scoredResults[0].score,
      results: scoredResults.slice(0, 5) // Top 5 options for user selection
    });

  } catch (err) {
    console.error('Vibe search error:', err);
    return json({ error: 'Internal server error during semantic match' }, { status: 500 });
  }
};