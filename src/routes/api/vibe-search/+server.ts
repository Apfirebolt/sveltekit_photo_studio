import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb} from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { userVibe } = await request.json();
    if (!userVibe) return json({ error: 'Vibe text is required' }, { status: 400 });

    const userEmbedding = await generateServerEmbedding(userVibe);

    const db = await getDb();
    // Fetch all filters including their embeddings
    const filters = await db.collection('filters').find({}).toArray();

    if (filters.length === 0) {
      return json({ filterId: 'normal' });
    }

    // Compute cosine similarity in-memory (works anywhere, no Atlas required!)
    let bestMatch = filters[0];
    let highestScore = -1;

    for (const filter of filters) {
      if (!filter.embedding) continue;
      const score = cosineSimilarity(userEmbedding, filter.embedding);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = filter;
      }
    }

    return json({ 
      filterId: bestMatch.filterId, 
      type: bestMatch.type,
      css: bestMatch.css,
      score: highestScore 
    });

  } catch (err) {
    console.error('Vibe search error:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

// Standard math helper for vector dot product
function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function generateServerEmbedding(text: string): Promise<number[]> {
  return Array.from({ length: 384 }, () => 0.1);
}