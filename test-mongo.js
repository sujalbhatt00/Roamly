const mongoose = require("mongoose");
require("dotenv").config();
const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
  .then(() => {
    console.log("Connected to Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Atlas connection error:", err);
    process.exit(1);
  });