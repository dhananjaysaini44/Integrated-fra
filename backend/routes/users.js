const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all users - Admin only
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT
        u1.id AS id,
        (SELECT COUNT(*) FROM users u2 WHERE u2.id <= u1.id) AS serial_id,
        u1.email,
        u1.name,
        u1.role,
        u1.state,
        u1.gram_panchayat_id,
        u1.created_at
      FROM users u1
      ORDER BY u1.id ASC
    `);
    const users = stmt.all();
    res.json({ message: 'Users retrieved successfully', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID - Admin only
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, email, name, role, state, gram_panchayat_id, created_at FROM users WHERE id = ?');
    const user = stmt.get(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User retrieved successfully', user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create new user - Admin only
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const { name, email, role, password, state, district, village, phone, gram_panchayat_id } = req.body;
  
  if (!name || !email || !role || !password || !state || !district || !village || !gram_panchayat_id) {
    return res.status(400).json({ message: 'Name, email, role, password, state, district, village, and gram_panchayat_id are required' });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }
  const phoneStr = String(phone || '').replace(/\D/g, '');
  if (!phoneStr || phoneStr.length < 10 || phoneStr.length > 11) {
    return res.status(400).json({ message: 'Phone number must be 10 or 11 digits' });
  }
  const gpid = String(gram_panchayat_id).trim();
  if (!/^[A-Za-z0-9]+$/.test(gpid) || gpid.length < 10) {
    return res.status(400).json({ message: 'gram_panchayat_id must be alphanumeric and at least 10 characters long' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Enforce unique gram_panchayat_id
    const exists = db.prepare('SELECT 1 FROM users WHERE gram_panchayat_id = ? LIMIT 1').get(gpid);
    if (exists) {
      return res.status(409).json({ message: 'gram_panchayat_id already exists' });
    }

    // Find smallest available positive integer id to fill gaps
    const row = db.prepare(`
      WITH RECURSIVE seq(n) AS (
        SELECT 1
        UNION ALL
        SELECT n + 1 FROM seq LIMIT 100000
      )
      SELECT seq.n AS next_id
      FROM seq
      LEFT JOIN users u ON u.id = seq.n
      WHERE u.id IS NULL
      ORDER BY seq.n
      LIMIT 1
    `).get();
    const nextId = row?.next_id || 1;
    
    const stmt = db.prepare('INSERT INTO users (id, name, email, role, password, state, district, village, phone, gram_panchayat_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(nextId, name, email, role, hashedPassword, state, district, village, phoneStr, gpid);
    
    // Return the created user (without password)
    const newUser = { 
      id: nextId, 
      name, 
      email, 
      role, 
      state,
      district,
      village,
      phone: phoneStr,
      gram_panchayat_id: gpid
    };
    
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update user - Admin only
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, email, role, state, district, village, phone, gram_panchayat_id } = req.body;
  const userId = req.params.id;
  
  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Name, email, and role are required' });
  }
  if (!gram_panchayat_id) {
    return res.status(400).json({ message: 'gram_panchayat_id is required' });
  }
  const gpid = String(gram_panchayat_id).trim();
  if (!/^[A-Za-z0-9]+$/.test(gpid) || gpid.length < 10) {
    return res.status(400).json({ message: 'gram_panchayat_id must be alphanumeric and at least 10 characters long' });
  }
  
  try {
    // Enforce unique gram_panchayat_id for updates (excluding this user)
    const exists = db.prepare('SELECT 1 FROM users WHERE gram_panchayat_id = ? AND id <> ? LIMIT 1').get(gpid, userId);
    if (exists) {
      return res.status(409).json({ message: 'gram_panchayat_id already exists' });
    }
    // Enforce unique email for updates (excluding this user)
    const emailExists = db.prepare('SELECT 1 FROM users WHERE email = ? AND id <> ? LIMIT 1').get(email, userId);
    if (emailExists) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const stmt = db.prepare('UPDATE users SET name = ?, email = ?, role = ?, state = ?, district = ?, village = ?, phone = ?, gram_panchayat_id = ? WHERE id = ?');
    const info = stmt.run(name, email, role, state || 'Not specified', district || null, village || null, phone || null, gpid, userId);
    
    if (info.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user: { id: userId, name, email, role, state, district, village, phone, gram_panchayat_id: gpid } });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user - Admin only
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.id;
  
  try {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const info = stmt.run(userId);
    
    if (info.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', id: userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;