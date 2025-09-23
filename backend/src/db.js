const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const DB_PATH = path.join(__dirname, '..', 'app.db');
let db;

function getDb() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH);
  }
  return db;
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (err, rows) {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function ensureDatabaseInitialized() {
  const db = getDb();
  await run(db, `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )`);

  // Create default user if not exists
  const existing = await all(db, 'SELECT * FROM users WHERE username = ?', ['admin']);
  if (existing.length === 0) {
    const hash = await bcrypt.hash('password', 10);
    await run(db, 'INSERT INTO users (username, password_hash) VALUES (?, ?)', ['admin', hash]);
    console.log('Created default user: admin / password');
  }
}

module.exports = { getDb, run, all, ensureDatabaseInitialized };
