const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, 'tmp')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

require('./app/controllers/index')(app);

app.listen(3000);
