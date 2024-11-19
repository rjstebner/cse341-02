const { body, validationResult } = require('express-validator');
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllProducts = async (req, res) => {
    try {
        const result = await mongodb.getDB().collection('products').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = new ObjectId(req.params.id);
        const result = await mongodb.getDB().collection('products').findOne({ _id: productId });
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createProduct = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newProduct = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category
        };
        try {
            const results = await mongodb.getDB().collection('products').insertOne(newProduct);
            if (results.acknowledged) {
                res.status(200).send();
            } else {
                res.status(500).json({ error: 'Failed to create product' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
];

const updateProduct = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const productId = new ObjectId(req.params.id);
        const updatedProduct = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category
        };
        try {
            const results = await mongodb.getDB().collection('products').updateOne({ _id: productId }, { $set: updatedProduct });
            if (results.modifiedCount > 0) {
                res.status(200).send();
            } else {
                res.status(500).json({ error: 'Failed to update product' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
];

const deleteProduct = async (req, res) => {
    try {
        const productId = new ObjectId(req.params.id);
        const results = await mongodb.getDB().collection('products').deleteOne({ _id: productId });
        if (results.deletedCount > 0) {
            res.status(200).send();
        } else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };