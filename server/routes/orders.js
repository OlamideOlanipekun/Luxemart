const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const crypto = require('crypto');

// POST /api/orders - Create an order from current cart
router.post('/', requireAuth, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get cart items with product details
    const [cartItems] = await connection.execute(
      `SELECT ci.product_id, ci.quantity, p.price, p.stock_count
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.stock_count !== null && item.stock_count < item.quantity) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          error: `Insufficient stock for product ${item.product_id}`,
        });
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const shipping = subtotal > 150 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Generate order number
    const orderNumber = `LX-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;

    // Insert order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, subtotal, shipping, tax, total)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, orderNumber, subtotal.toFixed(2), shipping.toFixed(2), tax.toFixed(2), total.toFixed(2)]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of cartItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Decrease stock
      if (item.stock_count !== null) {
        await connection.execute(
          'UPDATE products SET stock_count = stock_count - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
    }

    // Clear cart
    await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Order placed successfully',
      orderNumber,
      orderId,
      total: parseFloat(total.toFixed(2)),
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders - Get user's orders
router.get('/', requireAuth, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(orders.map(o => ({
      ...o,
      subtotal: parseFloat(o.subtotal),
      shipping: parseFloat(o.shipping),
      tax: parseFloat(o.tax),
      total: parseFloat(o.total),
    })));
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/:id - Get single order with items
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    const [items] = await pool.execute(
      `SELECT oi.*, p.name, p.image, p.category_id as category
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    res.json({
      ...order,
      subtotal: parseFloat(order.subtotal),
      shipping: parseFloat(order.shipping),
      tax: parseFloat(order.tax),
      total: parseFloat(order.total),
      items: items.map(i => ({
        ...i,
        price: parseFloat(i.price),
      })),
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
