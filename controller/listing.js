const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const Review = require("../models/review.js");
const { cloudinary } = require("../cloudConfig.js");

// Geocode location using MapTiler
async function geocodeLocation(location) {
  try {
    const res = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${process.env.MAPTILER_API_KEY}`
    );
    const data = await res.json();

    if (data.features?.length > 0) {
      return { type: "Point", coordinates: data.features[0].center };
    }
    return null;
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

// INDEX
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  let userBookings = [];

  if (req.user) {
    userBookings = await Booking.find({ user: req.user._id, status: "booked" }).select("listing");
    userBookings = userBookings.map(b => b.listing.toString());
  }

  res.render("listings/index.ejs", { allListing, userBookings });
};

// NEW FORM
module.exports.renderNewForm = async (req, res) => {
  const countriesPath = path.join(__dirname, "..", "data", "countries+states+cities.json");
  const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8"));
  res.render("listings/new.ejs", { countries });
};

// CREATE
module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    const locationStr = `${newListing.location}, ${newListing.country}`;
    const geometry = await geocodeLocation(locationStr);
    if (geometry) newListing.geometry = geometry;

    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};

// SHOW
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const bookings = await Booking.find({ listing: id, status: "booked" });
  const activeBookedDates = [];

  bookings.forEach(booking => {
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

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const countriesPath = path.join(__dirname, "..", "data", "countries+states+cities.json");
  const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8"));

  res.render("listings/edit.ejs", {
    listing,
    originalImageUrl: listing.image?.url || "",
    countries
  });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (req.file) {
      if (listing.image?.filename) {
        try {
          await cloudinary.uploader.destroy(listing.image.filename);
        } catch (e) {
          console.error("Cloudinary delete warning:", e);
        }
      }
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    if (req.body.listing?.location || req.body.listing?.country) {
      const loc = `${req.body.listing.location || listing.location}, ${req.body.listing.country || listing.country}`;
      const geometry = await geocodeLocation(loc);
      if (geometry) listing.geometry = geometry;
    }

    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing.");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

// DELETE
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (listing.image?.filename) {
      try {
        await cloudinary.uploader.destroy(listing.image.filename);
      } catch (e) {
        console.error("Cloudinary delete warning:", e);
      }
    }

    await Booking.deleteMany({ listing: id });
    if (listing.reviews?.length > 0) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    }

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete listing.");
    res.redirect("/listings");
  }
};
