const router = require('express').Router();
const { getDB, saveDB } = require('../database/db');
const adminAuth = require('../middleware/admin');

// প্রথমবার অ্যাডমিন বানানোর জন্য (সরাসরি, কোনো টোকেন ছাড়া)
router.get('/first-admin', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'ইমেইল দরকার।' });

    const db = await getDB();
    const user = db.exec('SELECT id FROM users WHERE email = ?', [email]);
    
    if (!user.length || !user[0].values.length) {
      return res.status(404).json({ error: 'ইউজার পাওয়া যায়নি। আগে রেজিস্টার করো।' });
    }

    db.run('UPDATE users SET role = ? WHERE email = ?', ['admin', email]);
    saveDB();
    
    res.json({ message: 'অভিনন্দন! তুমি এখন অ্যাডমিন।' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভার সমস্যা।' });
  }
});

// নিচের সব রুট শুধু অ্যাডমিনরাই দেখতে পাবে (নিরাপত্তার জন্য)
router.use(adminAuth);

// ইউজার লিস্ট, স্ট্যাটস ইত্যাদি... (বাকি কোড ঠিক থাকবে)
router.get('/users', async (req, res) => {
  try {
    const db = await getDB();
    const result = db.exec('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    const users = result.length && result[0].values.length ? result[0].values.map(row => ({ id: row[0], name: row[1], email: row[2], role: row[3], created_at: row[4] })) : [];
    res.json(users);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) return res.status(400).json({ error: 'ভুল রোল।' });
    const db = await getDB();
    db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    saveDB();
    res.json({ message: 'রোল আপডেট সফল।' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

router.get('/stats', async (req, res) => {
  try {
    const db = await getDB();
    const totalUsers = db.exec('SELECT COUNT(*) FROM users')[0].values[0][0];
    const totalProducts = db.exec('SELECT COUNT(*) FROM products')[0].values[0][0];
    const totalBids = db.exec('SELECT COUNT(*) FROM bids')[0].values[0][0];
    res.json({ totalUsers, totalProducts, totalBids });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }); }
});

module.exports = router;
