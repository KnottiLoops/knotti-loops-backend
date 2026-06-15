const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/charge', async (req, res) => {
  try {
    const { token, amount, name, email } = req.body;
    
    const response = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_id: token,
        idempotency_key: Math.random().toString(36),
        amount_money: { amount: amount, currency: 'USD' },
        buyer_email_address: email,
        note: `Knotti Loops - ${name}`
      })
    });

    const data = await response.json();
    if (data.payment) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: data.errors?.[0]?.detail });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => res.send('Knotti Loops payment server is running!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
