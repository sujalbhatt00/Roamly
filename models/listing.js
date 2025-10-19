const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
        set: (v)=> v ==="" ? "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop" : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        } 
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
   if(listing){
     await Review.deleteMany({_id: {$in:listing.reviews}})
   }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;