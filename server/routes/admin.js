const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// Check if user is admin (for now, simply check if email is admin@luxemart.com)
// In a real app we'd add an 'is_admin' column to the users table
const requireAdmin = async (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ 
      error: 'Access denied. Admin only.',
      details: 'You do not have administrative privileges.'
    });
  }
  next();
};

// GET /api/admin/stats - Get overview metrics
router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Get totals
    const [revenueRes] = await pool.query(`SELECT SUM(total) as total FROM orders`);
    const totalRevenue = revenueRes[0].total || 0;

    const [ordersRes] = await pool.query(`SELECT COUNT(*) as count FROM orders`);
    const totalOrders = ordersRes[0].count || 0;

    const [customersRes] = await pool.query(`SELECT COUNT(*) as count FROM users WHERE email != 'admin@luxemart.com'`);
    const totalCustomers = customersRes[0].count || 0;

    const [productsRes] = await pool.query(`SELECT COUNT(*) as count FROM products`);
    const totalProducts = productsRes[0].count || 0;

    const [subscribersRes] = await pool.query(`SELECT COUNT(*) as count FROM subscribers`);
    const totalSubscribers = subscribersRes[0].count || 0;

    const [dealsRes] = await pool.query(`SELECT COUNT(*) as count FROM products WHERE badge = 'SALE' OR (original_price IS NOT NULL AND original_price > price)`);
    const activeDeals = dealsRes[0].count || 0;

    // Get "Previous Period" stats for change % (e.g. last month vs month before)
    // For simplicity, we'll just compare this month vs last month
    const [thisMonthRes] = await pool.query(`SELECT SUM(total) as total, COUNT(*) as count FROM orders WHERE created_at >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')`);
    const [lastMonthRes] = await pool.query(`SELECT SUM(total) as total, COUNT(*) as count FROM orders WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01') AND created_at < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')`);
    
    const revThis = Number(thisMonthRes[0].total) || 0;
    const revLast = Number(lastMonthRes[0].total) || 0;
    const revChange = revLast === 0 ? 0 : ((revThis - revLast) / revLast) * 100;

    const ordThis = Number(thisMonthRes[0].count) || 0;
    const ordLast = Number(lastMonthRes[0].count) || 0;
    const ordChange = ordLast === 0 ? 0 : ((ordThis - ordLast) / ordLast) * 100;

    // Sparklines (Daily stats for last 7 days)
    const [revenueSpark] = await pool.query(`
      SELECT COALESCE(SUM(total), 0) as val 
      FROM (
        SELECT CURRENT_DATE - INTERVAL i DAY as d FROM (SELECT 0 as i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) di
      ) dates
      LEFT JOIN orders ON DATE(created_at) = d
      GROUP BY d ORDER BY d ASC
    `);
    const [ordersSpark] = await pool.query(`
      SELECT COUNT(id) as val 
      FROM (
        SELECT CURRENT_DATE - INTERVAL i DAY as d FROM (SELECT 0 as i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) di
      ) dates
      LEFT JOIN orders ON DATE(created_at) = d
      GROUP BY d ORDER BY d ASC
    `);

    // Get category breakdown (Revenue by category)
    const [categoryRes] = await pool.query(`
      SELECT c.name as label, SUM(oi.price * oi.quantity) as value, '#3b82f6' as color
      FROM categories c
      JOIN products p ON c.id = p.category_id
      JOIN order_items oi ON p.id = oi.product_id
      GROUP BY c.id
    `);
    
    // Assign colors to categories if not enough
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];
    const categoryStats = categoryRes.map((cat, i) => ({
      ...cat,
      color: colors[i % colors.length]
    }));

    // Get 6 most recent orders
    const [recentOrdersRes] = await pool.query(`
      SELECT o.id, u.name as customer, u.email, 
             p.name as product, o.total as amount, 
             o.status, o.created_at as \`date\`
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 6
    `);

    // Basic map for frontend mock structure
    const recentOrders = recentOrdersRes.map(o => ({
      ...o,
      avatar: `https://i.pravatar.cc/40?u=${o.email}`,
      items: 1 // Simplified for overview
    }));

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      totalSubscribers,
      activeDeals,
      revChange: Number(revChange.toFixed(1)),
      ordChange: Number(ordChange.toFixed(1)),
      revenueSpark: revenueSpark.map(s => Number(s.val)),
      ordersSpark: ordersSpark.map(s => Number(s.val)),
      categoryStats: categoryStats.length > 0 ? categoryStats : [],
      recentOrders
    });
  } catch (error) {
    console.error('Admin Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// GET /api/admin/orders - Get all orders
router.get('/orders', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.id, u.name as customer, u.email, 
             p.name as product, o.total as amount, 
             o.status, o.created_at as \`date\`
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    // Map to frontend structure
    const formattedOrders = orders.map(o => ({
      ...o,
      avatar: `https://i.pravatar.cc/40?u=${o.email}`,
      items: 1 
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Admin Orders error:', error);
    res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
});

// GET /api/admin/products - Get all products with stock info
router.get('/products', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    console.error('Admin Products error:', error);
    res.status(500).json({ error: 'Failed to fetch admin products' });
  }
});

