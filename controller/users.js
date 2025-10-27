// ...existing code...
const User = require("../models/user");
const { google } = require("googleapis");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

// Optional SendGrid SMTP fallback (set SENDGRID_API_KEY in Render env)
const sendgridTransport = process.env.SENDGRID_API_KEY
  ? nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY }
    })
  : null;

// Setup OAuth2 client using env (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
}

// Send via Gmail API (raw base64 MIME)
async function sendViaGmailAPI({ to, subject, text, html }) {
  try {
    const boundary = "----=_RoamlyBoundary";
    const lines = [
      `From: ${process.env.OTP_EMAIL}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "",
      text || "",
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      "",
      html || "",
      `--${boundary}--`
    ];
    const raw = Buffer.from(lines.join("\r\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const res = await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
    console.log("Email sent (Gmail API):", res.data?.id);
    return { ok: true, provider: "gmail-api", info: res.data };
  } catch (err) {
    console.error("Gmail API send error:", err);
    return { ok: false, error: err };
  }
}

// Safe send wrapper: try Gmail API, then SendGrid SMTP
async function safeSendMail({ to, subject, text, html }) {
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    const gmailRes = await sendViaGmailAPI({ to, subject, text, html });
    if (gmailRes.ok) return gmailRes;
    console.error("Gmail API failed, falling back:", gmailRes.error);
  }

  if (sendgridTransport) {
    try {
      const info = await sendgridTransport.sendMail({
        from: process.env.OTP_EMAIL,
        to,
        subject,
        text,
        html
      });
      console.log("Email sent (SendGrid):", info?.messageId || info?.response);
      return { ok: true, provider: "sendgrid", info };
    } catch (sgErr) {
      console.error("SendGrid fallback error:", sgErr);
      return { ok: false, error: sgErr };
    }
  }

  return { ok: false, error: new Error("No email provider configured or all providers failed") };
}

// --- Controller actions (signup, verify OTP, login, logout) ---
// Adjust these to match your app's routing/views if needed.

async function renderSignupForm(req, res) { res.render("users/signup.ejs"); }

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      req.flash("error", "All fields are required.");
      return res.redirect("/signup");
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      req.flash("error", "Username or email already taken.");
      return res.redirect("/signup");
    }
    let user;
    if (typeof User.register === "function") {
      const newUser = new User({ username, email, isVerified: false });
      user = await User.register(newUser, password);
    } else {
      user = new User({ username, email, isVerified: false });
      user.password = password;
      await user.save();
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false, digits: true });
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const sendResult = await safeSendMail({
      to: email,
      subject: "Roamly Email Verification OTP",
      text: `Your verification code is: ${otp}\nThis code expires in 10 minutes.`,
      html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
    });

    if (!sendResult.ok) {
      try { await User.deleteOne({ _id: user._id }); } catch (e) { console.error("Rollback failed:", e); }
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

async function renderLoginForm(req, res) { res.render("users/login.ejs"); }

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

async function renderOtpForm(req, res) {
  const email = req.query.email || "";
  res.render("users/verify-otp.ejs", { email });
}

async function verifyOtp(req, res) {
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
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
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

function Logout(req, res, next) {
  req.logout((err) => {
    if (err) { console.error("Logout error:", err); return next(err); }
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
  safeSendMail
};
