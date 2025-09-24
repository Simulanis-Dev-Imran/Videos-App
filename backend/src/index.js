import('dotenv/config');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const { ensureDatabaseInitialized, getDb, all } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
const FRONTEND_DIST_DIR = path.join(__dirname, 'dist');
console.log(FRONTEND_DIST_DIR)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.use('/videos', express.static(UPLOAD_DIR));
app.use(express.static(FRONTEND_DIST_DIR));
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/get/users', async (req, res) => {
  try {
    const db = getDb();
    const users = await all(db, 'SELECT * FROM users', []);
    return res.status(200).json({ message: "Users", data: users })
  } catch (error) {
    return res.status(422).json({ message: error.message, data: [] })
  }
})

app.get('/', (req, res) => {
  const indexHtmlPath = path.join(FRONTEND_DIST_DIR, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    return res.sendFile(indexHtmlPath);
  }
  return res.status(404).send('Frontend build not found.');
});

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path.startsWith('/videos')) return next();
  const indexHtmlPath = path.join(FRONTEND_DIST_DIR, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    return res.sendFile(indexHtmlPath);
  }
  return res.status(404).send('Frontend build not found.');
});

ensureDatabaseInitialized().then(() => {
  app.listen(PORT, () => console.log("Server running on : ", PORT));
}).catch((err) => {
  console.error('Failed to init DB', err);
  process.exit(1);
});
