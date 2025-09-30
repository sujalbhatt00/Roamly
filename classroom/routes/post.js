const express=require("express");
const router=express.Router();


//posts
//index
router.get("/",(req,res)=>{
    res.send("Get for posts")
});

//show-users
router.get("/:id",(req,res)=>{
    res.send("get for show post id")
})

//post-users
router.post("/",(req,res)=>{
    res.send("Post for users")
})

//delete-users
router.delete("/:id",(req,res)=>{
    res.send("DELETE for users id")
})

module.exports=router;