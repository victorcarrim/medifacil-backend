const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Documentation for your application'
        },
        servers: [
            {
                url: `${process.env.PORT}`, // Change this to the URL of your application
            },
        ],
    },
    apis: ['./routes/*.js', './controller/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};
