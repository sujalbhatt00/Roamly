const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");

function isAdmin(req, res, next) {
  if (req.user && req.user.username === "sujalbhatt") return next();
  req.flash("error", "Admin access only.");
  return res.redirect("/");
}

router.get("/admin", isAdmin, adminController.dashboard);
router.get("/admin/users", isAdmin, adminController.users);
router.get("/admin/listings", isAdmin, adminController.listings);
router.post("/admin/listings/delete-all", isAdmin, adminController.deleteAllListings);
router.get("/admin/listings/:id/edit", isAdmin, adminController.renderEditListing);
router.post("/admin/listings/:id/edit", isAdmin, adminController.editListing);
router.get("/admin/bookings", isAdmin, adminController.bookings);
router.post("/admin/users/:id/delete", isAdmin, adminController.deleteUser);
router.post("/admin/listings/:id/delete", isAdmin, adminController.deleteListing);
router.post("/admin/bookings/:id/delete", isAdmin, adminController.deleteBooking);

module.exports = router;