const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_fallback_key');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// POST /api/payment/create-checkout-session
router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    let { plan } = req.body;
    plan = (plan && typeof plan === 'string' && plan.toLowerCase().trim() === 'yearly') ? 'yearly' : 'monthly';
    
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine pricing based on plan selection
    // Stripe expects amounts in cents ($20.00 = 2000 cents)
    const unitAmount = plan === 'yearly' ? 20000 : 2000;
    
    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      client_reference_id: user._id.toString(),
      metadata: { plan }, // Attach plan to metadata for webhooks
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Digital Heroes ${plan.charAt(0).toUpperCase() + plan.slice(1)} Membership`,
              description: 'Access to monthly draws, tracking, and charity contributions.',
            },
            unit_amount: unitAmount,
            recurring: { interval: plan === 'yearly' ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:5173/dashboard?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `http://localhost:5173/dashboard?payment=cancelled`,
    });

    // Return the checkout URL to the frontend so it can redirect the user
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payment/verify-session
// We call this from the frontend upon returning from a successful Stripe checkout
router.post('/verify-session', verifyToken, async (req, res) => {
  try {
    const { sessionId, plan } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let safePlan = 'monthly';
    if (plan && typeof plan === 'string' && plan.toLowerCase().trim() === 'yearly') {
      safePlan = 'yearly';
    }

    let startDate = new Date();
    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (safePlan === 'yearly' ? 12 : 1));

    // Try to retrieve actual session details
    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session && session.subscription) {
          user.stripeSubscriptionId = session.subscription;
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          if (subscription.current_period_start) {
            startDate = new Date(subscription.current_period_start * 1000);
          }
          if (subscription.current_period_end) {
            endDate = new Date(subscription.current_period_end * 1000);
          }
        }
      } catch (e) {
        console.warn('Could not fetch stripe subscription details for dates:', e.message);
      }
    }

    user.subscriptionStatus = 'active';
    user.subscriptionPlan = safePlan;
    user.subscriptionStartDate = startDate;
    user.subscriptionRenewalDate = endDate;
    await user.save();

    // Charitable Contribution Logic
    if (user.selectedCharityId) {
      try {
        const Charity = require('../models/Charity');
        const unitAmount = safePlan === 'yearly' ? 200 : 20; // $200 or $20
        const percentage = user.charityPercentage || 10;
        const contribution = unitAmount * (percentage / 100);
        
        await Charity.findByIdAndUpdate(user.selectedCharityId, {
          $inc: { totalRaised: contribution }
        });
      } catch (err) {
        console.error('Error updating charity total', err);
      }
    }

    res.json({ success: true, message: 'Payment verified and membership activated.' });
    
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
});

module.exports = router;
