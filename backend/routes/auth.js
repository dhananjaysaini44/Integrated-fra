const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// JWT Secret (use same fallback everywhere)
const JWT_SECRET = process.env.JWT_SECRET || 'fra_atlas_secret_key_2024_production';

// Auth middleware (scoped to this router)
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, state, district, village, phone, gram_panchayat_id } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  if (!state || !district || !village) {
    return res.status(400).json({ message: 'State, district, and village are required' });
  }
  if (!gram_panchayat_id) {
    return res.status(400).json({ message: 'gram_panchayat_id is required' });
  }
  const gpid = String(gram_panchayat_id).trim();
  if (!/^[A-Za-z0-9]+$/.test(gpid) || gpid.length < 10) {
    return res.status(400).json({ message: 'gram_panchayat_id must be alphanumeric and at least 10 characters long' });
  }
  const phoneStr = String(phone || '').replace(/\D/g, '');
  if (!phoneStr || phoneStr.length < 10 || phoneStr.length > 11) {
    return res.status(400).json({ message: 'Phone number must be 10 or 11 digits' });
  }
  try {
    // Enforce unique gram_panchayat_id
    const exists = db.prepare('SELECT 1 FROM users WHERE gram_panchayat_id = ? LIMIT 1').get(gpid);
    if (exists) {
      return res.status(409).json({ message: 'gram_panchayat_id already exists' });
    }

    // Enforce unique email
    const emailExists = db.prepare('SELECT 1 FROM users WHERE email = ? LIMIT 1').get(email);
    if (emailExists) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Compute smallest available positive integer id to fill gaps
    const row = db.prepare(`
      SELECT MIN(candidate) AS next_id
      FROM (
        SELECT 1 AS candidate
        UNION ALL
        SELECT id + 1 AS candidate FROM users
      ) c
      WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = c.candidate)
    `).get();
    const nextId = row?.next_id || 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Explicitly insert with chosen id to reuse gaps
    const stmt = db.prepare('INSERT INTO users (id, email, password, name, state, district, village, phone, gram_panchayat_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(nextId, email, hashedPassword, name, state, district, village, phoneStr, gpid);
    res.status(201).json({ id: nextId, email, name, state, district, village, phone: phoneStr, gram_panchayat_id: gpid });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login with automatic plaintext-to-bcrypt upgrade for legacy users
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const stored = user.password || '';
    const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(stored);
    let valid = false;

    if (isBcryptHash) {
      valid = await bcrypt.compare(password, stored);
    } else {
      // Legacy/plaintext password stored. Allow once and upgrade to bcrypt.
      valid = password === stored;
      if (valid) {
        try {
          const upgraded = await bcrypt.hash(password, 10);
          db.prepare('UPDATE users SET password = ? WHERE id = ?').run(upgraded, user.id);
          user.password = upgraded;
        } catch (e) {
          console.warn('Failed to upgrade plaintext password to bcrypt for user:', user.id, e);
        }
      }
    }

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    // Log login event
    try {
      const stmtLog = db.prepare(`
        INSERT INTO system_logs (action, user_id, entity_type, entity_id, details)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmtLog.run('login', user.id, 'user', user.id, JSON.stringify({ email: user.email }));
    } catch (e) { /* logging best-effort */ }

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, phone: user.phone, village: user.village, district: user.district, state: user.state, role: user.role, gram_panchayat_id: user.gram_panchayat_id } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, name, phone, village, district, state, role, gram_panchayat_id FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { name, email, phone, village, district, state, gram_panchayat_id } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    if (!state || !district || !village) {
      return res.status(400).json({ message: 'State, district, and village are required' });
    }
    if (!gram_panchayat_id) {
      return res.status(400).json({ message: 'gram_panchayat_id is required' });
    }
    const gpid = String(gram_panchayat_id).trim();
    if (!/^[A-Za-z0-9]+$/.test(gpid) || gpid.length < 10) {
      return res.status(400).json({ message: 'gram_panchayat_id must be alphanumeric and at least 10 characters long' });
    }
    
    const stmt = db.prepare('UPDATE users SET name = ?, email = ?, phone = ?, village = ?, district = ?, state = ?, gram_panchayat_id = ? WHERE id = ?');
    const info = stmt.run(name, email, phone || null, village, district, state, gpid, req.user.id);
    
    if (info.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updatedUser = db.prepare('SELECT id, email, name, phone, village, district, state, role, gram_panchayat_id FROM users WHERE id = ?').get(req.user.id);
    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    
    const isValid = await bcrypt.compare(currentPassword, user.password || '');
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    stmt.run(hashedNewPassword, req.user.id);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password (placeholder)
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  // In a real app, you would send an email here
  res.json({ message: 'Password reset email sent (placeholder)' });
});

// Reset password (placeholder)
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  // In a real app, you would verify the reset token here
  res.json({ message: 'Password reset successfully (placeholder)' });
});

module.exports = router;
