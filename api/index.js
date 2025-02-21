import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } })); // 👈 Stripe Webhook Fix

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            product_data: { name: 'Test Product' },
            unit_amount: 1000, // $10.00
          },
        },
      ],
      success_url: `http://localhost:5173/success`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe Webhook (Only works on Vercel)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("✅ Webhook Event:", event.type);

    if (event.type === 'checkout.session.completed') {
      console.log('✅ Payment Successful:', event.data.object);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook Error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
