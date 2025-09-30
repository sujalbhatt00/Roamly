const express=require("express");
const router=express.Router();
//index
router.get("/",(req,res)=>{
    res.send("Get for show users")
});

//show-users
router.get("/:id",(req,res)=>{
    res.send("get for show user id")
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