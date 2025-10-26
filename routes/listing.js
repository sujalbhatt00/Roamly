// routes/listing.js

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const router = express.Router();
// ... other requires (path, fs, multer, models, etc.)
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js"); // <-- Add Booking model
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controller/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// --- Helper function to get user's booked listing IDs ---
const getUserBookedListingIds = async (user) => {
  if (!user) return new Set(); // Return an empty Set if no user
  try {
    const userBookings = await Booking.find({ user: user._id, status: "booked" }).select("listing");
    // Convert listing ObjectId's to strings and store in a Set for fast lookup
    return new Set(userBookings.map(b => b.listing.toString()));
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return new Set(); // Return empty set on error
  }
};


// --- INDEX Route ---
router.get("/", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  const userBookedListingIds = await getUserBookedListingIds(req.user); // Fetch user's booked listing IDs

  res.render("listings/index.ejs", {
    allListing,
    userBookedListingIds // Pass the Set to the template
  });
}));

// --- CREATE Route ---
router.post("/",
  isLoggedIn,
  validateListing,
  upload.single("listing[image]"),
  wrapAsync(listingController.createListing)
);

// --- SEARCH Route ---
router.get("/search", wrapAsync(async (req, res) => {
  const { q, ajax } = req.query;
  let allListing = [];
  if (q && q.trim() !== "") {
    allListing = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } }, // Assuming you added city to schema for search
        { category: { $regex: q, $options: "i" } }
      ]
    });
  }

  if (ajax) {
    // If AJAX request (for suggestions), just return JSON
    return res.json(allListing);
  }

  // If regular search request, fetch user bookings and render the page
  const userBookedListingIds = await getUserBookedListingIds(req.user); // Fetch user's booked listing IDs

  res.render("listings/index.ejs", {
    allListing,
    userBookedListingIds // Pass the Set to the template
  });
}));

// --- CATEGORY FILTER ---
router.get("/category/:category", wrapAsync(async (req, res) => {
  const { category } = req.params;
  const allListing = await Listing.find({ category });
  const userBookedListingIds = await getUserBookedListingIds(req.user); // Fetch user's booked listing IDs

  res.render("listings/index.ejs", {
    allListing,
    userBookedListingIds // Pass the Set to the template
  });
}));

// --- NEW LISTING ---
router.get("/new", isLoggedIn, listingController.renderNewForm);

// --- SHOW / UPDATE / DELETE ---
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// --- EDIT ---
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    req.flash("error", "Image size must be less than 2MB.");
    return res.redirect("back");
  }
  next(err);
});

module.exports = router;