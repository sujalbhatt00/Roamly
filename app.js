const express=require("express");
const app=express();
const mongoose=require("mongoose");
app.set("view engine","ejs");
const path=require("path")
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate")
app.engine("ejs",ejsMate)
const ExpressError=require("./utils/ExpressError");


const reviews=require("./routes/review.js");
const listings=require("./routes/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(() =>{
    console.log("connect to DB")
}).catch(err=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});



app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings",listings); 
app.use("/listings/:id/reviews",reviews);


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