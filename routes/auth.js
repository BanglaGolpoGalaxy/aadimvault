const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB, saveDB } = require('../database/db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const db = await getDB();

    // Check existing user
    const existing = db.exec('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length && existing[0].values.length) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    saveDB();

    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = await getDB();
    const result = db.exec('SELECT * FROM users WHERE email = ?', [email]);

    if (!result.length || !result[0].values.length) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result[0].values[0]; // [id, name, email, password, role, created_at]
    const valid = await bcrypt.compare(password, user[3]);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user[0], email: user[2], role: user[4] },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user[0], name: user[1], email: user[2], role: user[4] }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
