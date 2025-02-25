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
      success_url: `https://pulsar-two.vercel.app/success`,
      cancel_url: `https://pulsar-two.vercel.app/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
