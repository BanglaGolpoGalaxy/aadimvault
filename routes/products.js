const router = require('express').Router();
const { getDB, saveDB } = require('../database/db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// ---------- Multer setup ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ---------- GET all products (public) ----------
router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const result = db.exec('SELECT * FROM products ORDER BY created_at DESC');
    const products = result.length && result[0].values.length
      ? result[0].values.map(row => ({
          id: row[0],
          user_id: row[1],
          title: row[2],
          description: row[3],
          price: row[4],
          for_sale: row[5],
          display_only: row[6],
          auction: row[7],
          image: row[8],
          story_en: row[9],
          story_local: row[10],
          local_lang: row[11],
          created_at: row[12]
        }))
      : [];
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ---------- GET single product (public) ----------
router.get('/:id', async (req, res) => {
  try {
    const db = await getDB();
    const result = db.exec('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const p = result[0].values[0];
    res.json({
      id: p[0], user_id: p[1], title: p[2], description: p[3],
      price: p[4], for_sale: p[5], display_only: p[6], auction: p[7],
      image: p[8], story_en: p[9], story_local: p[10], local_lang: p[11],
      created_at: p[12]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ---------- POST new product (auth required) ----------
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, for_sale, display_only, auction, story_en, story_local, local_lang } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const db = await getDB();
    db.run(
      `INSERT INTO products (user_id, title, description, price, for_sale, display_only, auction, image, story_en, story_local, local_lang)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description || null,
        parseFloat(price) || 0,
        for_sale === 'true' || for_sale === '1' ? 1 : 0,
        display_only === 'true' || display_only === '1' ? 1 : 0,
        auction === 'true' || auction === '1' ? 1 : 0,
        image,
        story_en || null,
        story_local || null,
        local_lang || 'en'
      ]
    );
    saveDB();

    res.status(201).json({ message: 'Product added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ---------- PUT update product (owner or admin) ----------
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const db = await getDB();
    const result = db.exec('SELECT user_id FROM products WHERE id = ?', [req.params.id]);
    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const ownerId = result[0].values[0][0];

    if (ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const { title, description, price, for_sale, display_only, auction, story_en, story_local, local_lang } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    let sql = `UPDATE products SET title=?, description=?, price=?, for_sale=?, display_only=?, auction=?, story_en=?, story_local=?, local_lang=?`;
    let params = [
      title,
      description || null,
      parseFloat(price) || 0,
      for_sale === 'true' || for_sale === '1' ? 1 : 0,
      display_only === 'true' || display_only === '1' ? 1 : 0,
      auction === 'true' || auction === '1' ? 1 : 0,
      story_en || null,
      story_local || null,
      local_lang || 'en'
    ];

    if (image) {
      sql += ', image=?';
      params.push(image);
    }
    sql += ' WHERE id=?';
    params.push(req.params.id);

    db.run(sql, params);
    saveDB();

    res.json({ message: 'Product updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ---------- DELETE product (owner or admin) ----------
router.delete('/:id', auth, async (req, res) => {
  try {
    const db = await getDB();
    const result = db.exec('SELECT user_id FROM products WHERE id = ?', [req.params.id]);
    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const ownerId = result[0].values[0][0];

    if (ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    saveDB();

    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
