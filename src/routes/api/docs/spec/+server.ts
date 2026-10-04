import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'SvelteKit Photo Studio & Vibe API',
      version: '1.0.0',
      description: 'API documentation for the browser-based Photo/Art Studio application, managing canvas/tensor filters and MongoDB vector vibe searches.'
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment'
      }
    ],
    tags: [
      { name: 'Filters', description: 'Operations related to 300+ studio filters' },
      { name: 'AI Search', description: 'Semantic vector search endpoints' }
    ],
    paths: {
      '/api/filters': {
        get: {
          summary: 'Retrieve all filters',
          description: 'Fetches all registered filters from the MongoDB database, excluding heavy embedding arrays.',
          tags: ['Filters'],
          responses: {
            '200': {
              description: 'List of filters fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { 
                        type: 'boolean', 
                        example: true 
                      },
                      count: {
                        type: 'integer',
                        example: 300
                      },
                      filters: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Filter'
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
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/api/vibe-search': {
        post: {
          summary: 'Semantic Vibe Filtering',
          description: 'Accepts a user vibe string, processes vector embeddings, and performs a MongoDB Atlas Vector Search to return the best-matching filter.',
          tags: ['AI Search'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['userVibe'],
                  properties: {
                    userVibe: {
                      type: 'string',
                      example: 'moody cyberpunk rainy night with neon glow'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Best matching filter retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      filterId: { type: 'string', example: 'cine_cyberpunk_neon' },
                      type: { type: 'string', example: 'canvas' },
                      css: { type: 'string', example: 'saturate(300%) contrast(150%)' },
                      score: { type: 'number', example: 0.9234 }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Bad request (missing or invalid vibe text)',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
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
        Filter: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string', 
              example: '6a836d58b3b5c50cb91ac1b6' 
            },
            filterId: { 
              type: 'string', 
              example: 'cine_cyberpunk_neon' 
            },
            title: { 
              type: 'string', 
              example: '⚡ Cyberpunk Neon District' 
            },
            description: { 
              type: 'string', 
              example: 'High contrast, hot pink and electric blue tones.' 
            },
            category: {
              type: 'string',
              example: 'Cinematic & Film Grades'
            },
            type: { 
              type: 'string', 
              enum: ['canvas', 'tensorflow'],
              example: 'canvas' 
            },
            css: {
              type: 'string',
              example: 'saturate(300%) contrast(150%)'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['cyberpunk', 'neon', 'dark']
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time', 
              example: '2026-08-17T20:21:44.496Z' 
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time', 
              example: '2026-08-17T20:21:44.496Z' 
            },
            __v: { 
              type: 'integer', 
              example: 0 
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean', 
              example: false 
            },
            error: { 
              type: 'string', 
              example: 'Valid vibe text is required' 
            }
          }
        }
      }
    }
  };

  return json(spec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
};