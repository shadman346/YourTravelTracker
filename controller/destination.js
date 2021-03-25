const User = require('../models/User');
const Destination = require('../models/destination');
const ExpressError = require('../utils/ExpressError');
const {destinationSchema, reviewSchema, editValidation} = require('../Schema');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.DestinationList=async function(req,res){
    let { isVisited = '' } = req.query;
    if (isVisited == 'false') isVisited = false;
    else isVisited=true;
    
    const data=await User.findOne({ _id: req.session.User }).populate('destination');

    if (isVisited) {
        const destinations=data.destination.filter(el=>el.isVisited===true)
        res.render('visited.ejs', { destinations });
      }
    if (!isVisited) {
        const destinations=data.destination.filter(el=>el.isVisited===false)
        res.render('notvisited.ejs', { destinations });
      }
}

module.exports.AddDestinationPage=async function(req,res){
    res.render('AddDestination.ejs', {});
}


module.exports.CreateDestination=async function(req,res){
    
    
    let { isVisited = '' } = req.query;

    if (isVisited == 'true' || isVisited == 'false') {
       isVisited = isVisited == 'true';
    }else res.redirect('/destination?isVisted=true');

    const { error } = destinationSchema.validate(req.body);
    if (error) {

        if(req.files[0]) 
            for(let file of req.files)
                 cloudinary.uploader.destroy(file.filename);
                 
       const msg = error.details.map((el) => el.message).join(',');
       req.flash('error',msg.replace("destination.", ""));
       res.redirect(`/destination/AddDestination?isVisited=${isVisited}`);
    }
    else{

        const geoData = await geocoder.forwardGeocode({
            query:req.body.destination.location,
            limit: 1,
        }).send()
        let geoLoc ={};
        console.log(geoData.body.features)
        if(geoData.body.features.length)
             geoLoc = geoData.body.features[0].geometry
        else {
             geoLoc = { coordinates: [ 77.1519225, 31.8793425 ], type: 'Point' }
             req.flash('error','Unable to find Location, set default Map Location :(')
        }

    const destination = new Destination(req.body.destination);
    destination.geometry = geoLoc;
    if(req.files[0]) destination.images.push(...req.files.map(f=>({url: f.path, filename: f.filename})));
    destination.isVisited = isVisited;
    destination.date= new Date();
    await destination.save();

    console.log(destination)

    await User.findOneAndUpdate({_id: req.session.User },{ $push: { destination: [destination._id] } },{new: true});

    res.redirect(`/destination/${destination._id}?isVisited=${isVisited}`);
    }
}



module.exports.ShowDestination=async function(req,res){
    const { id } = req.params;
    const destination = await Destination.findById(id);
    res.render('show.ejs', { destination });
}

module.exports.DeleteDestination=async function(req,res){
    const {id} = req.params;
    let {isVisited=''}=req.query;
    if (isVisited == 'false') isVisited = false;
    else isVisited=true;

    await User.findOneAndUpdate({_id: req.session.User},{$pullAll: {destination:[{_id:id}]}});
    const deletedDestination=await Destination.findByIdAndDelete(id);

    if(deletedDestination.images[0])
        for(let img of deletedDestination.images)
            await cloudinary.uploader.destroy(img.filename);

    req.flash('success',"you have succesfully deleted destination!!");
    res.redirect(`/destination?isVisited=${isVisited}`);
}

module.exports.MoveDestination=async function(req,res){
    const {id} = req.params;
    let {isVisited=''}=req.query;
    if (isVisited == 'false') isVisited = true;
    else isVisited=false;

    await Destination.findOneAndUpdate({_id:id},{isVisited},{new:true});
    
    if(isVisited)
    req.flash('success',`Your Destination is now Marked!!`)
    else req.flash('success',`Your Destination is now UnMarked!!`)

    res.redirect(`/destination/${id}?isVisited=${isVisited}`)
}


module.exports.UpdateDestinationTextarea=async function(req,res){
    const {id} = req.params;
    let {isVisited=''}=req.query;
    if (isVisited == 'false') isVisited = false;
    else isVisited=true;

    const { error } = reviewSchema.validate(req.body);
      if (error) {
         const msg = error.details.map((el) => el.message).join(',');
         throw new ExpressError(msg);
      }
      
    const {textarea} = req.body.review;
    await Destination.findOneAndUpdate({_id:id},{experience:textarea},{new:true});
    res.redirect(`/destination/${id}?isVisited=${isVisited}`);
}

module.exports.EditDestinationPage=async function(req,res){
    const {id} = req.params;
    const destination = await Destination.findById(id);
    res.render('edit.ejs',{destination});
}

module.exports.EditDestination=async function(req,res){
    
    const {id} = req.params;

    let {isVisited=''}=req.query;
    if (isVisited == 'false') isVisited = false;
    else isVisited=true;

    // console.log(editValidation.validate(req.body));
    const { error } = editValidation.validate(req.body);
      if (error) {
        console.log(req.files);
        
        if(req.files[0]) 
            for(let file of req.files)
                 cloudinary.uploader.destroy(file.filename);
            
         const msg = error.details.map((el) => el.message).join(',');
         req.flash('error',msg)
         res.redirect(`/destination/${id}/edit?isVisited=${isVisited}`)
         return;
      }
    
    const geoData = await geocoder.forwardGeocode({
    query:req.body.location,
    limit: 1,
    }).send()
    let geoLoc ={};
    // console.log(geoData.body.features)
    if(geoData.body.features.length)
         geoLoc = geoData.body.features[0].geometry
    else {
         geoLoc = { coordinates: [ 77.1519225, 31.8793425 ], type: 'Point' }
         req.flash('error','Unable to find Location, set default Map Location :(')
    }

    const destination = await Destination.findById(id);
    if(req.files[0]) destination.images.push(...req.files.map(f=>({url: f.path, filename: f.filename})));
    if(req.body.deleteImgs) {
        for(let filename of req.body.deleteImgs){
            await cloudinary.uploader.destroy(filename);
        }
        await destination.updateOne({$pull:{images: {filename:{$in:req.body.deleteImgs}}}});
        // let deleted_images_Id=destination.images.filter(f=>{
        //     for(let imgId of req.body.deleteImgs)
        //         if(imgId==f.filename) return true;
        // }).map(f=>f._id)
        // destination.images.pull(...deleted_images_Id);    //only working with id
    }
    if((destination.location != req.body.location)||(destination.title != req.body.title)||(req.files[0])||(req.body.deleteImgs)){
        destination.title=req.body.title;
        destination.location = req.body.location;
        destination.geometry = geoLoc;
        destination.date= Date.now();
        await destination.save();
        req.flash('success',"Destination Update Successfully :D")
    }
    
    res.redirect(`/destination/${id}?isVisited=${isVisited}`);
}

// module.exports.a=async function(req,res){
   
// }
