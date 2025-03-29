require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
app.use(express.json());
const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Cibus",
        version: "1.0.0",
        description: "A Cibus API documented with Swagger",
      },
      servers: [
        {
          url: "http://localhost:80",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          Message: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              userId: { type: "integer", example: 123 },
              message: { type: "string", example: "Hello, world!" },
              vote: { type: "integer", example: 1 },
            },
          },
          User: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              userName: { type: "string", example: "Admin" },
              password: { type: "string", example: "Admin12345" },
            },
          }   
        },
       
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./controllers/*.js", "./routes/*.js"],
  };
  
  
  const swaggerSpecs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Import controllers
const loginController = require('./controllers/loginController');
const logoutController = require('./controllers/logoutController');
const messagesController = require('./controllers/messagesController');
const registerController = require('./controllers/registerController');
const userController = require('./controllers/userController');

// Set up routes
app.use('/login', loginController);
app.use('/logout', logoutController);
app.use('/messages', messagesController);
app.use('/register', registerController);
app.use('/user', userController);

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));