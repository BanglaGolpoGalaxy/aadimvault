require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Persistent upload path ----------
const uploadsPath = process.env.UPLOADS_PATH || path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsPath, { recursive: true });
app.set('uploadsPath', uploadsPath);

// ---------- Middleware ----------
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ---------- Static files ----------
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsPath));

// ---------- Routes ----------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Adim Vault] Server running on port ${PORT}`);
});
