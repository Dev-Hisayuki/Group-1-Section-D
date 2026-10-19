
require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const PORT = 1234;
const publicDirectory = path.join(__dirname, 'public');

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is missing from .env');
}

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
    createDatabaseTable: true,
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 8 * 60 * 60 * 1000
});

const { requireAuth, requireAdmin } = require('./middleware/auth');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: 'library.sid',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 8 * 60 * 60 * 1000
    }
}));

// Authentication routes
app.use('/api/auth', require('./routes/auth.routes'));

// Protect management APIs
app.use('/api/categories', requireAuth);
app.use('/api/roles', requireAuth, requireAdmin);
app.use('/api/users', requireAuth, requireAdmin);

// Existing CRUD routes
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/roles', require('./routes/role.routes'));
app.use('/api/users', require('./routes/user.routes'));

// Home page
app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard.html');
    }

    return res.redirect('/login.html');
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running.'
    });
});

// Protect HTML pages except login.html
app.use((req, res, next) => {
    const requestedPath = req.path.toLowerCase();

    if (
        path.extname(requestedPath) === '.html' &&
        requestedPath !== '/login.html'
    ) {
        return requireAuth(req, res, next);
    }

    next();
});

// Serve frontend files
app.use(express.static(publicDirectory, {
    index: false
}));

// Handle unknown endpoints
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            message: 'The requested API endpoint does not exist.'
        });
    }

    return res.status(404).send('Page not found.');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
