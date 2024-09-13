const PouchDB = require('pouchdb');
const db = new PouchDB('products');

module.exports = db;
