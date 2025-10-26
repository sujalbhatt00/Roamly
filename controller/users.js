const User = require("../models/user");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OTP_EMAIL,
    pass: process.env.OTP_EMAIL_PASS
  }
});

// Export transporter for use in routes/user.js
module.exports.transporter = transporter;

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// Render OTP verification form
module.exports.renderOtpForm = (req, res) => {
  res.render("users/verify-otp.ejs", { email: req.query.email, error: null });
};

// Handle signup and send OTP
module.exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!email || !email.trim()) {
      req.flash("error", "Email is required.");
      return res.redirect("/signup");
    }
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash("error", "Please enter a valid email address.");
      return res.redirect("/signup");
    }
    // Password length and complexity validation
    if (!password || password.length < 5) {
      req.flash("error", "Password must be at least 5 characters.");
      return res.redirect("/signup");
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      req.flash("error", "Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return res.redirect("/signup");
    }
    // Check for unique username and email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        req.flash("error", "Username already taken.");
      } else {
        req.flash("error", "Email already registered.");
      }
      return res.redirect("/signup");
    }

    // Generate numeric OTP only
   const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user with OTP fields
   const newUser = new User({ username, email, otp, otpExpires, isVerified: false });
    const registeredUser = await User.register(newUser, password);

    // Send longer OTP email
    await transporter.sendMail({
      from: process.env.OTP_EMAIL,
      to: email,
      subject: "Roamly Email Verification OTP",
      text: `Hello ${username},

Welcome to Roamly! We're excited to have you join our travel community.

To complete your registration, please enter the following 6-digit verification code on the website:

${otp}

This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.

Thank you for choosing Roamly!
The Roamly Team`
    });

    req.flash("success", "OTP sent to your email. Please verify.");
    res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Add this to your controller/users.js

module.exports.sendResetOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "No user found with that email.");
    return res.redirect("/forgot-password");
  }
  // Generate numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    from: process.env.OTP_EMAIL,
    to: email,
    subject: "Roamly Password Reset OTP",
    text: `Your password reset code is: ${otp}\n\nThis code is valid for 10 minutes.`
  });

  req.flash("success", "OTP sent to your email.");
  res.redirect(`/reset-password?email=${encodeURIComponent(email)}`);
};




// Handle OTP verification
module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/signup");
  }
  // Compare OTP as strings
  if (String(user.otp) !== String(otp) || user.otpExpires < Date.now()) {
    return res.render("users/verify-otp.ejs", { email, error: "Invalid or expired OTP. Please try again." });
  }
  // OTP correct, activate user
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  req.login(user, (err) => {
    if (err) return res.redirect("/login");
    req.flash("success", "Email verified! Welcome to Roamly.");
    res.redirect("/listings");
  });
};


module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.Login = async (req, res) => {
  req.flash("success", "Welcome back to Roamly!");
  let redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.Logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};