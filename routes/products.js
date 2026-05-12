const router = require('express').Router();
const { getDB, saveDB } = require('../database/db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// ---------- Multer setup (dynamic destination) ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsPath = req.app.get('uploadsPath') || 'uploads';
    cb(null, uploadsPath);
  },
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
          images: row[9] ? JSON.parse(row[9]) : [],
          pdf: row[10],
          auction_end: row[11],
          story_en: row[12],
          story_local: row[13],
          local_lang: row[14],
          created_at: row[15]
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
      id: p[0],
      user_id: p[1],
      title: p[2],
      description: p[3],
      price: p[4],
      for_sale: p[5],
      display_only: p[6],
      auction: p[7],
      image: p[8],
      images: p[9] ? JSON.parse(p[9]) : [],
      pdf: p[10],
      auction_end: p[11],
      story_en: p[12],
      story_local: p[13],
      local_lang: p[14],
      created_at: p[15]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ---------- POST new product (auth required, multiple files) ----------
router.post('/', auth, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, price, for_sale, display_only, auction, auction_end, story_en, story_local, local_lang } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const imageFiles = req.files['images'] || [];
    const imagePaths = imageFiles.map(f => `/uploads/${f.filename}`);
    const primaryImage = imagePaths.length ? imagePaths[0] : null;

    const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
    const pdfPath = pdfFile ? `/uploads/${pdfFile.filename}` : null;

    const db = await getDB();
    db.run(
      `INSERT INTO products (user_id, title, description, price, for_sale, display_only, auction, image, images, pdf, auction_end, story_en, story_local, local_lang)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description || null,
        parseFloat(price) || 0,
        for_sale === 'true' || for_sale === '1' ? 1 : 0,
        display_only === 'true' || display_only === '1' ? 1 : 0,
        auction === 'true' || auction === '1' ? 1 : 0,
        primaryImage,
        JSON.stringify(imagePaths),
        pdfPath,
        auction_end || null,
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

// ---------- PUT update product ----------
router.put('/:id', auth, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const db = await getDB();
    const result = db.exec('SELECT user_id, images, pdf FROM products WHERE id = ?', [req.params.id]);
    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const ownerId = result[0].values[0][0];
    if (ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const { title, description, price, for_sale, display_only, auction, auction_end, story_en, story_local, local_lang } = req.body;
    const imageFiles = req.files['images'] || [];
    const newImagePaths = imageFiles.map(f => `/uploads/${f.filename}`);
    const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;

    let sql = `UPDATE products SET title=?, description=?, price=?, for_sale=?, display_only=?, auction=?, story_en=?, story_local=?, local_lang=?, auction_end=?`;
    let params = [
      title,
      description || null,
      parseFloat(price) || 0,
      for_sale === 'true' || for_sale === '1' ? 1 : 0,
      display_only === 'true' || display_only === '1' ? 1 : 0,
      auction === 'true' || auction === '1' ? 1 : 0,
      story_en || null,
      story_local || null,
      local_lang || 'en',
      auction_end || null
    ];

    if (imageFiles.length) {
      sql += `, image=?, images=?`;
      params.push(newImagePaths[0], JSON.stringify(newImagePaths));
    }
    if (pdfFile) {
      sql += `, pdf=?`;
      params.push(`/uploads/${pdfFile.filename}`);
    }
    sql += ` WHERE id=?`;
    params.push(req.params.id);

    db.run(sql, params);
    saveDB();

    res.json({ message: 'Product updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ---------- DELETE product ----------
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

// ---------- BIDDING ROUTES ----------
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount is required.' });
    }

    const db = await getDB();
    const product = db.exec('SELECT auction, auction_end FROM products WHERE id = ?', [req.params.id]);
    if (!product.length || !product[0].values.length) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const prodData = product[0].values[0];
    if (!prodData[0]) return res.status(400).json({ error: 'Product is not for auction.' });
    if (prodData[1] && new Date(prodData[1]) < new Date()) {
      return res.status(400).json({ error: 'Auction has ended.' });
    }

    db.run('INSERT INTO bids (product_id, user_id, amount) VALUES (?, ?, ?)', [
      req.params.id,
      req.user.id,
      parseFloat(amount)
    ]);
    saveDB();

    res.status(201).json({ message: 'Bid placed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.get('/:id/bids', async (req, res) => {
  try {
    const db = await getDB();
    const result = db.exec('SELECT * FROM bids WHERE product_id = ? ORDER BY amount DESC', [req.params.id]);
    const bids = result.length && result[0].values.length
      ? result[0].values.map(row => ({
          id: row[0],
          product_id: row[1],
          user_id: row[2],
          amount: row[3],
          bid_at: row[4]
        }))
      : [];
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
