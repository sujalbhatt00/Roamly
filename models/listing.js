const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: { type: String },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    state: String, 
    city: String,  
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        enum: [
            'Trending', 'Arctic', 'Mountain', 'Castles', 'Farms', 'Camping',
            'Rooms', 'Iconic Cities', 'Amazing pools', 'Boats', 'Other'
        ],
        default: 'Other'
    },
    bookedDates: [{
        type: Date
    }],
});

module.exports = mongoose.model("Listing", listingSchema);