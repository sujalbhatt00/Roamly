const Listing = require("./models/listing");
const Review = require("./models/review");  
const{reviewSchema}=require("./schema.js")
const{listingSchema}=require("./schema.js")
const ExpressError=require("./utils/ExpressError");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be signed in first!");
        return res.redirect("/login");
    }
    next(); 
}
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
     
     res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();    
}     
 
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
   let listing=await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You do not have permission to edit this listing")
    return res.redirect(`/listings/${id}`);
      }
        next();     
    }



module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        req.flash("error", errMsg);
        if (req.params.id) {
            return res.redirect(`/listings/${req.params.id}/edit`);
        } else {
            return res.redirect("/listings/new");
        }
    } else {
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errMsg );
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewid}=req.params;
    const review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You do not have permission to edit this review")
        return res.redirect(`/listings/${id}`);
    }
    next();
}