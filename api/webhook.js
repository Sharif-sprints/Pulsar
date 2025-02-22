import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export default app;
