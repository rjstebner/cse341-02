const { body, validationResult } = require('express-validator');
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDB().collection('users').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getOne = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDB().collection('users').findOne({ _id: userId });
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createUser = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('birthday').notEmpty().withMessage('Birthday is required'),
    body('address.street').notEmpty().withMessage('Street is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            birthday: req.body.birthday,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                state: req.body.address.state
            }
        };
        try {
            const results = await mongodb.getDB().collection('users').insertOne(newUser);
            if (results.acknowledged) {
                res.status(200).send();
            } else {
                res.status(500).json({ error: 'Failed to create user' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
];

const updateUser = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('birthday').notEmpty().withMessage('Birthday is required'),
    body('address.street').notEmpty().withMessage('Street is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = new ObjectId(req.params.id);
        const updatedUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            birthday: req.body.birthday,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                state: req.body.address.state
            }
        };
        try {
            const results = await mongodb.getDB().collection('users').updateOne({ _id: userId }, { $set: updatedUser });
            if (results.modifiedCount > 0) {
                res.status(200).send();
            } else {
                res.status(500).json({ error: 'Failed to update user' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
];

const deleteUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const results = await mongodb.getDB().collection('users').deleteOne({ _id: userId });
        if (results.deletedCount > 0) {
            res.status(200).send();
        } else {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getAll, getOne, createUser, updateUser, deleteUser };