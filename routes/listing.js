if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controller/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// --- INDEX & CREATE ---
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// --- CATEGORY FILTER ---
router.get("/category/:category", wrapAsync(async (req, res) => {
  const { category } = req.params;
  const allListing = await Listing.find({ category });
  res.render("listings/index.ejs", { allListing });
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

module.exports = router;
