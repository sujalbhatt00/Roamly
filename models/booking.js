const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: Number,
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);