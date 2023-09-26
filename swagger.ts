import swaggerJsdoc from 'swagger-jsdoc';
import myRouter from "./src/router/router";
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
    },
  },
  apis: ['./src/router/*.ts'],
};

export default swaggerJsdoc(options);
