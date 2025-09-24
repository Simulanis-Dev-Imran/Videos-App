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

app.use('/videos', express.static(UPLOAD_DIR));
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

ensureDatabaseInitialized().then(() => {
  app.listen(PORT, () => console.log("Server running on : ", PORT));
}).catch((err) => {
  console.error('Failed to init DB', err);
  process.exit(1);
});
