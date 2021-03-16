const express = require('express');
const router = express.Router();
const catchAsynch = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {registerSchema, loginSchema} = require('../Schema')
const bcrypt = require('bcrypt');
const User = require('../models/User')

router.get('/register',catchAsynch(async (req,res)=>{
    res.render('users/register.ejs')
}))

router.post('/register',catchAsynch(async (req,res)=>{

    const {error}= registerSchema.validate(req.body);
    if(error){
        const msg = error.details.map((el) => el.message).join(',');
         throw new ExpressError(msg);
    }

    hash_Password=await bcrypt.hash(req.body.register.password,12);
    const userNew= new User({
        name: req.body.register.username,
        email: req.body.register.email,
        password: hash_Password
    })
    await userNew.save();
    req.session.User=userNew.name;
    res.redirect('/destination');
    
}));

router.get('/login',catchAsynch(async (req, res) => {
 
    if(req.session.User) res.redirect('/destination')
    else res.render('users/login.ejs');
   })
);
router.post('/login',catchAsynch(async (req, res) => {
    const {error} = loginSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg);
    }
    const input = req.body.login.username_email;
    let user = "";
    if(input.indexOf("@")==-1) user = await User.findOne({name: input});
    else user = await User.findOne({email: input});
    console.log(user)
    if(user==null) throw new ExpressError('username or email not found try again')
    
    const isLogin = await bcrypt.compare(req.body.login.password,user.password);
    if(isLogin){
        req.session.User=user.name
        res.redirect('/destination')
    }else throw new ExpressError('pasword or email incorrect');
   })
);


router.get('/logout',catchAsynch(async (req, res) => {
      req.session.destroy();
      res.redirect('/login');
   })
);


module.exports = router;