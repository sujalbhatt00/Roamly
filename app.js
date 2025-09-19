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


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(() =>{
    console.log("conncet to DB")
}).catch(err=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL )
    
}
app.get("/", async(req,res)=>{
     const allListing= await Listing.find({});
 res.render("listings/index.ejs",{allListing});
})

 app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});
app.get("/listing",async(req,res)=>{ 
    const allListing= await Listing.find({});
 res.render("listings/index.ejs",{allListing});
});

  app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing}) 
})
//route handler middleware 
 app.post("/listings",async(req,res,next)=>{
try{
    const newlisting=new Listing(req.body.listing); 
    await newlisting.save();
    res.redirect("/listing")
}
catch(err){
    next(err);
}
 })
 app.get("/listings/:id/edit",async(req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})


//update route
app.put("/listings/:id", async(req,res)=>{
 let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,req.body.listing,{runValidators:true,new:true});
    await listing.save();
    res.redirect(`/listings/${listing._id}`); 
})
app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
});
app.use((err,req,res,next)=>{
res.send("something went wrong")
})

app.listen(8080,()=>{
    console.log("server is running");
}) 