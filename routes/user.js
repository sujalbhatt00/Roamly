const express=require("express");
const router=express.Router();
const User=require("../models/user")
const review = require("../models/review");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");


router.get("/signup",(req,res)=>{
    res.render("users/signup")
});
router.post("/signup",async(req,res)=>{
     try{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
      req.login(registeredUser,(err)=>{
        if(err){        
           return next(err);
        }
         req.flash("success","Welcome to Roamly");
    res.redirect("/listings")
     });
   
     }
     catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
     }
    });

    router.get("/login",(req,res)=>{
     res.render("users/login")
    });

    router.post("/login",
      saveRedirectUrl,
      passport.authenticate("local",
         {failureRedirect:"/login",failureFlash:true }),

          async(req,res)=>{
     req.flash("success","successfully logged in");
     if(res.locals.redirectUrl){
     res.redirect(res.locals.redirectUrl);
     } else {
       res.redirect("/listings");
     } 
    });

    router.get("/logout",(req,res)=>{
     req.logout((err)=>{
        if(err){        
           return next(err);
        }
        req.flash("success","Successfully logged out");
        res.redirect("/login");
     });
}); 

module.exports=router;