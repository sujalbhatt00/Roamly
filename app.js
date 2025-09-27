const express=require("express");
const app=express();
const mongoose=require("mongoose");
app.set("view engine","ejs");
const path=require("path")
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true }));
const Listing=require("./models/listing");
const { count } = require("console");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate")
app.engine("ejs",ejsMate)
const wrapAsync=require("./utils/wrapAsync")
const ExpressError=require("./utils/ExpressError");
const{listingSchema,reviewSchema}=require("./schema.js")
const review=require("./models/review.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(() =>{
    console.log("conncet to DB")
}).catch(err=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL )
    
}

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// 
app.get("/",  wrapAsync(async(req,res)=>{
     const allListing= await Listing.find({});
 res.render("listings/index.ejs",{allListing});
}));

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
//new route
 app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//reviews route - FIXED
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    console.log("Review route hit with ID:", req.params.id);
    console.log("Request body:", req.body);
    
    let listing=await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }
    
    console.log("Found listing:", listing.title);
    const newReview=new review(req.body.review);
    console.log("Created new review:", newReview);
    
    // SAVE THE REVIEW FIRST
    await newReview.save();
    
    // PUSH ONLY THE REVIEW ID, NOT THE WHOLE OBJECT
    listing.reviews.push(newReview._id);  // ✅ FIXED - push only the ID
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)
}))

app.get("/listing", wrapAsync(async(req,res)=>{ 
    const allListing= await Listing.find({});
 res.render("listings/index.ejs",{allListing});
}));

//show route - WITH DEBUGGING
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    
    // DEBUG INFO
    console.log("📝 SHOW PAGE DEBUG:");
    console.log("Listing ID:", listing._id);
    console.log("Reviews count:", listing.reviews.length);
    
    if(listing.reviews.length > 0) {
        listing.reviews.forEach((rev, index) => {
            console.log(`Review ${index}:`);
            console.log(`  - ID: ${rev._id}`);
            console.log(`  - Type: ${typeof rev._id}`);
            console.log(`  - Is ObjectId: ${mongoose.Types.ObjectId.isValid(rev._id)}`);
        });
    }
    
    res.render("listings/show.ejs",{listing}) 
}))

 //create listing
 app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{

    const newlisting=new Listing(req.body.listing); 
    await newlisting.save();
    res.redirect("/listing")

 }))
 //edit route
 app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}))

//update route
app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
 let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,req.body.listing,{runValidators:true,new:true});
   
    await listing.save();
    res.redirect(`/listings/${listing._id}`); 
}));

//delete listing
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    Listing.findByIdAndUpdate()
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
}));

//delete review - WITH DEBUGGING
app.delete("/listings/:id/reviews/:reviewid",wrapAsync(async(req,res)=>{
    console.log("🔥🔥🔥 DELETE REVIEW ROUTE HIT! 🔥🔥🔥");
    console.log("Method:", req.method);
    console.log("Full URL:", req.originalUrl);
    console.log("Listing ID:", req.params.id);
    console.log("Review ID:", req.params.reviewid);
    
    let{id,reviewid}=req.params;
    
    try {
        // Check if listing exists
        const listing = await Listing.findById(id);
        console.log("Listing found:", listing ? listing.title : "NOT FOUND");
        console.log("Reviews in listing:", listing ? listing.reviews.length : 0);
        
        // Check if review exists
        const reviewToDelete = await review.findById(reviewid);
        console.log("Review found:", reviewToDelete ? "YES" : "NOT FOUND");
        
        // Remove from listing
        const updateResult = await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
        console.log("Listing update result:", updateResult ? "SUCCESS" : "FAILED");
        
        // Delete review
        const deleteResult = await review.findByIdAndDelete(reviewid);
        console.log("Review delete result:", deleteResult ? "SUCCESS" : "FAILED");
        
        console.log("✅ Redirecting to /listings/" + id);
        res.redirect(`/listings/${id}`);
        
    } catch(error) {
        console.log("❌ ERROR in delete route:", error);
        throw error;
    }
}))

app.use((req, res, next) => {
    next(new ExpressError(404,"page not found!"));
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message})
});

app.listen(8080,()=>{
    console.log("server is running");
})