const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get recent system logs - Admin only
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit || '20', 10), 1);
    const logs = db.prepare(`
      SELECT l.*, u.email as user_email, u.name as user_name,
             strftime('%Y-%m-%dT%H:%M:%fZ', l.created_at) as created_at_iso
      FROM system_logs l
      LEFT JOIN users u ON u.id = l.user_id
      ORDER BY l.created_at DESC, l.id DESC
      LIMIT ?
    `).all(limit);

    res.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

// Clear all logs - Admin only
router.delete('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM system_logs').run();
    res.json({ message: 'System logs cleared' });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ message: 'Error clearing logs' });
  }
});

// Export all logs as CSV - Admin only
router.get('/export', authenticateToken, requireAdmin, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT l.id, l.action, l.user_id, l.entity_type, l.entity_id, l.details,
             strftime('%Y-%m-%dT%H:%M:%fZ', l.created_at) as created_at_iso,
             u.email as user_email, u.name as user_name
      FROM system_logs l
      LEFT JOIN users u ON u.id = l.user_id
      ORDER BY l.created_at DESC, l.id DESC
    `).all();

    // Build CSV
    const headers = [
      'id','action','user_id','entity_type','entity_id','details','created_at','user_email','user_name'
    ];
    const escape = (val) => {
      if (val === null || val === undefined) return '';
      const s = String(val);
      // Escape double quotes by doubling them; wrap in quotes if contains comma, quote, or newline
      const needsWrap = /[",\n\r]/.test(s);
      const escaped = s.replace(/"/g, '""');
      return needsWrap ? `"${escaped}"` : escaped;
    };

    const lines = [headers.join(',')].concat(
      rows.map(r => headers.map(h => escape(r[h === 'created_at' ? 'created_at_iso' : h])).join(','))
    );
    const csv = lines.join('\r\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="system-logs-${timestamp}.csv"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8
  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({ message: 'Error exporting logs' });
  }
});

// Create a log entry (optional, for server internal use)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { action, user_id, entity_type, entity_id, details } = req.body;
    if (!action) return res.status(400).json({ message: 'Action is required' });
    const stmt = db.prepare(`
      INSERT INTO system_logs (action, user_id, entity_type, entity_id, details)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(action, user_id || null, entity_type || null, entity_id || null, details || null);

    const log = db.prepare('SELECT * FROM system_logs WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ log });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ message: 'Error creating log' });
  }
});

module.exports = router;
