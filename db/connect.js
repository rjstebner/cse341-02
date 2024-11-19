const dotenv = require('dotenv');
dotenv.config();

const MongoClient  = require('mongodb').MongoClient;
let _db;

const initDB = (callback) => {
    if (_db) {
        console.log('Database is already connected');
        return callback(null, _db);
    }
    MongoClient.connect(process.env.MONGO_URL)
        .then(client => {
            _db = client.db();
            console.log('Database connected successfully');
            callback(null, _db);
        })
        .catch(err => {
            console.error('Failed to connect to the database', err);
            callback(err);
        });
}

const getDB = () => {
    if (!_db) {
        throw new Error('Database is not connected');
    }
    return _db;
}

module.exports = { initDB, getDB };