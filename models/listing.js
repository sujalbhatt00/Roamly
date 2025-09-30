const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema=new Schema({
    title:{
        type:String,

    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/milky-way-galaxy-over-a-small-church-at-night-aV9UbHhJdrA",
        set: (v)=> v ==="" ?"https://unsplash.com/photos/milky-way-galaxy-over-a-small-church-at-night-aV9UbHhJdrA" : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
   if(listing){
     await Review.deleteMany({_id: {$in:listing.reviews}})
   }

})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;