# 🛍️ LuxeMart: Premium Full-Stack E-Commerce Platform

A professional-grade, full-stack e-commerce application built with a focus on modern aesthetic, security, and AI-driven user experience. This project features a robust Express/Node.js backend, a high-performance React frontend, and a comprehensive administrative dashboard.

## ✨ Key Features

- **🛡️ Secure Authentication**: JWT-based authentication with password hashing (Bcrypt) and protected administrative routes.
- **🚜 Dynamic Admin Dashboard**: Real-time sales analytics, customer tracking, and full inventory CRUD management.
- **🤖 AI Shopping Assistant**: Integrated Google Gemini AI to provide style advice, product insights, and customer review summaries.
- **🏪 Polished Storefront**: Feature-rich UX including persistent cart/wishlist (DB-synced), product search, categories, and reviews.
- **🔍 Real-time Analytics**: Built-in page view tracking and session-based visitor metrics.
- **⚡ Production Ready**: Hardened with Helmet security headers, Express rate-limiting, and optimized asset delivery.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Lucide React, CSS3 (Modern Flex/Grid).
- **Backend**: Node.js, Express, MySQL (mysql2), JSON Web Tokens (JWT).
- **Database**: Relational schema with 9+ tables and complex FK constraints.
- **AI**: Google Generative AI (Gemini 1.5).
- **Performance**: Vite-optimized builds, lazy loading, and intelligent state management.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MySQL Database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/luxemart.git
   cd luxemart
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env  # Configure your database and Gemini key
   npm run seed          # Initialize database with products and categories
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ..
   npm install
   npm run dev
   ```

## 📈 Database Schema

The project uses a structured MySQL database including:
- `users`: Secure customer and admin profiles.
- `products`: Complete inventory storage.
- `orders` & `order_items`: Full transaction history.
- `cart_items` & `wishlist`: Real-time state persistence.
- `reviews`: User-generated content.
- `page_views`: Analytics tracking.

## 📄 License

This project is licensed under the MIT License.
