const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy123');
const User = require('../models/User');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/', async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } else {
      event = request.body; // fallback if no secret is set
    }
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.client_reference_id;
      if (userId) {
        let updateData = {
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          subscriptionStatus: 'active'
        };

        if (session.metadata && session.metadata.plan) {
          updateData.subscriptionPlan = session.metadata.plan;
        }

        try {
          if (session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            updateData.subscriptionStartDate = new Date(subscription.current_period_start * 1000);
            updateData.subscriptionRenewalDate = new Date(subscription.current_period_end * 1000);
          }
        } catch (e) {
          console.error("Error retrieving subscription for dates:", e);
        }

        await User.findByIdAndUpdate(userId, updateData);
      }
      break;
    
    case 'customer.subscription.deleted':
    case 'customer.subscription.canceled': {
      const subscription = event.data.object;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { subscriptionStatus: 'lapsed', subscriptionPlan: 'none' }
      );
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      let updateData = {
        subscriptionStartDate: new Date(subscription.current_period_start * 1000),
        subscriptionRenewalDate: new Date(subscription.current_period_end * 1000)
      };

      if (subscription.status !== 'active') {
        updateData.subscriptionStatus = subscription.status === 'past_due' ? 'lapsed' : 'inactive';
      } else {
        updateData.subscriptionStatus = 'active';
      }
      
      await User.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        updateData
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

module.exports = router;
