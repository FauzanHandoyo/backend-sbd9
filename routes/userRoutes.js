const express = require('express');
const UserController = require('../controllers/userController');
const corsMiddleware = require('../middleware/corsMiddleware');

const router = express.Router();

router.use(corsMiddleware);

// Test route
router.get('/', (req, res) => {
    res.send('Welcome to Netlab DTE!');
});

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/:email', UserController.getUserByEmail);
router.put('/', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.post('/topUp', UserController.topUpBalance);

module.exports = router;
