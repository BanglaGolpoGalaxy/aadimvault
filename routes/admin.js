const router = require('express').Router();
const { getDB, saveDB } = require('../database/db');
const adminAuth = require('../middleware/admin');

// ---------- All existing routes (users, stats, role update) remain ----------
router.use(adminAuth);

router.get('/users', async (req, res) => {
  try {
    const db = await getDB();
    const result = db.exec('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    const users = result.length && result[0].values.length
      ? result[0].values.map(row => ({
          id: row[0],
          name: row[1],
          email: row[2],
          role: row[3],
          created_at: row[4]
        }))
      : [];
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "user" or "admin".' });
    }
    const db = await getDB();
    db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    saveDB();
    res.json({ message: 'Role updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const db = await getDB();
    const usersCount = db.exec('SELECT COUNT(*) as count FROM users');
    const productsCount = db.exec('SELECT COUNT(*) as count FROM products');
    const bidsCount = db.exec('SELECT COUNT(*) as count FROM bids');
    const totalUsers = usersCount[0]?.values[0]?.[0] || 0;
    const totalProducts = productsCount[0]?.values[0]?.[0] || 0;
    const totalBids = bidsCount[0]?.values[0]?.[0] || 0;
    res.json({ totalUsers, totalProducts, totalBids });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ---------- FORCE ADMIN: Direct promotion without auth (only for first admin) ----------
router.get('/force-admin', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const db = await getDB();
    const result = db.exec('SELECT id FROM users WHERE email = ?', [email]);
    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    db.run('UPDATE users SET role = ? WHERE email = ?', ['admin', email]);
    saveDB();

    res.json({ message: `User ${email} has been promoted to admin.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
