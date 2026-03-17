const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { requireAuth } = require('../middleware/auth');

// POST /api/payments/create-payment-intent
router.post('/create-payment-intent', requireAuth, async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user.id.toString(),
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Stripe PaymentIntent error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
