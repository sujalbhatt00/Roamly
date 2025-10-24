const Listing = require("../models/listing.js");
const fetch = require("node-fetch");

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
  res.render("listings/index.ejs", { allListing });
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

  res.render("listings/show.ejs", {
    listing,
    MAPTILER_API_KEY: process.env.MAPTILER_API_KEY,
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
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Handle new image upload
    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    // Re-geocode if location or country changed
    if (req.body.listing.location || req.body.listing.country) {
      const locationStr = `${req.body.listing.location}, ${req.body.listing.country}`;
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
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted listing!");
  res.redirect("/listings");
};
