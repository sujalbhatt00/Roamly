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