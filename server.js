const express = require('express');
const cors = require('cors');
const { Client, Environment } = require('square');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});

app.post('/charge', async (req, res) => {
  try {
    const { token, amount, name, email } = req.body;
    
    const response = await client.paymentsApi.createPayment({
      sourceId: token,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(amount),
        currency: 'USD'
      },
      buyerEmailAddress: email,
      note: `Knotti Loops class registration - ${name}`
    });

    res.json({ success: true, payment: response.result.payment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => res.send('Knotti Loops payment server running!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
