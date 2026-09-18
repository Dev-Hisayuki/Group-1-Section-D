const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/users', require('./routes/users.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/orders', require('./routes/orders.routes'));

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
  console.log('Server is running on http://localhost:1234');
});