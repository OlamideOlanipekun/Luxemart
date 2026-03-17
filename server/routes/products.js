const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/products - Get all products (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, search, badge, sort } = req.query;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR c.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (badge) {
      query += ' AND p.badge = ?';
      params.push(badge);
    }

    // Sorting
    if (sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY p.rating DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY p.created_at DESC';
    } else {
      query += ' ORDER BY p.id ASC';
    }

    const [products] = await pool.execute(query, params);

    // Map to frontend-expected format
    const mapped = products.map(p => ({
      id: p.id,
      name: p.name,
      category_id: p.category_id,
      price: parseFloat(p.price),
      original_price: p.original_price ? parseFloat(p.original_price) : undefined,
      rating: parseFloat(p.rating),
      reviews_count: p.reviews_count,
      image: p.image,
      badge: p.badge || undefined,
      stock_count: p.stock_count,
    }));

    res.json(mapped);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const p = products[0];
    res.json({
      id: p.id,
      name: p.name,
      category_id: p.category_id,
      price: parseFloat(p.price),
      original_price: p.original_price ? parseFloat(p.original_price) : undefined,
      rating: parseFloat(p.rating),
      reviews_count: p.reviews_count,
      image: p.image,
      badge: p.badge || undefined,
      stock_count: p.stock_count,
    });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/categories - Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/settings/:key - Get public setting (e.g. countdown)
router.get('/settings/:key', async (req, res) => {
  try {
    const [settings] = await pool.execute('SELECT * FROM settings WHERE key_name = ?', [req.params.key]);
    if (settings.length === 0) {
      return res.json({ key_name: req.params.key, value_text: null });
    }
    res.json(settings[0]);
  } catch (err) {
    console.error('Get public setting error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
