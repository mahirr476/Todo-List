// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/auth');

router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.get('/users', userController.getAllUsers.bind(userController));
router.put('/user/:id', authenticateJWT, userController.updateUser.bind(userController));

module.exports = router;