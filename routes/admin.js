const express = require('express');
const db = require('../db');
const router = express.Router();

function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/login');
  }
  next();
}

router.get('/', requireAdmin, async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
    res.render('admin', { products });
  } catch (error) {
    res.status(500).send('Unable to load admin panel.');
  }
});

router.get('/products/new', requireAdmin, (req, res) => {
  res.render('add-product', { product: {}, error: null });
});

router.post('/products/new', requireAdmin, async (req, res) => {
  const { name, description, price, image_url } = req.body;
  if (!name || !price) {
    return res.render('add-product', { product: req.body, error: 'Name and price are required.' });
  }
  try {
    await db.execute('INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)', [name, description, parseFloat(price), image_url]);
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Unable to add product.');
  }
});

router.get('/products/:id/edit', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.redirect('/admin');
    }
    res.render('edit-product', { product: rows[0], error: null });
  } catch (error) {
    res.status(500).send('Unable to load product.');
  }
});

router.post('/products/:id/edit', requireAdmin, async (req, res) => {
  const { name, description, price, image_url } = req.body;
  try {
    await db.execute('UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?', [name, description, parseFloat(price), image_url, req.params.id]);
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Unable to update product.');
  }
});

router.post('/products/:id/delete', requireAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Unable to delete product.');
  }
});

module.exports = router;
