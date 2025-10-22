if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}   

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
const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");
const reviewRouter=require("./routes/review.js");
const listingsRouter=require("./routes/listing.js");
const bookingsRouter=require("./routes/bookings.js");

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized: true,
     cookie:{
         expires: new Date(Date.now()+1000*60*60*24*3),
        maxAge:1000*60*60*24*3,
        httpOnly:true
     }
}
app.use(session(sessionOptions));
app.use(flash());
 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    console.log(res.locals.success);
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(() =>{
    console.log("connect to DB")
}).catch(err=>{
    console.log(err) 
});

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

app.use("/listings",listingsRouter); 
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use("/bookings",bookingsRouter);

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