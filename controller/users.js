const User = require("../models/user");


module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
}


module.exports.signup = async(req,res) =>{
    try{
     const {username, password, email} = req.body;
     if (!email || !email.trim()) {
       req.flash("error", "Email is required.");
       return res.redirect("/signup");
     }
     // Simple email regex validation
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
       req.flash("error", "Please enter a valid email address.");
       return res.redirect("/signup");
     }
     // Password length and complexity validation
     if (!password || password.length < 5) {
       req.flash("error", "Password must be at least 5 characters.");
       return res.redirect("/signup");
     }
     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
     if (!passwordRegex.test(password)) {
       req.flash("error", "Password must contain at least one uppercase letter, one lowercase letter, and one number.");
       return res.redirect("/signup");
     }
     // Check for unique username and email
     const existingUser = await User.findOne({ $or: [{ username }, { email }] });
     if (existingUser) {
       if (existingUser.username === username) {
         req.flash("error", "Username already taken.");
       } else {
         req.flash("error", "Email already registered.");
       }
       return res.redirect("/signup");
     }
     const newUser = new User({username,email});
     const registeredUser= await User.register(newUser, password);
     req.login(registeredUser,(err)=>{
         if(err){
             return next(err);
         }
         req.flash("success", "Welcome to Roamly!");
         res.redirect("/listings");
     });

    }catch(e){
     req.flash("error", e.message);
     res.redirect("/signup");
    }
 }

 module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.Login = async (req,res)=>{
    req.flash("success","Welcome back to Roamly!");

    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}