const express=require("express");
const app=express();
const users=require("./routes/user");
const posts=require("./routes/post");
const session=require("express-session");
const flash=require("connect-flash");
app.set("view engine","ejs");
const path=require("path")
app.set("views",path.join(__dirname,"views"));

    const sessionOptions={
 secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    }
 app.use(session(sessionOptions));
 app.use(flash());

 app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
 }
)
app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;

if(name==='anonymous'){
  req.flash("error","user not registered ");
}
 else{
     req.flash("success","user register successfully")
  
}
    res.redirect("/hello")
});

app.get("/hello",(req,res)=>{

    
    res.render("page.ejs",{name:req.session.name})
})



// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;

//     }
// else{
//     req.session.count=1;
// }

   
//     res.send(`you send a request ${req.session.count} times`);

// });
app.listen("3000",()=>{
    console.log("Server is listening to 3000");
})