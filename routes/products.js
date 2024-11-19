const express = require('express');
const router = express.Router();

const productCon = require('../controllers/products');

router.get('/', productCon.getAllProducts);
router.get('/:id', productCon.getProductById);

router.post('/', productCon.createProduct);
router.put('/:id', productCon.updateProduct);
router.delete('/:id', productCon.deleteProduct);

module.exports = router;