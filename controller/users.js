// ...existing code...
const User = require("../models/user");
const { google } = require("googleapis");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

// Optional SendGrid SMTP fallback (set SENDGRID_API_KEY in env)
const sendgridTransport = process.env.SENDGRID_API_KEY
  ? nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY }
    })
  : null;

// Setup OAuth2 client for Gmail (if using Gmail OAuth)
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
}

// Send via Gmail API (raw base64 MIME) - robust multipart message
async function sendViaGmailAPI({ to, subject, text, html }) {
  try {
    if (!process.env.GOOGLE_REFRESH_TOKEN || !process.env.OTP_EMAIL) {
      throw new Error("Missing GOOGLE_REFRESH_TOKEN or OTP_EMAIL env var");
    }

    const boundary = "----=_RoamlyBoundary_" + Date.now();
    const plain = (text || "").trim();
    const htmlPart = (html || "").trim();

    const lines = [];
    lines.push(`From: ${process.env.OTP_EMAIL}`);
    lines.push(`To: ${to}`);
    lines.push(`Subject: ${subject}`);
    lines.push("MIME-Version: 1.0");
    lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    lines.push("");
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset="UTF-8"');
    lines.push("Content-Transfer-Encoding: 7bit");
    lines.push("");
    lines.push(plain || "(No text content)");
    if (htmlPart) {
      lines.push(`--${boundary}`);
      lines.push('Content-Type: text/html; charset="UTF-8"');
      lines.push("Content-Transfer-Encoding: 7bit");
      lines.push("");
      lines.push(htmlPart);
    }
    lines.push(`--${boundary}--`);
    lines.push("");

    const rawMessage = lines.join("\r\n");
    const raw = Buffer.from(rawMessage, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const res = await gmail.users.messages.send({ userId: "me", requestBody: { raw } });

    console.log("Email sent (Gmail API):", res.data?.id || res.statusText);
    return { ok: true, provider: "gmail-api", info: res.data };
  } catch (err) {
    console.error("Gmail API send error:", err?.message || err);
    return { ok: false, error: err };
  }
}

// Safe send wrapper: try Gmail API then SendGrid
async function safeSendMail({ to, subject, text, html }) {
  if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.OTP_EMAIL) {
    const gmailRes = await sendViaGmailAPI({ to, subject, text, html });
    if (gmailRes.ok) return gmailRes;
    console.error("Gmail API failed, falling back:", gmailRes.error?.message || gmailRes.error);
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
      console.error("SendGrid fallback error:", sgErr?.message || sgErr);
      return { ok: false, error: sgErr };
    }
  }

  return { ok: false, error: new Error("No email provider configured or all providers failed") };
}

// --- Controller actions ---
// Note: signup stores pending new user in req.session.pendingSignup (username,email,password,otp,expires).
// verifyOtp will create the real DB user when pendingSignup exists and OTP is correct.
// Other flows (password reset) still use DB-stored OTP as before.

async function renderSignupForm(req, res) { res.render("users/signup.ejs"); }

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      req.flash("error", "All fields are required.");
      return res.redirect("/signup");
    }

    // Ensure username/email not already used
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      req.flash("error", "Username or email already taken.");
      return res.redirect("/signup");
    }

    // Generate numeric 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    // Store signup data in session until OTP verified
    req.session.pendingSignup = { username, email, password, otp, otpExpires };
    // send OTP
    const sendResult = await safeSendMail({
      to: email,
      subject: "Roamly Email Verification OTP",
      text: `Your verification code is: ${otp}\nThis code expires in 10 minutes.`,
      html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
    });

    console.log("safeSendMail result:", { ok: sendResult.ok, provider: sendResult.provider, error: sendResult.error?.message });

    if (!sendResult.ok) {
      delete req.session.pendingSignup;
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

    // If there's a pending signup in session, validate against it and create user only when correct
    const pending = req.session.pendingSignup;
    if (pending && pending.email === email) {
      if (!pending.otp || !pending.otpExpires || pending.otp !== otp || pending.otpExpires < Date.now()) {
        req.flash("error", "Invalid or expired OTP.");
        return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
      }

      // Create user now
      let user;
      if (typeof User.register === "function") {
        const newUser = new User({ username: pending.username, email: pending.email, isVerified: true });
        user = await User.register(newUser, pending.password);
      } else {
        user = new User({ username: pending.username, email: pending.email, isVerified: true });
        user.password = pending.password;
        await user.save();
      }

      // Clear pending signup
      delete req.session.pendingSignup;

      // Login user
      req.login(user, (err) => {
        if (err) {
          console.error("Login after OTP error (pending signup):", err);
          req.flash("success", "Email verified. Please login.");
          return res.redirect("/login");
        }
        req.flash("success", "Email verified. Welcome!");
        return res.redirect("/");
      });
      return;
    }

    // Otherwise fallback to existing behavior (password reset / verification for DB user)
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
// ...existing code...