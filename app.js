const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'clothes-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
  next();
});

app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/admin', adminRoutes);

async function ensureDefaultAdmin() {
  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE email = ?', ['admin@store.com']);
    if (!rows.length) {
      const bcrypt = require('bcrypt');
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await db.execute('INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)', ['Administrator', 'admin@store.com', hashed, 1]);
      console.log('Created default admin account: admin@store.com');
    }
  } catch (error) {
    console.error('Unable to ensure default admin user:', error);
  }
}

app.get('/', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC LIMIT 12');
    res.render('index', { products });
  } catch (error) {
    res.status(500).send('Unable to load products.');
  }
});

app.use((req, res) => {
  res.status(404).render('404');
});

ensureDefaultAdmin().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
