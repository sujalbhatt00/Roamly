const Listing=require("../models/listing.js");


module.exports.index=async(req,res)=>{
    const allListing= await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    console.log(req.user);
    const listing = await Listing.findById(id)
        .populate({path:"reviews",
            populate:{  path:"author"}
        })   
        .populate("owner");    

    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    // Pass current logged-in user to EJS
    res.render("listings/show.ejs", { listing, currUser: req.user });
}

module.exports.createListing = async(req, res) => {
    try { 
        const newListing = new Listing(req.body.listing);
        
        // Add the image if uploaded
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            console.log(url, "..", filename);
            
            // Save image data to the listing
            newListing.image = {
                url: url,
                filename: filename
            };
        }
        
        // Set owner and save
        newListing.owner = req.user._id;
        await newListing.save();
        
        req.flash("success", "Successfully made a new listing");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", err.message);
        return res.redirect("/listings/new");
    }
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Cannot find that listing!")
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});                
          if(typeof req.file !== "undefined"){
              let url = req.file.path;
              let filename = req.file.filename;
              listing.image = {url,filename};
                 await listing.save();
          }
 
   req.flash("success","Successfully updated listing")
   res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted listing")
    res.redirect("/listings")
}   