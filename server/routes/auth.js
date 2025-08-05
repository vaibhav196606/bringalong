import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';

console.log('🚀 Auth routes module loaded');

const router = express.Router();

// Simple test endpoint to verify database operations
router.post('/test-db', async (req, res) => {
  console.log('🧪 Testing database write operation...');
  try {
    const testUser = new User({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'both'
    });
    
    const savedUser = await testUser.save();
    console.log('✅ Test user saved successfully:', savedUser._id);
    
    res.json({ 
      success: true, 
      message: 'Database write test successful',
      userId: savedUser._id 
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database test failed',
      error: error.message 
    });
  }
});

// Simple test endpoint to verify database read operations
router.get('/test-db-read', async (req, res) => {
  console.log('📖 Testing database read operation...');
  try {
    const userCount = await User.countDocuments();
    console.log(`📊 Found ${userCount} users in database`);
    
    res.json({ 
      success: true, 
      message: 'Database read test successful',
      userCount: userCount
    });
  } catch (error) {
    console.error('❌ Database read test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database read test failed',
      error: error.message 
    });
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/avatars';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Register
router.post('/register', async (req, res) => {
  console.log('🔥 Registration attempt started');
  console.log('Request body:', req.body);
  try {
    const { name, email, password, linkedinUrl, instagramId, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate LinkedIn URL for travelers
    if ((role === 'traveler' || role === 'both') && !linkedinUrl) {
      return res.status(400).json({ message: 'LinkedIn URL is required for travelers' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      linkedinUrl,
      instagramId,
      phone,
      role: role || 'both'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, bio, linkedinUrl, instagramId } = req.body;
    
    // Find and update user
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (instagramId !== undefined) user.instagramId = instagramId;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toObject()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload avatar
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old avatar file if it exists and is not a URL
    if (user.avatar && !user.avatar.startsWith('http')) {
      const oldAvatarPath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user avatar path
    user.avatar = `http://localhost:5000/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      message: 'Avatar uploaded successfully',
      user: user.toObject()
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
