
const express = require('express');
const path = require('path');

const app = express();
const PORT = 1234;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/roles', require('./routes/role.routes'));

// Home endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'School Library Management System API is running.'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running.'
    });
});

// Handle unknown endpoints
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'The requested endpoint does not exist on this server.'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Categories page: http://localhost:${PORT}/categories.html`);
    console.log(`Roles API: http://localhost:${PORT}/api/roles`);
});
