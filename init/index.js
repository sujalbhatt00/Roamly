const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");
const User = require("../models/user");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
    }
}

const initDB = async () => {
    try {
        // Delete all existing listings
        await Listing.deleteMany({});
        console.log("Old listings removed");
        
        // Find existing user or create a new one with username 'sujalbhatt'
        let owner = await User.findOne({ username: 'sujalbhatt' });
        if(owner){
            console.log("Found existing user 'sujalbhatt'");
        }


        console.log("Using owner:", owner._id);
        
        const listingsWithOwner = initdata.data.map(listing => ({
            ...listing,
            owner: owner._id
        }));

        // Insert listings
        await Listing.insertMany(listingsWithOwner);
        console.log(`Database initialized! All listings belong to user: ${owner.username} (${owner._id})`);

    } catch (err) {
        console.log("Error initializing database:", err);
    } finally {
        mongoose.connection.close();
    }
};

main().then(() => initDB());