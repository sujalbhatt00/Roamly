const User = require("../models/user");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

// Primary Gmail transporter (Google App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OTP_EMAIL,
    pass: process.env.OTP_EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

// Optional SendGrid fallback (set SENDGRID_API_KEY in env)
const sendgridTransport = process.env.SENDGRID_API_KEY
  ? nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY }
    })
  : null;

// Verify transporters at startup so errors appear in logs
transporter.verify((err) => {
  if (err) console.error("SMTP verify failed (Gmail):", err);
  else console.log("SMTP transporter ready (Gmail)");
});
if (sendgridTransport) {
  sendgridTransport.verify((err) => {
    if (err) console.error("SMTP verify failed (SendGrid):", err);
    else console.log("SMTP transporter ready (SendGrid)");
  });
}

// Safe send wrapper: try primary, then fallback
async function safeSendMail({ to, subject, text, html }) {
  const mailOptions = { from: process.env.OTP_EMAIL, to, subject, text, html };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent (Gmail):", info?.messageId || info?.response);
    return { ok: true, provider: "gmail", info };
  } catch (primaryErr) {
    console.error("Primary sendMail error (Gmail):", primaryErr);
    if (sendgridTransport) {
      try {
        const info = await sendgridTransport.sendMail(mailOptions);
        console.log("Email sent (SendGrid):", info?.messageId || info?.response);
        return { ok: true, provider: "sendgrid", info };
      } catch (sgErr) {
        console.error("SendGrid sendMail error:", sgErr);
        return { ok: false, error: sgErr };
      }
    }
    return { ok: false, error: primaryErr };
  }
}

// Controller actions

// Render signup form
async function renderSignupForm(req, res) {
  res.render("users/signup.ejs");
}

// Handle signup: register user, generate OTP, send email
async function signup(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      req.flash("error", "All fields are required.");
      return res.redirect("/signup");
    }

    // Check if user/email exists
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      req.flash("error", "Username or email already taken.");
      return res.redirect("/signup");
    }

    // Create user and register with passport-local-mongoose (if used)
    let user;
    if (typeof User.register === "function") {
      const newUser = new User({ username, email, isVerified: false });
      user = await User.register(newUser, password); // may throw
    } else {
      // fallback (if passport plugin not present)
      user = new User({ username, email, isVerified: false });
      user.password = password; // NOTE: insecure fallback; prefer passport-local-mongoose
      await user.save();
    }

    // Generate numeric OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
      digits: true
    });

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP email
    const sendResult = await safeSendMail({
      to: email,
      subject: "Roamly Email Verification OTP",
      text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`
    });

    if (!sendResult.ok) {
      // rollback created user to avoid orphan accounts
      try {
        await User.deleteOne({ _id: user._id });
      } catch (e) {
        console.error("Rollback delete user failed:", e);
      }
      req.flash("error", "Unable to send verification email. Try again later.");
      return res.redirect("/signup");
    }

    req.flash("success", "Verification code sent. Check your email.");
    return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error("Signup error:", err);
    req.flash("error", "Signup failed. Try again.");
    return res.redirect("/signup");
  }
}

// Render login form
async function renderLoginForm(req, res) {
  res.render("users/login.ejs");
}

// Login post handler (called after passport.authenticate)
async function Login(req, res) {
  try {
    const redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    req.flash("success", "Welcome back!");
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("Login redirect error:", err);
    return res.redirect("/");
  }
}

// Render OTP verification form
async function renderOtpForm(req, res) {
  const email = req.query.email || "";
  res.render("users/verify-otp.ejs", { email });
}

// Verify OTP (for signup & password reset flows)
async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      req.flash("error", "Email and OTP are required.");
      return res.redirect("/verify-otp");
    }

    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "No account found for that email.");
      return res.redirect("/signup");
    }

    if (!user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < Date.now()) {
      req.flash("error", "Invalid or expired OTP.");
      return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
    }

    // Mark verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Optionally log in the user after verification
    req.login(user, (err) => {
      if (err) {
        console.error("Login after OTP error:", err);
        req.flash("success", "Email verified. Please login.");
        return res.redirect("/login");
      }
      req.flash("success", "Email verified. Welcome!");
      return res.redirect("/");
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    req.flash("error", "Verification failed. Try again.");
    return res.redirect("/verify-otp");
  }
}

// Logout handler
function Logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    req.flash("success", "You have been logged out.");
    res.redirect("/");
  });
}

module.exports = {
  renderSignupForm,
  signup,
  renderLoginForm,
  Login,
  renderOtpForm,
  verifyOtp,
  Logout,
  safeSendMail,
  transporter
};
