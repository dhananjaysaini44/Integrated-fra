const express = require('express');
const router = express.Router();

// Mock reports routes for now
router.get('/', (req, res) => {
  res.json({ message: 'Reports endpoint working', reports: [] });
});

router.post('/', (req, res) => {
  res.json({ message: 'Report created', report: req.body });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Report retrieved', id: req.params.id });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Report updated', id: req.params.id });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Report deleted', id: req.params.id });
});

module.exports = router;