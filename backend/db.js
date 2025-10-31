const path = require('path');
const Database = require('better-sqlite3');

// Always resolve the DB path relative to this file to avoid cwd issues
const dbPath = path.join(__dirname, 'fra_atlas.db');
const db = new Database(dbPath);

module.exports = db;
