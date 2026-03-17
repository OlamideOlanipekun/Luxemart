const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/wishlist - Get user's wishlist
router.get('/', requireAuth, async (req, res) => {
  try {
    const [items] = await pool.execute(
      `SELECT w.product_id as productId, 
              p.name, p.price, p.original_price as originalPrice, 
              p.image, p.category_id as category, p.rating, 
              p.reviews_count as reviews, p.badge, p.stock_count as stockCount
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [req.user.id]
    );

    const mapped = items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: parseFloat(item.price),
      originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
      image: item.image,
      category: item.category,
      rating: parseFloat(item.rating),
      reviews: item.reviews,
      badge: item.badge || undefined,
      stockCount: item.stockCount,
    }));

    res.json(mapped);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/wishlist/:productId - Add to wishlist
router.post('/:productId', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check product exists
    const [products] = await pool.execute('SELECT id FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await pool.execute(
      'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.user.id, productId]
    );

    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/wishlist/:productId - Remove from wishlist
router.delete('/:productId', requireAuth, async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
