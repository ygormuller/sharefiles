const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/UserController');

router.get('/public', user_controller.public);
router.get('/:id', user_controller.id);
router.post('/register', user_controller.register);
router.post('/login', user_controller.login);

module.exports = router;
