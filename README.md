# Roamly

A modern vacation-rental marketplace where guests can discover, book, and review stays — and where hosts can list, manage availability, and earn. Roamly is built to handle search, bookings, hosting management, secure payments, reviews, and messaging — all with a mobile-first responsive UI.

Live demo:https://roamly-sjq0.onrender.com

---

Table of Contents
- [About](#about)
- [Live Demo](#live-demo)
- [Features](#features)
- [User Flows](#user-flows)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Environment Variables](#environment-variables)
  - [Run Locally](#run-locally)
- [Deployment](#deployment)
- [Data Model (Overview)](#data-model-overview)
- [Testing](#testing)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Credits](#credits)
- [License](#license)
- [Contact](#contact)

---

## About
Roamly is a peer-to-peer short-term rental platform (guest booking + host listings). Guests can search for stays, filter by price/amenities/location, book securely, message hosts, and leave reviews. Hosts can create listings with photos, configure pricing and availability, accept bookings, and manage reservations.

This README is written to match a typical booking/hosting product. Replace any placeholder commands/URLs/configs with values used by your project.

## Live Demo
Your deployed app is available at:
https://your-live-link.example.com

Replace the URL above with your actual deployment. If you provide the URL, I can update this README to show the real live link and add a demo badge.

## Features
- Guest:
  - Search listings by location, date, guests
  - Advanced filters: price range, room type, amenities, rules
  - View listing details: photos, description, map, reviews
  - Secure booking and reservation flow
  - User authentication and profile management
  - Messaging between guest and host
  - Reviews & ratings after stays
- Host:
  - Create and edit property listings with photos
  - Set pricing, cleaning fees, and extra charges
  - Availability calendar and booking rules (minimum/maximum nights)
  - Accept/reject booking requests (if using request flow)
  - Manage reservations and payouts dashboard
- Admin (optional):
  - Moderate listings and reviews
  - Manage users and transactions
- Extra:
  - Map integration (e.g., Mapbox or Google Maps)
  - Responsive UI (desktop & mobile)
  - Image upload and optimization
  - Payment integration (Stripe, PayPal, etc.)

## User Flows
1. Browse/Search: Guest searches a city → filters results → opens listing → checks availability.
2. Booking: Guest selects dates → booking summary & price breakdown → payment → confirmation & calendar update.
3. Hosting: Host lists a property → configures availability/prices → receives booking requests → manages reservations.
4. Reviews: After checkout and stay, guest leaves a review; host can respond.

## Tech Stack
(Replace with your actual stack)
- Frontend: React / Next.js
- Styling: Tailwind CSS / CSS Modules
- Backend: Node.js + Express / Next.js API routes
- Database: PostgreSQL / MongoDB
- Authentication: JWT / OAuth / NextAuth
- Payments: Stripe
- Maps: Mapbox or Google Maps
- Deployment: Vercel / Netlify / Heroku / DigitalOcean

Badges
- Build: [![Build status](https://img.shields.io/badge/build-passing-brightgreen.svg)]
- License: [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]

## Screenshots
Add screenshots in a `screenshots/` folder and reference them here:

![Homepage](./screenshots/homepage.png)
![Listing detail](./screenshots/listing-detail.png)
![Host dashboard](./screenshots/host-dashboard.png)

## Getting Started

### Prerequisites
- Node.js (>= 16)
- npm or yarn
- (Optional) PostgreSQL or MongoDB depending on your DB choice
- (Optional) Stripe account for payments

### Install
1. Clone the repo
   ```
   git clone https://github.com/sujalbhatt00/Roamly.git
   cd Roamly
   ```

2. Install dependencies
   - Monorepo / single app:
     ```
     npm install
     ```
   - If separate client/server folders:
     ```
     cd client && npm install
     cd ../server && npm install
     ```

### Environment Variables
Create a `.env` (or `.env.local`) in the appropriate folder and add the variables your app requires. Example:
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/roamly
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:3000/api
STRIPE_SECRET_KEY=sk_test_...
MAPBOX_TOKEN=pk.XXX
```
Adjust names to match your implementation.

### Run Locally
- Single-app (e.g., Next.js)
  ```
  npm run dev
  ```
- Client & Server (two processes)
  ```
  # server
  cd server
  npm run dev

  # client
  cd ../client
  npm run dev
  ```

Open http://localhost:3000 (or configured PORT).

## Deployment
Document for common platforms — update to match what you used.

Vercel (Next.js)
- Connect this repository to Vercel
- Set environment variables in the Vercel dashboard
- Build command: `npm run build`
- Output directory: Next.js uses `.next` automatically

Netlify (React)
- Build command: `npm run build`
- Publish directory: `build`
- Set environment variables in Netlify site settings

Heroku (Node/Express)
- Set config vars in Heroku dashboard
- Use Procfile like: `web: npm start`
- Push or connect GitHub repo to deploy

Add your live URL to the top of this README once deployed.

## Data Model (Overview)
High level entities:
- User: id, name, email, role (guest/host), profile
- Listing: id, hostId, title, description, photos, location, amenities, rules
- Calendar / Availability: listingId, date, status, priceOverride
- Booking/Reservation: id, listingId, guestId, startDate, endDate, totalPrice, status
- Review: id, bookingId, authorId, rating, comment
- Transaction: id, bookingId, amount, fees, payoutStatus

## Testing
Run unit & integration tests:
```
npm test
```
For E2E (Cypress/Playwright) add:
```
npm run e2e
```

## Contributing
Contributions welcome — please follow these steps:
1. Fork the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request describing your changes

Please open an issue to discuss large changes before implementing.

## Roadmap
- Multi-currency support
- Instant-book and request-to-book options
- Advanced host analytics & payouts
- Mobile app (iOS/Android)
- Improved search relevance and suggestions

## Credits
Built by sujalbhatt00 and contributors. Thanks to the open-source libraries and communities used.

## License
This project is licensed under the MIT License — see the LICENSE file for details.

## Contact
GitHub: https://github.com/sujalbhatt00
Email: (add your contact email)
