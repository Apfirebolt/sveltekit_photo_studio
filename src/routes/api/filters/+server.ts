import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';

export const GET: RequestHandler = async () => {
  try {
    const db = await getDb();
    const collection = db.collection('filters');

    const filters = await collection.find({}).toArray();

    return json({ 
      success: true, 
      count: filters.length, 
      filters 
    });
  } catch (err) {
    console.error('Failed to fetch filters:', err);
    return json({ 
      success: false, 
      error: 'Failed to retrieve filters from database' 
    }, { status: 500 });
  }
};