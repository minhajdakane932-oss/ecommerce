const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
    if (!rows.length) {
      return res.status(404).render('404');
    }
    res.render('product', { product: rows[0] });
  } catch (error) {
    res.status(500).send('Product not found');
  }
});

router.post('/products/:id/add-to-cart', async (req, res) => {
  const productId = req.params.id;
  try {
    const [rows] = await db.execute('SELECT id, name, price, image_url FROM products WHERE id = ?', [productId]);
    if (!rows.length) {
      return res.redirect('/');
    }
    const product = rows[0];
    req.session.cart = req.session.cart || [];
    const existing = req.session.cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      req.session.cart.push({ ...product, quantity: 1 });
    }
    res.redirect('/cart');
  } catch (error) {
    res.status(500).send('Unable to add to cart');
  }
});

module.exports = router;
