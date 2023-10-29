const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { authenticate } = require('./middleware/auth');

const app = express();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API Swagger',
            version: '0.1.0',
            description: 'Simple CRUD',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./router/*.js'],
};

const specs = swaggerJsdoc(options);
const port = 3000;

const usersRouter = require('./router/users');
const moviesRouter = require('./router/movies');

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', usersRouter);
app.use('/movies', authenticate);
app.use('/movies', moviesRouter); 

app.listen(port, () => {
    console.log(`Running In Port ${port}`);
});
