/**
 * Module dependencies.
 */

const swaggerJSDoc = require('swagger-jsdoc');

const config = require('../config');
const pName = require(process.env.PWD + '/package.json');

var swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: `${pName.name} API`,
    version: pName.version
  },
  schemes: [],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ResponseModel: {
        type: 'object',
        properties: {
          status: {
            type: 'string'
          },
          code: {
            type: 'integer'
          },
          message: {
            type: 'string'
          },
          result: {
            type: 'object'
          }
        }
      },
      UnauthorizedModel: {
        type: 'object',
        properties: {
          status: {
            type: 'string'
          },
          code: {
            type: 'integer'
          },
          message: {
            type: 'string'
          }
        }
      },
      ErrorModel: {
        type: 'object',
        properties: {
          status: {
            type: 'string'
          },
          code: {
            type: 'integer'
          },
          message: {
            type: 'string'
          },
          error: {
            properties: {
              name: {
                type: 'string'
              },
              message: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Processed Successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResponseModel'
            }
          }
        }
      },
      201: {
        description: 'Created/Modified Successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResponseModel'
            }
          }
        }
      },
      400: {
        description: 'Incomplete/Bad Request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorModel'
            }
          }
        }
      },
      401: {
        description: 'Unauthorized Request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UnauthorizedModel'
            }
          }
        }
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorModel'
            }
          }
        }
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: [`./routes/${config.api.version}/*.js`]
};

// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);
