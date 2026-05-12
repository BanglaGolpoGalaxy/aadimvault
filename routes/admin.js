const router = require('express').Router();
const { getDB, saveDB } = require('../database/db');
const adminAuth = require('../middleware/admin');

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

module.exports = router;
