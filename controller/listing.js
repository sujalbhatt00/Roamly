const Listing = require("../models/listing.js");
const fetch = require('node-fetch');


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
// Add these functions at the top of the file
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing ,
        MAPTILER_API_KEY: process.env.MAPTILER_API_KEY
    });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image && listing.image.url ? listing.image.url : "";
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};
// Update createListing function
module.exports.createListing = async(req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        
        // Add image if uploaded
        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        
        // Geocode the location
        const locationStr = `${newListing.location}, ${newListing.country}`;
        const geometryData = await geocodeLocation(locationStr);
        if (geometryData) {
            newListing.geometry = geometryData;
        }
        
        await newListing.save();
        req.flash("success", "Successfully made a new listing");
        res.redirect(`/listings/${newListing._id}`);
    } catch (err) {
        console.error("Error:", err);
        req.flash("error", err.message);
        res.redirect("/listings/new");
    }
}

// Update updateListing function
module.exports.updateListing = async(req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        
        // Update image if new one uploaded
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        
        // Re-geocode if location changed
        if (req.body.listing.location || req.body.listing.country) {
            const locationStr = `${req.body.listing.location}, ${req.body.listing.country}`;
            const geometryData = await geocodeLocation(locationStr);
            if (geometryData) {
                listing.geometry = geometryData;
            }
        }
        
        await listing.save();
        req.flash("success", "Successfully updated listing");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error:", err);
        req.flash("error", err.message);
        res.redirect(`/listings/${req.params.id}/edit`);
    }
}



module.exports.deleteListing=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted listing")
    res.redirect("/listings")
}   