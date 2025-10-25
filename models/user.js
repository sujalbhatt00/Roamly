const mongoose=require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email:    { type: String, unique: true, required: true },
  password: String,
  googleId: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);