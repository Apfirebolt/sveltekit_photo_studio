import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'Softgenie Studio & Pro Photo Suite API',
      version: '1.1.0',
      description: 'API documentation for the browser-based Photo/Art Studio web application, supporting MongoDB filters and vector vibe matching.'
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment'
      }
    ],
    tags: [
      { name: 'Filters', description: 'Operations related to studio filters and styles' },
      { name: 'AI Search', description: 'Semantic vector search endpoints' }
    ],
    paths: {
      '/api/filters': {
        get: {
          summary: 'Retrieve all filters',
          description: 'Fetches all registered canvas and TensorFlow filters from the MongoDB database (excluding heavy embedding vectors).',
          tags: ['Filters'],
          responses: {
            '200': {
              description: 'List of filters fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      count: { type: 'integer', example: 52 },
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
          summary: 'Semantic Vibe Filter Search',
          description: 'Accepts a user vibe string and returns the closest matching filter using vector similarity search.',
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
                      example: 'moody cyberpunk rainy night with neon pink glow'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Best matching filter found successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      filterId: { type: 'string', example: 'cine_cyberpunk_neon' },
                      type: 'string',
                      enum: ['canvas', 'tensorflow'],
                      example: 'canvas'
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
            _id: { type: 'string', example: '6a836d58b3b5c50cb91ac1b6' },
            filterId: { type: 'string', example: 'cine_cyberpunk_neon' },
            title: { type: 'string', example: '⚡ Cyberpunk Neon District' },
            description: { type: 'string', example: 'High contrast, hyper-saturated hot pink and electric blue tones.' },
            category: { type: 'string', example: 'Cinematic & Film Grades' },
            type: { type: 'string', enum: ['canvas', 'tensorflow'], example: 'canvas' },
            css: { type: 'string', example: 'saturate(300%) contrast(150%) hue-rotate(290deg)' },
            tags: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['cyberpunk', 'neon', 'dark'] 
            },
            createdAt: { type: 'string', format: 'date-time', example: '2026-04-04T20:21:44.496Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-04-04T20:21:44.496Z' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Valid vibe text is required' }
          }
        }
      }
    }
  };

  return json(spec);
};