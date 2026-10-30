const express = require('express');
const app = express();
const { auditLogger } = require('./middleware/audit');

app.use(express.json());
app.use(express.static('public'));

// Initialize Audit Listener
auditLogger(app);

// --- MOUNT FEATURE ROUTES FIRST ---
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/unique', require('./routes/unique.routes'));
app.use('/api/reports', require('./routes/reports.routes'));
app.use('/api/audit', require('./routes/audit.routes'));

// --- 404 CATCH-ALL HANDLER (MUST BE AT THE VERY END) ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested endpoint does not exist on this server."
    }
  });
});

app.listen(1234, () => {
  console.log('Server running on http://localhost:1234');
});
