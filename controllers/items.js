const path = require('path');
const ShopItem = require('../models/shop-item');


// Route to serve the main page
exports.baseroot = (req, res, next) => {
  console.log("Serving htmlmain.html");
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
};


// Middleware to add a new item
exports.postitem = async (req, res, next) => {
  try {
    const { itemName, description, price, quantity } = req.body;

    // Validate input
    if (!itemName || !price || !quantity) {
      return res.status(400).json({ error: 'Item name, price, and quantity are required' });
    }

    // Create item
    const newItem = await ShopItem.create({
      itemName: itemName,
      description: description || '',
      price: price,
      quantity: quantity
    });

    res.status(201).json({
      message: 'Item added successfully',
      item: {
        id: newItem.id,
        itemName: newItem.itemName,
        description: newItem.description,
        price: newItem.price,
        quantity: newItem.quantity
      }
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
}

// Middleware to fetch all items
exports.fetchitems = async (req, res, next) => {
  try {
    const items = await ShopItem.findAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

// Middleware to handle item purchase
exports.itempurchase = async (req, res, next) => {
  try {
    const { itemId, quantity } = req.body;

    // Validate input
    if (!itemId || !quantity) {
      return res.status(400).json({ error: 'Item ID and quantity are required' });
    }

    // Find the item
    const item = await ShopItem.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if enough quantity is available
    if (item.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity' });
    }

    // Update quantity
    item.quantity -= quantity;
    await item.save();

    res.json({
      message: 'Purchase successful',
      item: {
        id: item.id,
        itemName: item.itemName,
        description: item.description,
        price: item.price,
        quantity: item.quantity
      }
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
}









