
const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { email, password, goal, experience, path } = req.body;

  if (!email || !password || !goal || !experience || !path) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
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

    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

module.exports = router;
