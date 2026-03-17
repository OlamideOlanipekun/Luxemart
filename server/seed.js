/**
 * Seed script — populates the luxemart database with categories and products
 * from the original frontend constants.tsx data.
 *
 * Usage: cd server && node seed.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  { id: 'men', name: 'Men', subtitle: 'New arrivals & trends', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800' },
  { id: 'women', name: 'Women', subtitle: 'Summer collection', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800' },
  { id: 'accessories', name: 'Accessories', subtitle: 'Watches & Jewelry', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
  { id: 'tech', name: 'Tech', subtitle: 'Smart devices', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800' },
];

const PRODUCTS = [
  { id: '1', name: 'Classic Trench Coat', category_id: 'women', price: 129.00, original_price: 159.00, rating: 4.8, reviews_count: 124, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 45 },
  { id: '2', name: 'Sport Runner X', category_id: 'men', price: 85.00, original_price: null, rating: 4.9, reviews_count: 86, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600', badge: null, stock_count: 3 },
  { id: '3', name: 'Premium Leather Bag', category_id: 'accessories', price: 210.00, original_price: null, rating: 5.0, reviews_count: 42, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600', badge: 'NEW', stock_count: 12 },
  { id: '4', name: 'Aviator Sunglasses', category_id: 'accessories', price: 145.00, original_price: null, rating: 4.7, reviews_count: 210, image: 'https://images.unsplash.com/photo-1511499767390-a73c23310ce1?auto=format&fit=crop&q=80&w=600', badge: null, stock_count: 0 },
  { id: '5', name: 'Silk Evening Dress', category_id: 'women', price: 249.00, original_price: 299.00, rating: 4.9, reviews_count: 31, image: 'https://images.unsplash.com/photo-1539008835657-9e8e62f85452?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 8 },
  { id: '6', name: 'Minimalist Watch', category_id: 'accessories', price: 149.00, original_price: 189.00, rating: 4.6, reviews_count: 154, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 22 },
  { id: '7', name: 'Smart Noise Cancelling Headphones', category_id: 'tech', price: 279.00, original_price: 399.00, rating: 4.9, reviews_count: 2100, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 150 },
  { id: '8', name: 'Linen Button-Down', category_id: 'men', price: 45.00, original_price: 65.00, rating: 4.5, reviews_count: 89, image: 'https://images.unsplash.com/photo-1596755094514-f87034a2612d?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 5 },
  { id: '9', name: 'Leather Weekend Bag', category_id: 'accessories', price: 380.00, original_price: 450.00, rating: 5.0, reviews_count: 12, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 2 },
  { id: '10', name: 'Mechanical Keyboard Pro', category_id: 'tech', price: 129.00, original_price: 159.00, rating: 4.8, reviews_count: 432, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 15 },
  { id: '11', name: 'Denim Jacket', category_id: 'men', price: 75.00, original_price: 95.00, rating: 4.4, reviews_count: 210, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 12 },
  { id: '12', name: 'Cashmere Scarf', category_id: 'accessories', price: 89.00, original_price: 120.00, rating: 4.9, reviews_count: 56, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 30 },
  { id: '13', name: 'Designer Tote Bag', category_id: 'accessories', price: 499.00, original_price: 750.00, rating: 4.8, reviews_count: 88, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 0 },
  { id: '14', name: 'Smart Watch Series 5', category_id: 'tech', price: 199.00, original_price: 299.00, rating: 4.7, reviews_count: 1240, image: 'https://images.unsplash.com/photo-1544117518-30dd5978bbbe?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 65 },
  { id: '15', name: 'Slim Fit Summer Blazer', category_id: 'men', price: 139.00, original_price: 210.00, rating: 4.6, reviews_count: 54, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 4 },
  { id: '16', name: 'Floral Maxi Dress', category_id: 'women', price: 69.00, original_price: 110.00, rating: 4.5, reviews_count: 92, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 18 },
  { id: '17', name: 'Wireless Charging Hub', category_id: 'tech', price: 35.00, original_price: 59.00, rating: 4.9, reviews_count: 310, image: 'https://images.unsplash.com/photo-1586816829396-986dc5749774?auto=format&fit=crop&q=80&w=600', badge: 'SALE', stock_count: 88 },
];

async function seed() {
  let connection;

  try {
    // Connect without specifying database first to create it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306'),
      multipleStatements: true,
    });

    console.log('✅ Connected to MySQL');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schema);
    console.log('✅ Schema applied');

    // Switch to database
    await connection.query('USE luxemart');

    // Seed categories
    for (const cat of CATEGORIES) {
      await connection.execute(
        'INSERT INTO categories (id, name, subtitle, image) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), subtitle = VALUES(subtitle), image = VALUES(image)',
        [cat.id, cat.name, cat.subtitle, cat.image]
      );
    }
    console.log(`✅ Seeded ${CATEGORIES.length} categories`);

    // Seed products
    for (const prod of PRODUCTS) {
      await connection.execute(
        `INSERT INTO products (id, name, category_id, price, original_price, rating, reviews_count, image, badge, stock_count) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
           name = VALUES(name), price = VALUES(price), original_price = VALUES(original_price), 
           rating = VALUES(rating), reviews_count = VALUES(reviews_count), image = VALUES(image), 
           badge = VALUES(badge), stock_count = VALUES(stock_count)`,
        [prod.id, prod.name, prod.category_id, prod.price, prod.original_price, prod.rating, prod.reviews_count, prod.image, prod.badge, prod.stock_count]
      );
    }
    console.log(`✅ Seeded ${PRODUCTS.length} products`);

    console.log('\n🎉 Database seeded successfully!\n');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    if (connection) await connection.end();
  }
}

seed();
