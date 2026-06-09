const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

function redirectHome(req, res, next) {
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
}

router.get('/login', redirectHome, (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', redirectHome, async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'Invalid email or password.' });
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, isAdmin: !!user.is_admin };
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Login error');
  }
});

router.get('/register', redirectHome, (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', redirectHome, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.render('register', { error: 'Please complete all fields.' });
  }
  try {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.render('register', { error: 'Email already registered.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    res.redirect('/login');
  } catch (error) {
    res.status(500).send('Registration error');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
