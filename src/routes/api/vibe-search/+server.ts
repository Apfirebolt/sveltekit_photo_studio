import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { userVibe } = await request.json();

    if (!userVibe || typeof userVibe !== 'string') {
      return json({ error: 'Valid vibe text is required' }, { status: 400 });
    }

    // 1. Convert user text string to vector embedding 
    // (Hook up your server-side embedding generator or model pipeline here)
    const userEmbedding = await generateServerEmbedding(userVibe);

    const db = await getDb();
    const collection = db.collection('filters');

    // 2. Query MongoDB Atlas Vector Search
    const results = await collection.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: userEmbedding,
          numCandidates: 20,
          limit: 1
        }
      },
      {
        $project: {
          filterId: 1,
          title: 1,
          type: 1,
          css: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]).toArray();

    if (results.length === 0) {
      return json({ filterId: 'normal', type: 'canvas' });
    }

    return json({ 
      filterId: results[0].filterId, 
      type: results[0].type,
      css: results[0].css,
      score: results[0].score 
    });

  } catch (err) {
    console.error('Vibe search error:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

async function generateServerEmbedding(text: string): Promise<number[]> {
  // Placeholder: Return a 384-float array matching your model dimensions.
  // In production, integrate your embedding generator function here.
  return Array.from({ length: 384 }, () => 0.1);
}