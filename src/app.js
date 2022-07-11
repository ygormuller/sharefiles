require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const User = require('./models/User');
// const bodyParser = require('body-parser');

//const jsonParser = bodyParser.json();

//ROTAS
const index = require('./routes/index');
const routes = require('./routes/routes');

app.use(express.json());
app.use('/', index);
app.use(router);
app.use('/routes', routes);


module.exports = app;
