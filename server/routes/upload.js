const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('../middleware/auth');

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Wrapper to handle multer errors gracefully instead of crashing the middleware chain
const uploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Maximum size is 20MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// POST /api/upload - Admin: Upload an image
router.post('/', requireAuth, requireAdmin, uploadMiddleware, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Construct the public URL for the uploaded file
    // Assumes the server is serving static files from /public at the root
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({ url: imageUrl });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
