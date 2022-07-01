require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const User = require('./models/User');
// const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
//const lodash = require('lodash');
//const jsonParser = bodyParser.json();

//ROTAS
const index = require('./routes/index');
const routes = require('./routes/routes');

app.use(express.json());
app.use('/', index);
app.use(router);
app.use('/routes', routes);
//app.use(bodyParser);
//app.use(bcrypt);
//app.use(jwt);
app.use(multer);
// app.use(lodash);
// app.use(jsonParser);

module.exports = app;
