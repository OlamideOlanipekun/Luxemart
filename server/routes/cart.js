const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/cart - Get user's cart
router.get('/', requireAuth, async (req, res) => {
  try {
    const [items] = await pool.execute(
      `SELECT ci.product_id as productId, ci.quantity, 
              p.name, p.price, p.original_price as originalPrice, 
              p.image, p.category_id as category, p.badge, p.stock_count as stockCount
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    const mapped = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      name: item.name,
      price: parseFloat(item.price),
      originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
      image: item.image,
      category: item.category,
      badge: item.badge || undefined,
      stockCount: item.stockCount,
    }));

    res.json(mapped);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/cart - Add item to cart
router.post('/', requireAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    // Check if product exists
    const [products] = await pool.execute('SELECT id FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Upsert: insert or update quantity
    await pool.execute(
      `INSERT INTO cart_items (user_id, product_id, quantity) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [req.user.id, productId, quantity, quantity]
    );

    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/cart/:productId - Update cart item quantity
router.put('/:productId', requireAuth, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await pool.execute(
        'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
        [req.user.id, req.params.productId]
      );
      return res.json({ message: 'Item removed from cart' });
    }

    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, req.user.id, req.params.productId]
    );

    res.json({ message: 'Cart updated' });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/cart/:productId - Remove item from cart
router.delete('/:productId', requireAuth, async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
