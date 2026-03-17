const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { optionalAuth } = require('../middleware/auth');

// POST /api/tracking/page-view - Log a page view
router.post('/page-view', optionalAuth, async (req, res) => {
  try {
    const { path, referrer, session_id } = req.body;
    const user_id = req.user ? req.user.id : null;
    const user_agent = req.headers['user-agent'];
    const ip_address = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!path) {
      return res.status(400).json({ error: 'Path is required' });
    }

    await pool.execute(
      'INSERT INTO page_views (user_id, path, referrer, user_agent, ip_address, session_id) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, path, referrer || null, user_agent || null, ip_address || null, session_id || null]
    );

    res.status(201).json({ message: 'Page view tracked' });
  } catch (err) {
    console.error('Tracking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
