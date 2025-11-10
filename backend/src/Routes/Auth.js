
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env');
}

// Validation helpers
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email || '').toLowerCase());
};

const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 8;
};

// User Registration
router.post('/register', async (req, res) => {
  const { email, password, goal, experience, path } = req.body;

  // Validate required fields
  if (!email || !password || !goal || !experience || !path) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    // Normalize email to lowercase and trim
    const emailNormalized = String(email).toLowerCase().trim();
    
    // Hash password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: emailNormalized,
        password_hash: hashedPassword,
        profile: {
          create: {
            goal,
            experience,
            path,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Exclude sensitive fields before sending response
    const { password_hash, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

// User Login (JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Normalize email to lowercase and trim
    const emailNormalized = String(email).toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    // Generic error if user not found (avoid user enumeration)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password with bcrypt (constant-time comparison)
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    // Generic error if password is wrong
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token (HS256, 1 hour expiry)
    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    // Return token and safe user data
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
