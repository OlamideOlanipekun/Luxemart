const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * POST /api/newsletter/subscribe
 * Subscribes a new email to the newsletter.
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    try {
      await pool.execute(
        'INSERT INTO subscribers (email) VALUES (?)',
        [email.toLowerCase().trim()]
      );
      res.status(201).json({ message: 'Subscription successful! Welcome to the archive.' });
    } catch (dbErr) {
      if (dbErr.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'This email is already subscribed.' });
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    res.status(500).json({ error: 'Subscription failed. Please try again later.' });
  }
});

module.exports = router;
