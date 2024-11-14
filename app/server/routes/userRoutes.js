// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorize = require('../middleware/authorize');


router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.get('/users', authorize(['admin']), userController.getAllUsers.bind(userController));
router.put('/user/:id', authenticateJWT, authorize(['admin', 'user']), userController.updateUser.bind(userController));

module.exports = router;