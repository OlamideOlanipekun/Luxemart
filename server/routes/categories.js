const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// Middleware to check if user is admin (restoring standard check)
const requireAdmin = async (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// GET /api/categories - Public: Get all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    console.error('Fetch categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// PUT /api/categories/:id - Admin: Update category
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, subtitle, image } = req.body;
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (subtitle !== undefined) { fields.push('subtitle = ?'); values.push(subtitle); }
    if (image !== undefined) { fields.push('image = ?'); values.push(image); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);
    await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
    
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

module.exports = router;
