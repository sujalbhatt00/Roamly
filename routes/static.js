const express = require("express");
const router = express.Router();

router.get("/terms", (req, res) => res.render("static/terms"));
router.get("/privacy", (req, res) => res.render("static/privacy"));
router.get("/about", (req, res) => res.render("static/about"));
router.get("/contact", (req, res) => res.render("static/contact"));
router.get("/help", (req, res) => res.render("static/help"));

module.exports = router;