const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const productCon = require('../controllers/products');

router.get('/', productCon.getAllProducts);
router.get('/:id', productCon.getProductById);

router.post('/', auth, productCon.createProduct);
router.put('/:id', auth, productCon.updateProduct);
router.delete('/:id', auth, productCon.deleteProduct);

module.exports = router;