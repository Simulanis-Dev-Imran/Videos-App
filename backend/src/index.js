import('dotenv/config');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const { ensureDatabaseInitialized } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Static hosting for videos
app.use('/videos', express.static(UPLOAD_DIR));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

ensureDatabaseInitialized().then(() => {
  app.listen(PORT, () => console.log("Server running on : " ,PORT));
}).catch((err) => {
  console.error('Failed to init DB', err);
  process.exit(1);
});