// GET /api/admin/customers - Get all customers with their order stats
router.get('/customers', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [customers] = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.created_at as joined,
        COUNT(o.id) as orders,
        COALESCE(SUM(o.total), 0) as spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.email != 'admin@luxemart.com'
      GROUP BY u.id
      ORDER BY spent DESC
    `);
    
    // Map to frontend structure
    const formattedCustomers = customers.map(c => {
      // Determine status based on spend/orders
      let status = 'new';
      if (c.orders > 0) status = 'active';
      if (c.spent > 1000 || c.orders >= 10) status = 'vip';

      // Format date
      const joinedDate = new Date(c.joined).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      return {
        ...c,
        avatar: `https://i.pravatar.cc/40?u=${c.email}`,
        status,
        joined: joinedDate
      };
    });
    
    res.json(formattedCustomers);
  } catch (error) {
    console.error('Admin Customers error:', error);
    res.status(500).json({ error: 'Failed to fetch admin customers' });
  }
});

// GET /api/admin/traffic-stats - Get daily visitors for last 7 days
router.get('/traffic-stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        DATE_FORMAT(d.d, '%a') as day,
        COUNT(DISTINCT pv.session_id) as visitors
      FROM (
        SELECT CURRENT_DATE - INTERVAL i DAY as d 
        FROM (SELECT 0 as i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) di
      ) d
      LEFT JOIN page_views pv ON DATE(pv.created_at) = d.d
      GROUP BY d.d
      ORDER BY d.d ASC
    `);
    
    res.json(stats);
  } catch (error) {
    console.error('Admin Traffic Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch traffic stats' });
  }
});

// GET /api/admin/chart-data - Get monthly revenue and orders for the last 12 months
router.get('/chart-data', requireAuth, requireAdmin, async (req, res) => {
  try {
    // We want the last 12 months.
    // We'll use a series of dates to ensure we have every month even if revenue is 0.
    const [stats] = await pool.query(`
      WITH RECURSIVE months AS (
        SELECT DATE_FORMAT(CURRENT_DATE - INTERVAL 11 MONTH, '%Y-%m-01') as month_start
        UNION ALL
        SELECT month_start + INTERVAL 1 MONTH
        FROM months
        WHERE month_start < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
      )
      SELECT 
        DATE_FORMAT(m.month_start, '%b') as month,
        COALESCE(SUM(o.total), 0) as revenue,
        COUNT(o.id) as orders
      FROM months m
      LEFT JOIN orders o ON DATE_FORMAT(o.created_at, '%Y-%m-01') = m.month_start
      GROUP BY m.month_start
      ORDER BY m.month_start ASC
    `);
    
    res.json(stats);
  } catch (error) {
    console.error('Admin Chart Data error:', error);
    res.status(500).json({ error: 'Failed to fetch admin chart data' });
  }
});

// GET /api/admin/activity - Get recent activities (New orders, new users)
router.get('/activity', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Get last 10 activities: union of orders and users
    const [activities] = await pool.query(`
      (SELECT 
        'order' as type, 
        CONCAT('New order from ', u.name) as message, 
        o.created_at as time, 
        '#3b82f6' as color,
        o.id as id
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10)
      UNION ALL
      (SELECT 
        'user' as type, 
        CONCAT('New user registered: ', name) as message, 
        created_at as time, 
        '#10b981' as color,
        id as id
      FROM users
      WHERE email != 'admin@luxemart.com'
      ORDER BY created_at DESC
      LIMIT 10)
      ORDER BY time DESC
      LIMIT 10
    `);

    // Format time naturally (e.g., "2 mins ago")
    const formattedActivities = activities.map(act => {
      const diff = Date.now() - new Date(act.time).getTime();
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);

      let timeStr = 'Just now';
      if (mins > 0) timeStr = `${mins}m ago`;
      if (hours > 0) timeStr = `${hours}h ago`;
      if (days > 0) timeStr = `${days}d ago`;

      return { ...act, time: timeStr };
    });

    res.json(formattedActivities);
  } catch (error) {
    console.error('Admin Activity error:', error);
    res.status(500).json({ error: 'Failed to fetch admin activity' });
  }
});

// GET /api/admin/analytics-metrics - Compute real analytics metrics
router.get('/analytics-metrics', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Conversion rate: orders / unique sessions
    const [sessionsRes] = await pool.query(`SELECT COUNT(DISTINCT session_id) as total FROM page_views`);
    const [ordersRes] = await pool.query(`SELECT COUNT(*) as total FROM orders`);
    const totalSessions = Number(sessionsRes[0].total) || 1;
    const totalOrders = Number(ordersRes[0].total) || 0;
    const conversionRate = ((totalOrders / totalSessions) * 100).toFixed(2);

    // Bounce rate: sessions with only 1 page view / total sessions
    const [bounceRes] = await pool.query(`
      SELECT COUNT(*) as bounced FROM (
        SELECT session_id, COUNT(*) as pages 
        FROM page_views 
        WHERE session_id IS NOT NULL 
        GROUP BY session_id 
        HAVING pages = 1
      ) singles
    `);
    const bouncedSessions = Number(bounceRes[0].bounced) || 0;
    const bounceRate = ((bouncedSessions / totalSessions) * 100).toFixed(1);

    // Average session duration (from page_views timestamps)
    const [durationRes] = await pool.query(`
      SELECT AVG(duration) as avg_duration FROM (
        SELECT session_id,
               TIMESTAMPDIFF(SECOND, MIN(created_at), MAX(created_at)) as duration
        FROM page_views
        WHERE session_id IS NOT NULL
        GROUP BY session_id
        HAVING COUNT(*) > 1
      ) sess
    `);
    const avgDurationSec = Number(durationRes[0].avg_duration) || 0;
    const minutes = Math.floor(avgDurationSec / 60);
    const seconds = Math.round(avgDurationSec % 60);
    const sessionDuration = `${minutes}m ${seconds}s`;

    // Weekly traffic change: this week vs last week unique visitors
    const [thisWeekRes] = await pool.query(`
      SELECT COUNT(DISTINCT session_id) as visitors 
      FROM page_views 
      WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
    `);
    const [lastWeekRes] = await pool.query(`
      SELECT COUNT(DISTINCT session_id) as visitors 
      FROM page_views 
      WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) + 7 DAY)
        AND created_at < DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
    `);
    const thisWeek = Number(thisWeekRes[0].visitors) || 0;
    const lastWeek = Number(lastWeekRes[0].visitors) || 1;
    const weeklyChange = (((thisWeek - lastWeek) / lastWeek) * 100).toFixed(1);

    res.json({
      conversionRate: Number(conversionRate),
      bounceRate: Number(bounceRate),
      sessionDuration,
      weeklyTrafficChange: Number(weeklyChange),
    });
  } catch (error) {
    console.error('Admin Analytics Metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics metrics' });
  }
});

// POST /api/admin/products - Create a new product
router.post('/products', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id, name, category_id, price, original_price, rating, reviews_count, image, badge, stock_count } = req.body;
    if (!name || !category_id || price === undefined) {
      return res.status(400).json({ error: 'name, category_id, and price are required' });
    }
    const productId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    await pool.query(
      `INSERT INTO products (id, name, category_id, price, original_price, rating, reviews_count, image, badge, stock_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [productId, name, category_id, price, original_price || null, rating || 0, reviews_count || 0, image || null, badge || null, stock_count || 0]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Admin Create Product error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A product with this ID already exists' });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/admin/products/:id - Update a product
router.put('/products/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, category_id, price, original_price, image, badge, stock_count } = req.body;
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (category_id !== undefined) { fields.push('category_id = ?'); values.push(category_id); }
    if (price !== undefined) { fields.push('price = ?'); values.push(price); }
    if (original_price !== undefined) { fields.push('original_price = ?'); values.push(original_price); }
    if (image !== undefined) { fields.push('image = ?'); values.push(image); }
    if (badge !== undefined) { fields.push('badge = ?'); values.push(badge || null); }
    if (stock_count !== undefined) { fields.push('stock_count = ?'); values.push(stock_count); }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(req.params.id);
    await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Admin Update Product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id - Delete a product
router.delete('/products/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Remove from carts & wishlists first (FK constraints)
    await pool.query('DELETE FROM cart_items WHERE product_id = ?', [req.params.id]);
    await pool.query('DELETE FROM wishlist WHERE product_id = ?', [req.params.id]);
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Admin Delete Product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// PUT /api/admin/orders/:id - Update order status
router.put('/orders/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided' });
    }

    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', status });
  } catch (error) {
    console.error('Admin Update Order error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// GET /api/admin/settings/:key
router.get('/settings/:key', requireAdmin, async (req, res) => {
  try {
    const [settings] = await pool.execute('SELECT * FROM settings WHERE key_name = ?', [req.params.key]);
    if (settings.length === 0) {
      return res.json({ key_name: req.params.key, value_text: null });
    }
    res.json(settings[0]);
  } catch (err) {
    console.error('Get setting error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/settings/:key
router.put('/settings/:key', requireAdmin, async (req, res) => {
  try {
    const { value } = req.body;
    await pool.execute(
      'INSERT INTO settings (key_name, value_text) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_text = ?',
      [req.params.key, value, value]
    );
    res.json({ message: 'Setting updated successfully' });
  } catch (err) {
    console.error('Update setting error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
