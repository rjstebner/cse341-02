const express = require('express');
const router = express.Router();

const userCon = require('../controllers/users');

router.get('/', userCon.getAll);
router.get('/:id', userCon.getOne);

router.post('/', userCon.createUser);
router.put('/:id', userCon.updateUser);
router.delete('/:id', userCon.deleteUser);

module.exports = router;