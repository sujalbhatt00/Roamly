// ...existing code...
const Listing = require("../models/listing.js");
const fetch = require("node-fetch");
const Booking = require("../models/booking.js");
const Review = require("../models/review.js");
const { cloudinary } = require("../cloudConfig.js");

// Geocode location using MapTiler
async function geocodeLocation(location) {
  try {
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${process.env.MAPTILER_API_KEY}`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return {
        type: "Point",
        coordinates: data.features[0].center, // [lng, lat]
      };
    }
    return null;
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

// --- INDEX LISTINGS ---
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  let userBookings = [];
  if (req.user) {
    userBookings = await Booking.find({ user: req.user._id, status: "booked" }).select("listing");
    userBookings = userBookings.map(b => b.listing.toString());
  }
  res.render("listings/index.ejs", { allListing, userBookings });
};


const path = require("path");
const fs = require("fs");

module.exports.renderNewForm = async (req, res) => {
  const countriesPath = path.join(__dirname, "..", "data", "countries+states+cities.json");
  const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8"));
  res.render("listings/new.ejs", { countries });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  const originalImageUrl = listing.image?.url || "";
  const countriesPath = path.join(__dirname, "..", "data", "countries+states+cities.json");
  const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8"));
  res.render("listings/edit.ejs", { listing, originalImageUrl, countries });
};

// --- SHOW LISTING ---
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Get active bookings and booked dates
  const activeBookings = await Booking.find({ listing: id, status: "booked" });
  const activeBookedDates = [];
  activeBookings.forEach(booking => {
    let start = new Date(booking.startDate);
    let end = new Date(booking.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      activeBookedDates.push(new Date(d).toISOString().split("T")[0]);
    }
  });

  res.render("listings/show.ejs", {
    listing,
    MAPTILER_API_KEY: process.env.MAPTILER_API_KEY,
    activeBookedDates
  });
};

// --- CREATE LISTING ---
module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // Handle image upload
    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    // Geocode
    const locationStr = `${newListing.location}, ${newListing.country}`;
    const geometryData = await geocodeLocation(locationStr);
    if (geometryData) newListing.geometry = geometryData;

    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create listing: ");
    res.redirect("/listings/new");
  }
};

// --- UPDATE LISTING ---
module.exports.updateListing = async (req, res) => {
  console.log("REQ.BODY:", req.body);
  try {
    const { id } = req.params;
    // return the updated document
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Handle new image upload
    if (req.file) {
      // delete previous image if present (best-effort)
      if (listing.image && listing.image.filename) {
        try {
          await cloudinary.uploader.destroy(listing.image.filename);
        } catch (e) {
          console.error("Cloudinary destroy (old image) warning:", e?.message || e);
        }
      }
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    // Re-geocode if location or country changed
    if ((req.body.listing && req.body.listing.location) || (req.body.listing && req.body.listing.country)) {
      const locationStr = `${req.body.listing.location || listing.location}, ${req.body.listing.country || listing.country}`;
      const geometryData = await geocodeLocation(locationStr);
      if (geometryData) listing.geometry = geometryData;
    }

    await listing.save();
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing: ");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

// --- DELETE LISTING ---
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Delete image from Cloudinary if exists (best-effort)
    if (listing.image && listing.image.filename) {
      try {
        await cloudinary.uploader.destroy(listing.image.filename);
      } catch (e) {
        console.error("Cloudinary destroy warning:", e?.message || e);
      }
    }

    // Delete all bookings for this listing
    await Booking.deleteMany({ listing: id });

    // Delete all reviews for this listing (guard if listing.reviews undefined)
    if (Array.isArray(listing.reviews) && listing.reviews.length > 0) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    }

    // Delete the listing itself
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Successfully deleted listing and all related bookings/reviews!");
    return res.redirect("/listings");
  } catch (err) {
    console.error("Delete listing error:", err);
    req.flash("error", "Failed to delete listing. Try again.");
    return res.redirect("/listings");
  }
};
// ...existing code...