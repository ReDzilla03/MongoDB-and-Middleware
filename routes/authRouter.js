const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/protected', authMiddleware, authController.protectedRoute);
router.get('/admin-only', authMiddleware, roleMiddleware('admin'), authController.protectedRoute);

module.exports = router;