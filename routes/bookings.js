const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const Booking = require('../models/booking');

// stripe is optional; require environment variable STRIPE_SECRET
let stripe;
if (process.env.STRIPE_SECRET) {
  stripe = require('stripe')(process.env.STRIPE_SECRET);
}

// Create checkout session
router.post('/create-checkout-session/:listingId', async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }

    const price = listing.price || 0;

    if (!stripe) {
      // Fallback: create booking locally without payment (for dev)
      const booking = new Booking({ listing: listing._id, price, paid: false });
      await booking.save();
      req.flash('success', 'Booking created (dev mode, no payment)');
      return res.redirect(`/listings/${listing._id}`);
    }

    const domain = process.env.DOMAIN || `http://localhost:8080`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: listing.title,
              description: listing.description || ''
            },
            unit_amount: Math.round(price * 100)
          },
          quantity: 1
        }
      ],
      success_url: `${domain}/bookings/success?session_id={CHECKOUT_SESSION_ID}&listing=${listing._id}`,
      cancel_url: `${domain}/listings/${listing._id}`
    });

    // create tentative booking with session id
    const booking = new Booking({ listing: listing._id, price, stripeSessionId: session.id, paid: false });
    await booking.save();

    res.redirect(303, session.url);
  } catch (err) {
    next(err);
  }
});

// Success page - confirm payment and mark booking paid
router.get('/success', async (req, res, next) => {
  try {
    const { session_id, listing } = req.query;
    if (!session_id) {
      req.flash('error', 'Missing session id');
      return res.redirect(`/listings/${listing || ''}`);
    }

    if (!stripe) {
      // In dev mode booking was already created unpaid; mark paid for demo
      const b = await Booking.findOne({ stripeSessionId: session_id });
      if (b) {
        b.paid = true;
        await b.save();
        req.flash('success', 'Payment simulated — booking confirmed');
      }
      return res.redirect(`/listings/${b ? b.listing : listing}`);
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paymentStatus = session.payment_status;

    const booking = await Booking.findOne({ stripeSessionId: session_id });
    if (booking && paymentStatus === 'paid') {
      booking.paid = true;
      await booking.save();
      req.flash('success', 'Payment successful — booking confirmed');
      return res.redirect(`/listings/${booking.listing}`);
    }

    req.flash('error', 'Payment not completed');
    res.redirect(`/listings/${listing || ''}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
