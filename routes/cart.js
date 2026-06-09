const express = require('express');
const db = require('../db');
const router = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('cart', { cart, total, error: null });
});

router.post('/cart/update', (req, res) => {
  const quantities = req.body.quantity || {};
  req.session.cart = (req.session.cart || []).map((item) => {
    const qty = parseInt(quantities[item.id], 10);
    return { ...item, quantity: Number.isFinite(qty) && qty > 0 ? qty : item.quantity };
  }).filter((item) => item.quantity > 0);
  res.redirect('/cart');
});

router.post('/cart/checkout', requireLogin, async (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) {
    return res.render('cart', { cart, total: 0, error: 'Your cart is empty.' });
  }
  try {
    const [result] = await db.execute('INSERT INTO orders (user_id, total_amount) VALUES (?, ?)', [req.session.user.id, cart.reduce((sum, item) => sum + item.price * item.quantity, 0)]);
    const orderId = result.insertId;
    const orderItems = cart.map((item) => [orderId, item.id, item.quantity, item.price]);
    await db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [orderItems]);
    req.session.cart = [];
    res.render('order-confirmation', { orderId });
  } catch (error) {
    res.status(500).send('Unable to place order.');
  }
});

module.exports = router;
