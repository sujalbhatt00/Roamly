const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require("../middleware.js");
const { cloudinary } = require("../cloudConfig.js");
const Listing = require("../models/listing.js");
const userController = require("../controller/users.js")
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 } // 1MB limit
});
const otpGenerator = require("otp-generator");

router.get("/profile/edit", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }
  res.render("users/edit-profile.ejs", { user: req.user });
});
// ...existing code...

router.post("/profile/edit", upload.single("avatar"), async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }
  const { username, email, currentPassword, newPassword } = req.body;
  let avatar = req.user.avatar;
  if (req.file) {
    avatar = req.file.path;
  }

  // Validate current password
  const user = await User.findById(req.user._id);
  if (!await user.authenticate(currentPassword)) {
    req.flash("error", "Current password is incorrect.");
    return res.redirect("/profile/edit");
  }

  // Check for unique username/email (if changed)
  if (username !== user.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username already taken.");
      return res.redirect("/profile/edit");
    }
  }
  if (email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash("error", "Email already registered.");
      return res.redirect("/profile/edit");
    }
  }

  // Update username, email, avatar
  user.username = username;
  user.email = email;
  user.avatar = avatar;

  // Update password if provided
  if (newPassword && newPassword.trim().length > 0) {
    await user.setPassword(newPassword);
  }

  await user.save();
  // Re-login user to update session
  req.login(user, function(err) {
    if (err) {
      req.flash("error", "Profile updated, but session error. Please log in again.");
      return res.redirect("/login");
    }
    req.flash("success", "Profile updated!");
    res.redirect("/profile");
  });
});


router.get("/verify-otp", userController.renderOtpForm);
router.post("/verify-otp", wrapAsync(userController.verifyOtp));


// Multer error handler for file size
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    req.flash("error", "Image size must be less than 1MB.");
    return res.redirect("/profile/edit");
  }
  next(err);
});

router.route("/signup")
.get(userController.renderSignupForm )
.post(wrapAsync(userController.signup))


router.route("/login")
.get(saveRedirectUrl, userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), userController.Login)

router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to view your profile.");
    return res.redirect("/login");
  }
  res.render("users/profile.ejs", { user: req.user });
});


// Show forgot password form
router.get("/forgot-password", (req, res) => {
  res.render("users/forgot-password.ejs");
});

// Handle forgot password form submission
router.post("/forgot-password", wrapAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "No account found with that email.");
    return res.redirect("/forgot-password");
  }

  // Generate OTP for password reset
 const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false, digits: true });
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send OTP email
  await transporter.sendMail({
    from: process.env.OTP_EMAIL,
    to: email,
    subject: "Roamly Password Reset OTP",
    text: `Your password reset code is: ${otp}\n\nEnter this code on the website to reset your password.`
  });

  req.flash("success", "Password reset code sent to your email.");
  res.redirect(`/reset-password?email=${encodeURIComponent(email)}`);
}));

// Show reset password form
router.get("/reset-password", (req, res) => {
  res.render("users/reset-password.ejs", { email: req.query.email });
});

// Handle reset password form submission
router.post("/reset-password", wrapAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  // Password validation
  if (!newPassword || newPassword.length < 5) {
    req.flash("error", "Password must be at least 5 characters.");
    return res.redirect(`/reset-password?email=${encodeURIComponent(email)}`);
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (!passwordRegex.test(newPassword)) {
    req.flash("error", "Password must contain at least one uppercase letter, one lowercase letter, and one number.");
    return res.redirect(`/reset-password?email=${encodeURIComponent(email)}`);
  }
  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    req.flash("error", "Invalid or expired OTP.");
    return res.redirect(`/reset-password?email=${encodeURIComponent(email)}`);
  }
  await user.setPassword(newPassword);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  req.flash("success", "Password reset successful! You can now log in.");
  res.redirect("/login");
}));



// Resend OTP for password reset
router.post("/resend-otp", wrapAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "No account found with that email.");
    return res.redirect("/signup");
  }
  // Generate new numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();
  await transporter.sendMail({
    from: process.env.OTP_EMAIL,
    to: email,
    subject: "Roamly Email Verification OTP",
    text: `Your new verification code is: ${otp}\n\nEnter this code on the website to verify your email.`
  });
  req.flash("success", "A new OTP has been sent to your email.");
  res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
}));


// logout 
router.get("/logout", userController.Logout);
// Show delete confirmation form
router.get("/profile/delete", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }
  res.render("users/delete-confirm.ejs");
});

//handle delete profile
// Handle delete profile
router.post("/profile/delete", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be logged in.");
      return res.redirect("/login");
    }
    const userId = req.user._id;
    const { password } = req.body;
    const user = await User.findById(userId);

    // Defensive: Check if user exists
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/profile");
    }

    // Verify password before deleting
    const isValid = await user.authenticate(password);
    if (!isValid.user) {
      req.flash("error", "Incorrect password.");
      return res.redirect("/profile/delete");
    }

    // Delete all listings owned by the user (and their images)
    const listings = await Listing.find({ owner: userId });
    for (let listing of listings) {
      if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
      }
      await Listing.findByIdAndDelete(listing._id);
    }

    // Delete avatar from Cloudinary if exists
    if (req.user.avatar && req.user.avatar.includes("cloudinary.com")) {
      const filename = req.user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(filename);
    }

    // Delete user and log out
    await req.user.deleteOne();
    req.logout(() => {
      req.flash("success", "Your profile has been deleted.");
      res.redirect("/signup");
    });
  } catch (err) {
    console.error("Delete profile error:", err); // <-- Add this line
    next(err);
  }
});

module.exports = router;


 