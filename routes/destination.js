const express = require('express');
const router = express.Router();
const catchAsynch = require('../utils/catchAsync');
const {isLogin} = require('../middleware');
const {DestinationList, CreateDestination, AddDestinationPage, ShowDestination, DeleteDestination, MoveDestination,
UpdateDestinationTextarea, EditDestinationPage, EditDestination} = require('../controller/destination')
const multer = require('multer');
const {storage} = require('../cloudinary'); //if only folder mention then it will by default choose index.js file
const upload = multer({storage});

router.get('/test',catchAsynch(async (req,res)=>{res.render('check.ejs');}));
router.post('/test',catchAsynch(async (req,res)=>{
    console.log(req.body)
    res.send(req.body);}));


router.get('/',isLogin,catchAsynch(DestinationList));

router.post('/',isLogin,upload.array('images'),catchAsynch(CreateDestination));


router.get('/AddDestination',isLogin,catchAsynch(AddDestinationPage));

router.get('/:id',isLogin,catchAsynch(ShowDestination));

router.delete('/:id',isLogin,catchAsynch(DeleteDestination));

router.put('/:id',isLogin,catchAsynch(MoveDestination));

router.put('/:id/textarea',isLogin,catchAsynch(UpdateDestinationTextarea));

router.get('/:id/edit',isLogin,catchAsynch(EditDestinationPage));

router.put('/:id/edit',upload.array('images'),isLogin,catchAsynch(EditDestination));


module.exports = router;