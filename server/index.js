require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ────────────────────────────────────────────
app.use(helmet());

// ─── CORS ───────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ──────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later.' },
});

// ─── Body Parsing ───────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ───────────────────────────────────────────────────
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// ─── Routes ─────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const trackingRoutes = require('./routes/tracking');
const paymentRoutes = require('./routes/payments');
const newsletterRoutes = require('./routes/newsletter');
const categoryRoutes = require('./routes/categories');
const uploadRoutes = require('./routes/upload');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Health Check ───────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ─── Global Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 LuxeMart API Server running on http://localhost:${PORT}`);
  console.log(`📦 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET (using default)'}`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'CONFIGURED' : 'NOT CONFIGURED'}\n`);
});

module.exports = app;
