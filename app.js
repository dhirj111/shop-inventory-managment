const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const router = express.Router();

const sequelize = new Sequelize('node-complete', 'root', '1@Password', {
  dialect: 'mysql',
  host: 'localhost'
});
const app = express();

// Model Definition for Shop Item
const ShopItem = sequelize.define('shopitem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  itemName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

// Middleware and Configuration
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', 'views');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main page
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Middleware to add a new item
app.post('/add-item', async (req, res, next) => {
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
});

// Middleware to fetch all items
app.get('/items', async (req, res, next) => {
  try {
    const items = await ShopItem.findAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Middleware to handle item purchase
app.post('/buy-item', async (req, res, next) => {
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
});

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    app.listen(7000, () => {
      console.log('Server is running on http://localhost:7000');
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });