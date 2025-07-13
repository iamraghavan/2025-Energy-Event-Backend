const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Energy 2025 Sports Meet API',
      version: '1.0.0',
      description: 'Versioned REST API for Schools, Sports, Auth, Matches, with API Key Auth'
    },
    servers: [
      {
        url: 'http://localhost:8000/api/v1'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      }
    },
    security: [{ ApiKeyAuth: [] }]
  },
  apis: ['./docs/*.yaml'] // ✅ YAML files in a separate /docs folder
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
