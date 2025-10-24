const Listing = require("../models/listing");

module.exports.createCheckoutSession = async (req, res) => {
    const { id } = req.params;
    const { bookingDate } = req.body;
    const listing = await Listing.findById(id);

    // Check if date is already booked
    if (listing.bookedDates.some(date => new Date(date).toISOString().split("T")[0] === bookingDate)) {
        req.flash("error", "This date is already booked!");
        return res.redirect(`/listings/${id}`);
    }

    // Add date to bookedDates
    listing.bookedDates.push(new Date(bookingDate));
    await listing.save();

    // Proceed with payment logic (Stripe, etc.) or just confirm booking
    req.flash("success", "Booking successful!");
    res.redirect(`/listings/${id}`);
};