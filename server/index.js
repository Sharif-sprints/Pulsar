import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log("🚀 ~ STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
console.log("🚀 ~ STRIPE_WEBHOOK_SECRET:", process.env.STRIPE_WEBHOOK_SECRET);

// 🟢 Apply express.json() only for non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next(); // Skip JSON parsing for webhook
  } else {
    express.json()(req, res, next);
  }
});

app.use(cors());

// ✅ Create Checkout Session
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

    console.log("✅ Checkout Session Created:", session);
    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Webhook to Handle Stripe Events
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  console.log("🔔 Raw Webhook Body:", req.body);
  console.log("🔔 Headers:", req.headers);

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("❌ Missing STRIPE_WEBHOOK_SECRET in .env file!");
    return res.status(400).send("Webhook secret is missing!");
  }

  try {
    // ✅ Construct the event using the raw body
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    console.log("✅ Webhook Event Received:", event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('✅ Payment Successful:', session);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook Error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
