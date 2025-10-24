const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const Booking = require('../models/booking');
const { isLoggedIn } = require('../middleware'); // ensure user is logged in
const wrapAsync = require('../utils/wrapAsync');
// Create booking (manual)
router.post('/create/:listingId', isLoggedIn, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    // Ensure valid dates
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      req.flash('error', 'Please select valid start and end dates');
      return res.redirect(`/listings/${listingId}`);
    }

    // Check if dates overlap with existing bookings
    const overlap = await Booking.findOne({
      listing: listingId,
      status: 'booked',
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlap) {
      req.flash('error', 'Selected dates are already booked');
      return res.redirect(`/listings/${listingId}`);
    }

    // Calculate total days & price
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = listing.price * days;

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      startDate,
      endDate,
      totalPrice,
      status: 'booked'
    });

    await booking.save();

    // Push booked dates to listing (optional)
    if (!listing.bookedDates) listing.bookedDates = [];
    const newBookedDates = [];
    for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
      newBookedDates.push(new Date(d));
    }
    listing.bookedDates.push(...newBookedDates);
    await listing.save();

    req.flash('success', `Booking confirmed from ${startDate} to ${endDate}`);
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while booking');
    res.redirect(`/listings/${req.params.listingId}`);
  }
});
router.get("/my-bookings", isLoggedIn, wrapAsync(async (req, res) => {
  const Booking = require("../models/booking");
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("users/my-booking.ejs", { bookings });
}));

module.exports = router;
