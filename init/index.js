const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");
const User = require("../models/user");
const fetch = require("node-fetch");
require('dotenv').config({ path: '../.env' });


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// Geocoding function
async function geocodeLocation(location) {
    try {
        const response = await fetch(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${process.env.MAPTILER_API_KEY}`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            return {
                type: "Point",
                coordinates: data.features[0].center
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}

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
        
        // Find existing user
        let owner = await User.findOne({ username: 'sujalbhatt' });
        if(owner) {
            console.log("Found existing user 'sujalbhatt'");
        } else {
            console.log("User 'sujalbhatt' not found, please create this user first");
            return;
        }

        console.log("Using owner:", owner._id);
        console.log("Starting geocoding for all listings...");
        
        // Process and geocode each listing
        const listingsWithOwner = await Promise.all(initdata.data.map(async listing => {
            // Geocode the location
            const locationStr = `${listing.location}, ${listing.country}`;
            console.log(`Geocoding: ${locationStr}`);
            const geometryData = await geocodeLocation(locationStr);
            
            if (geometryData) {
                console.log(`  ✓ Found coordinates: [${geometryData.coordinates}] for ${locationStr}`);
            } else {
                console.log(`  ✗ Could not geocode: ${locationStr}`);
            }
            
            return {
                ...listing,
                owner: owner._id,
                geometry: geometryData || {
                    type: "Point",
                    coordinates: [0, 0]
                }
            };
        }));

        // Insert listings
        await Listing.insertMany(listingsWithOwner);
        console.log(`Database initialized! ${listingsWithOwner.length} listings created.`);
        console.log(`All listings belong to user: ${owner.username} (${owner._id})`);

    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        mongoose.connection.close();
    }
};

// Run the initialization
main().then(() => initDB());