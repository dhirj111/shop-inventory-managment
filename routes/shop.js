const path = require('path');

const express = require('express');
const bodyParser = require('body-parser'); 
const adminController = require('../controllers/items');

const router = express.Router();

console.log('route is about to hit')
// Route to serve the main page
router.get('/', adminController.baseroot);


// Middleware to add a new item
router.post('/add-item' ,adminController.postitem)

// Middleware to fetch all items
router.get('/items' ,adminController.fetchitems)


// Middleware to handle item purchase
router.post('/buy-item',adminController.itempurchase)

module.exports = router;