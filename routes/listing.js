const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const{listingSchema}=require("../schema.js")
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");

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

router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
});

router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing}) 
}))

router.post("/",validateListing,wrapAsync(async(req,res)=>{
    const newlisting=new Listing(req.body.listing); 
    await newlisting.save();
    req.flash("success","Successfully made a new listing!")
    res.redirect("/listings")
}))

router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}))

router.put("/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing,{runValidators:true,new:true});
    res.redirect(`/listings/${id}`); 
}));

router.delete("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}));

module.exports=router;