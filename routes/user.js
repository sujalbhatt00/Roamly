const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controller/users.js")
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/profile/edit", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }
  res.render("users/edit-profile.ejs", { user: req.user });
});

router.post("/profile/edit", upload.single("avatar"), async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }
  const { username, email } = req.body;
  let avatar = req.user.avatar;
  if (req.file) {
    avatar = req.file.path; // Use Cloudinary URL, not /uploads/filename
  }
  await req.user.updateOne({ username, email, avatar });
  req.flash("success", "Profile updated!");
  res.redirect("/profile");
});

router.route("/signup")
.get(userController.renderSignupForm )
.post(wrapAsync(userController.signup))


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), userController.Login
)

router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to view your profile.");
    return res.redirect("/login");
  }
  res.render("users/profile.ejs", { user: req.user });
});

// logout 
router.get("/logout", userController.Logout);

router.post("/profile/delete", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }
  // Delete user and log out
  await req.user.deleteOne();
  req.logout(() => {
    req.flash("success", "Your profile has been deleted.");
    res.redirect("/signup");
  });
});




module.exports = router;


 