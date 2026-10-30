const express = require('express');
const router = express.Router();

router.post('/calculate-discount', (req, res) => {
  const { userTier, cartTotal } = req.body;
  let discountRate = 0;

  if (userTier === 'VIP' && cartTotal > 1000) {
    discountRate = 0.20;
  } else if (cartTotal > 500) {
    discountRate = 0.10;
  }

  const finalPrice = cartTotal - (cartTotal * discountRate);

  res.json({
    success: true,
    originalTotal: cartTotal,
    discountRate: `${discountRate * 100}%`,
    finalPrice
  });
});

module.exports = router;
