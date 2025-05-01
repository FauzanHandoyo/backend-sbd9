
const express = require('express');
const corsMiddleware = require('../middleware/corsMiddleware'); // Import CORS middleware
const transactionController = require('../controllers/transactionController');

const router = express.Router();


router.use(corsMiddleware);


router.post('/create', transactionController.createTransaction);
router.post('/pay/:id', transactionController.payTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.get('/', transactionController.getAllTransactions);

module.exports = router;