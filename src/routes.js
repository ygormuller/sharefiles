const express = require('express');
const routes = express.Router();

const user_controller = require('./controllers/UserController');

routes.get('/', user_controller.index);

module.exports = routes;
