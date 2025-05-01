const express = require('express');
const StoreController = require('../controllers/storeController'); 

const router = express.Router();

router.get('/getAll', StoreController.getAllStores); 
router.get('/:id', StoreController.getStoreById); 
router.post('/create', StoreController.createStore);
router.put('/', StoreController.updateStore);
router.delete('/:id', StoreController.deleteStore); 

module.exports = router;
