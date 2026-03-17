const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// GET /api/reviews/:productId - Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const [reviews] = await pool.execute(
      `SELECT r.id, r.rating, r.comment, r.created_at as date, u.name as userName
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.productId]
    );

    res.json(reviews);
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reviews/:productId - Add a review
router.post('/:productId', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check product exists
    const [products] = await pool.execute('SELECT id FROM products WHERE id = ?', [req.params.productId]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already reviewed
    const [existing] = await pool.execute(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'You have already reviewed this product' });
    }

    // Insert review
    await pool.execute(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.id, req.params.productId, rating, comment || null]
    );

    // Update product rating and review count
    const [stats] = await pool.execute(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?',
      [req.params.productId]
    );

    await pool.execute(
      'UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?',
      [parseFloat(stats[0].avg_rating).toFixed(1), stats[0].count, req.params.productId]
    );

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
