const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.dashboard = async (req, res) => {
  const userCount = await User.countDocuments();
  const listingCount = await Listing.countDocuments();
  const bookingCount = await Booking.countDocuments();
  res.render("admin/dashboard", { userCount, listingCount, bookingCount });
};

module.exports.users = async (req, res) => {
  const users = await User.find({});
  res.render("admin/users", { users });
};

module.exports.listings = async (req, res) => {
  const listings = await Listing.find({});
  res.render("admin/listings", { listings });
};

// Delete all listings
module.exports.deleteAllListings = async (req, res) => {
  await Listing.deleteMany({});
  await Booking.deleteMany({});
  req.flash("success", "All listings and bookings deleted!");
  res.redirect("/admin/listings");
};

// Render edit listing form
module.exports.renderEditListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/admin/listings");
  }
  res.render("admin/edit-listing", { listing });
};

// Handle edit listing
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated!");
  res.redirect("/admin/listings");
};

module.exports.bookings = async (req, res) => {
  const bookings = await Booking.find({}).populate("user listing");
  res.render("admin/bookings", { bookings });
};



module.exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user && user.username === "sujalbhatt") {
    req.flash("error", "You cannot delete the admin user!");
    return res.redirect("/admin/users");
  }
  await User.findByIdAndDelete(req.params.id);
  req.flash("success", "User deleted!");
  res.redirect("/admin/users");
};

module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/admin/listings");
};

module.exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  req.flash("success", "Booking deleted!");
  res.redirect("/admin/bookings");
};