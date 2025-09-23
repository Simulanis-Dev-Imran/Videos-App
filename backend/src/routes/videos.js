const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { authMiddleware } = require('../auth');

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const TMP_DIR = path.join(UPLOAD_DIR, 'tmp');
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}
const upload = multer({ dest: TMP_DIR });

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await fs.promises.readdir(UPLOAD_DIR);
    const list = [];
    for (const name of entries) {
      if (name === 'tmp') continue; // exclude temp upload folder
      const full = path.join(UPLOAD_DIR, name);
      const stat = await fs.promises.stat(full);
      if (!stat.isFile()) continue; // only include regular files
      list.push({ name, size: stat.size, mtime: stat.mtimeMs, url: `/videos/${encodeURIComponent(name)}` });
    }
    list.sort((a, b) => b.mtime - a.mtime);
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to list videos' });
  }
});

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const desiredName = req.body?.filename;
    if (!req.file) return res.status(400).json({ message: 'File required' });
    if (!desiredName) return res.status(400).json({ message: 'filename field required' });

    const safeName = sanitizeFileName(desiredName);
    const targetPath = path.join(UPLOAD_DIR, safeName);

    // Ensure tmp dir exists
    const tmpPath = req.file.path;

    // Overwrite if exists per requirement
    await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.promises.copyFile(tmpPath, targetPath);
    await fs.promises.unlink(tmpPath);

    res.json({ message: 'Uploaded', name: safeName, url: `/videos/${encodeURIComponent(safeName)}` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
