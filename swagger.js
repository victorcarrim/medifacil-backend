const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'MediFácil',
        description: 'Description',
    },
    host: 'localhost:5000', // Change to your host
    schemes: ['http'], // Change to your scheme (http or https)
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/medicine.routes.js', './routes/api.routes.js', './routes/auth.routes.js', './routes/user.routes.js']; // Change to your route files

swaggerAutogen(outputFile, endpointsFiles, doc);