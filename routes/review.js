const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const{reviewSchema}=require("../schema.js")
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errMsg );
    }
    else{
        next();
    }
}

router.post("/", validateReview, wrapAsync(async(req,res)=>{
    console.log("=== REVIEW POST ROUTE HIT ===");
    console.log("Request body:", req.body);
    console.log("Listing ID:", req.params.id);
    
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }
    
    const newReview = new Review(req.body.review);
    console.log("Creating review:", newReview);
    
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    
  req.flash("success","Successfully added a new review")
    res.redirect(`/listings/${listing._id}`);
}));


router.delete("/:reviewid", wrapAsync(async(req,res)=>{
    console.log("=== DELETE REVIEW ROUTE HIT ===");
    let{id,reviewid}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    
    req.flash("success","Successfully deleted review")
    res.redirect(`/listings/${id}`);
}));

module.exports=router;