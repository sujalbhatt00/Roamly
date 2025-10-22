const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError");

module.exports.createReview=async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }
    
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;     

    
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    
  req.flash("success","Successfully added a new review")
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res)=>{
    console.log("=== DELETE REVIEW ROUTE HIT ===");
    let{id,reviewid}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    
    req.flash("success","Successfully deleted review")
    res.redirect(`/listings/${id}`);
};