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
const{listingSchema}=require("./schema.js")


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(() =>{
    console.log("conncet to DB")
}).catch(err=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL )
    
}
// 
app.get("/",  wrapAsync(async(req,res)=>{
     const allListing= await Listing.find({});
 res.render("listings/index.ejs",{allListing});
}));

 const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
 }
//new route
 app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});
app.get("/listing", wrapAsync(async(req,res)=>{ 
    const allListing= await Listing.find({});
 res.render("listings/index.ejs",{allListing});
}));
//show route
  app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
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
}))
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
}));
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