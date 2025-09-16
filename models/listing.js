const mongoose=require("mongoose");
const Schema=mongoose.Schema;

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
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;