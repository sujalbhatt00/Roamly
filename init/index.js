const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(MONGO_URL);
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

        // Use a valid ObjectId (24 character hex string)
        const ownerId = new mongoose.Types.ObjectId("650cf9f7b86bad23a7df3b3e"); // Example valid ObjectId
        
        // You can also create a new random ObjectId like this:
        // const ownerId = new mongoose.Types.ObjectId();

        const listingsWithOwner = initdata.data.map(listing => ({
            ...listing,
            owner: ownerId  // Valid ObjectId format
        }));

        // Insert listings
        await Listing.insertMany(listingsWithOwner);
        console.log(`Database initialized! All listings belong to ID: ${ownerId}`);

    } catch (err) {
        console.log("Error initializing database:", err);
    } finally {
        mongoose.connection.close();
    }
};

// Run
main().then(() => initDB());