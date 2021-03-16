const express = require('express');
const router = express.Router();
const catchAsynch = require('../utils/catchAsync');
const {isLogin} = require('../middleware');
const User = require('../models/User')
const Destination = require('../models/destination')
const ExpressError = require('../utils/ExpressError')
const {destinationSchema, reviewSchema} = require('../Schema')

router.get('/',isLogin,catchAsynch(async (req, res) => {
    let { isVisited = '' } = req.query;
    if (isVisited == 'false') isVisited = false;
    else isVisited=true;

    const data=await User.findOne({ name: req.session.User }).populate('destination');

    if (isVisited) {
        const destinations=data.destination.filter(el=>el.isVisited===true)
        res.render('visited.ejs', { destinations });
      }
    if (!isVisited) {
        const destinations=data.destination.filter(el=>el.isVisited===false)
        res.render('notvisited.ejs', { destinations });
      }
 })
);

router.post('/',isLogin,catchAsynch(async (req, res) => {
    let { isVisited = '' } = req.query;

    if (isVisited == 'true' || isVisited == 'false') {
       isVisited = isVisited == 'true';
    }else res.redirect('/destination?isVisted=true');

    const { error } = destinationSchema.validate(req.body);
    if (error) {
       const msg = error.details.map((el) => el.message).join(',');
       throw new ExpressError(msg);
    }

    const destination = new Destination(req.body.destination);
    const imgs = req.body.destination.imgUrl;
    if(imgs) destination.images.push(imgs);
    destination.isVisited = isVisited;
    destination.date= new Date();
    await destination.save();


    await User.findOneAndUpdate({name: req.session.User },{ $push: { destination: [destination._id] } },{new: true});

    res.redirect(`/destination/${destination._id}?isVisited=${isVisited}`);
 })
);

router.get('/AddDestination',isLogin,catchAsynch(async (req, res) => {
    res.render('AddDestination.ejs', {});
 })
);

router.get('/:id',isLogin,catchAsynch(async (req, res) => {
    const { id } = req.params;
    const destination = await Destination.findById(id);
    res.render('show.ejs', { destination });
 })
);

router.delete('/:id',isLogin,catchAsynch(async (req,res)=>{
    const {id} = req.params;
    let {isVisited=''}=req.query;
    if (isVisited == 'false') isVisited = false;
    else isVisited=true;

    await User.findOneAndUpdate({name: req.session.User},{$pull: {destination:{_id:id}}});
    await Destination.findByIdAndDelete(id);
    res.redirect(`/destination?isVisited=${isVisited}`);
}));

router.put('/:id/textarea',isLogin,catchAsynch(async (req,res)=>{
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
}));

module.exports = router;