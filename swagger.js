const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Seriously Match',
      version: '1.0.0',
      description: 'API documentation for your Seriously Match application',
    },
    servers: [
      {
        // url: 'https://seriouslymatchapi.onrender.com',
        url:'http://127.0.0.1:8081'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routers/*.js'], // Path to the API route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
