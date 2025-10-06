Stripe Booking & Payment Setup

What I added

- `models/booking.js` — Booking Mongoose model
- `routes/bookings.js` — routes to create a Stripe Checkout Session and confirm success
- Wire bookings route into `app.js`
- Updated `views/listings/show.ejs` and `views/listings/index.ejs` to add "Book Now" buttons
- Added `stripe` dependency to `package.json`

Environment variables (create a `.env` in project root)

- STRIPE_SECRET: your Stripe secret key (starts with sk_test_ or sk_live_)
- STRIPE_PUBLISHABLE: your Stripe publishable key (pk_test_...)
- DOMAIN: optional; base domain used for success/cancel URLs. Defaults to `http://localhost:8080`.

Development notes

- If STRIPE_SECRET is not set, the routes will fall back to a "dev mode" that creates a Booking document but does not process payment. This makes it easy to test without Stripe.

Install

Run in project root (PowerShell):

npm install

or to install only stripe if you don't want to run full install:

npm install stripe

How to test

1. Start MongoDB locally and run the app: `node app.js` or use nodemon.
2. Open a listing page and click "Book Now". If Stripe is configured you'll be redirected to Stripe Checkout. If not configured, a dev booking will be created and you'll be redirected back.

Follow-ups

- Add authentication so bookings are tied to users.
- Add a bookings index for users to view their bookings.
- Add webhooks for robust payment confirmation (recommended for production).
