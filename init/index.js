
const mongoose = require("mongoose");
const initdata = require("./data");          // your listings data file
const Listing = require("../models/listing"); // Listing model
const User = require("../models/user");       // User model

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
    }
}

// Initialize database
const initDB = async () => {
    try {
        // Delete all existing listings
        await Listing.deleteMany({});
        console.log("Old listings removed");

        // Find user with username 'sujalbhatt'
        const user = await User.findOne({ username: "sujalbhatt" });

        if (!user) {
            console.log("User 'sujalbhatt' not found! Please create this user first.");
            return;
        }

        // Assign owner reference to each listing
        const listingsWithOwner = initdata.data.map(listing => ({
            ...listing,
            owner: user._id
        }));

        // Insert listings
        await Listing.insertMany(listingsWithOwner);
        console.log("Database initialized! All listings belong to 'sujalbhatt'.");

        mongoose.connection.close(); // close DB connection
    } catch (err) {
        console.log("Error initializing database:", err);
    }
};

// Run
main().then(() => initDB());
