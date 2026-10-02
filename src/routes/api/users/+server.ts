import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';

export const GET: RequestHandler = async () => {
  try {
    const db = await getDb();
    
    // Fetch users, optionally excluding sensitive fields like passwords
    const users = await db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();

    // Map `_id` to string for clean JSON serialization
    const sanitizedUsers = users.map((user) => ({
      ...user,
      _id: user._id.toString()
    }));

    return json({
      success: true,
      data: sanitizedUsers
    });
  } catch (error) {
    console.error('Failed to fetch users from MongoDB:', error);
    return json(
      {
        success: false,
        error: 'Failed to retrieve users'
      },
      { status: 500 }
    );
  }
};