const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all alerts with optional filters
router.get('/', (req, res) => {
  try {
    const { state, severity, status, search } = req.query;
    let query = 'SELECT * FROM alerts';
    const params = [];
    const conditions = [];

    if (state) { conditions.push('state = ?'); params.push(state); }
    if (severity) { conditions.push('severity = ?'); params.push(severity); }
    if (status) { conditions.push('status = ?'); params.push(status); }
    if (search) {
      conditions.push('(message LIKE ? OR type LIKE ? OR location LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const alerts = stmt.all(...params);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
});

// Create alert - Admin only
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { type, severity, message, location, state, status } = req.body;
    const stmt = db.prepare('INSERT INTO alerts (type, severity, message, location, state, status) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(type, severity, message, location, state, status || 'active');
    const newAlert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error: error.message });
  }
});

// Get alert by ID
router.get('/:id', (req, res) => {
  try {
    const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alert', error: error.message });
  }
});

// Update alert - Admin only
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { type, severity, message, location, state, status } = req.body;
    const info = db.prepare('UPDATE alerts SET type = ?, severity = ?, message = ?, location = ?, state = ?, status = ? WHERE id = ?')
      .run(type, severity, message, location, state, status, req.params.id);
    if (info.changes === 0) return res.status(404).json({ message: 'Alert not found' });
    const updated = db.prepare('SELECT * FROM alerts WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating alert', error: error.message });
  }
});

// Delete alert - Admin only
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const info = db.prepare('DELETE FROM alerts WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ message: 'Alert not found' });
    res.json({ message: 'Alert deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert', error: error.message });
  }
});

module.exports = router;