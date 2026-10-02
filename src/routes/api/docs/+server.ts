import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'SvelteKit Movies API',
      version: '1.0.0',
      description: 'API documentation for the SvelteKit Movies Application'
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment'
      }
    ],
    paths: {
      '/api/users': {
        get: {
          summary: 'Retrieve all users',
          description: 'Fetches all registered users from the MongoDB database, excluding password hashes.',
          tags: ['Users'],
          responses: {
            '200': {
              description: 'List of users fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/User'
                        }
                      }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: { type: 'string', example: 'Failed to retrieve users' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6a836d58b3b5c50cb91ac1b6' },
            username: { type: 'string', example: 'Fernando' },
            email: { type: 'string', format: 'email', example: 'fernando.torres@example.com' },
            isAdmin: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time', example: '2026-08-17T20:21:44.496Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-08-17T20:21:44.496Z' },
            __v: { type: 'integer', example: 0 }
          }
        }
      }
    }
  };

  return json(spec);
};