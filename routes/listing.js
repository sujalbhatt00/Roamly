const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const{listingSchema}=require("../schema.js")
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");
const{isLoggedIn}=require("../middleware.js");

const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errMsg );
    }
    else{
        next();
    }
}

router.get("/", wrapAsync(async(req,res)=>{
    const allListing= await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}));
 
router.post("/",isLoggedIn,
    validateListing, 
    wrapAsync(async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Successfully made a new listing")
    res.redirect(`/listings/${newListing._id}`); 
}));    

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate("reviews")   
        .populate("owner");    

    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    // Pass current logged-in user to EJS
    res.render("listings/show.ejs", { listing, currUser: req.user });
}));


//edit route

router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Cannot find that listing!")
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing})
}))

router.put("/:id",isLoggedIn,
    validateListing, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing,{runValidators:true,new:true});
    req.flash("success","Successfully updated listing") 
    res.redirect(`/listings/${id}`); 
}));

router.delete("/:id",isLoggedIn,
    wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted listing")
    res.redirect("/listings")
}));

module.exports=router;