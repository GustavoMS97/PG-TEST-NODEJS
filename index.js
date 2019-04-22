const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const swaggerUi = require('swagger-ui-express');
//const YAML = require('yamljs');
const swaggerDocument = require('./config/swagger');
//const swaggerDocument = YAML.load('./config/swagger.yaml');
//Configures express middlewares.
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, 'tmp')));
require('./app/controllers/index')(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(3000);
