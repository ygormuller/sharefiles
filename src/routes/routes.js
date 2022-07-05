const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/UserController');
const upload_controller = require('../controllers/UploadController');

router.get('/public', user_controller.public);
router.get('/:id', user_controller.id);
router.post('/register', user_controller.register);
router.post('/login', user_controller.login);

router.get('/:filename', upload_controller.filename);
router.get('/actualStorageFree', upload_controller.actualStorageFree);
router.get('/totalFiles', upload_controller.totalFiles);
router.post('/upload', upload_controller.upload);


module.exports = router;
