const express = require('express');
const router = express.Router();

const userCon = require('../controllers/users');
const auth = require('../middleware/auth');

router.get('/', userCon.getAll);
router.get('/:id', userCon.getOne);

router.post('/', auth, userCon.createUser);
router.put('/:id', auth, userCon.updateUser);
router.delete('/:id', auth, userCon.deleteUser);

module.exports = router;