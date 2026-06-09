# Clothes Ecommerce

A simple ecommerce website for selling clothes built with HTML, CSS, JavaScript, Node.js, Express, and MySQL.

## Features

- Browse clothing products
- View product details
- Add products to cart
- Register and login
- Place orders
- Admin panel to add, edit, and delete products
- Responsive layout for desktop and mobile

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a MySQL database and user, then update connection settings if needed.

3. Run the schema SQL to create tables:

   ```bash
   mysql -u root -p < db/schema.sql
   ```

4. Start the app:

   ```bash
   npm start
   ```

5. Open http://localhost:3000 in your browser.

## Default Admin

The app creates a default admin user automatically if one is missing:

- Email: `admin@store.com`
- Password: `admin123`

You can override the default admin password with the `ADMIN_PASSWORD` environment variable.

## Environment Variables

- `DB_HOST` - MySQL host (default `localhost`)
- `DB_USER` - MySQL username (default `root`)
- `DB_PASSWORD` - MySQL password (default empty)
- `DB_NAME` - MySQL database name (default `clothes_shop`)
- `ADMIN_PASSWORD` - Password for the default admin account
