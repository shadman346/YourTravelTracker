
const {registerSchema, loginSchema} = require('../Schema')
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Destination = require('../models/destination');
const promo_destinations = require('../promo_dest');


module.exports.HomePage=async function(req,res){
    res.render('users/home.ejs')
}


module.exports.RegisterPage=async function(req,res){
    res.render('users/register.ejs');
}

module.exports.RegisterUser=async function(req,res){
    const {error}= registerSchema.validate(req.body);
    if(error){
        const msg = error.details.map((el) => el.message).join(',');
        req.flash('error',msg.replace("register.",""))
        res.redirect('/register')
        return;
    }

    hash_Password=await bcrypt.hash(req.body.register.password,12);
    const userNew= new User({
        name: req.body.register.username,
        email: req.body.register.email,
        password: hash_Password
    })


    userNew.save(err=>{
        if(err){
            req.flash('error',err.message)
            return res.redirect('/register')
        }
        else{
            for(let dest of promo_destinations)
            {
                let promo_dest = new Destination(dest);
                promo_dest.save();
                userNew.destination.push(promo_dest._id);
            }
            userNew.save();

            req.session.User=userNew.name;
            res.redirect('/destination');
        }
    });
    
}

module.exports.LoginPage=async function(req,res){
    if(req.session.User) res.redirect('/destination')
    else res.render('users/login.ejs');
}

module.exports.LoginUser=async function(req,res){
    const {error} = loginSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        // console.log(msg)
        req.flash('error','invalid email or password format!!')
        res.redirect('/login');
        return
    }
    const input = req.body.login.username_email;
    let user = "";
    if(input.indexOf("@")==-1) user = await User.findOne({name: input});
    else user = await User.findOne({email: input});
    if(user) {
        const isLogin = await bcrypt.compare(req.body.login.password,user.password);
        if(isLogin){
            req.session.User=user.name;
            res.redirect('/destination')
            return
        } 
    }  
    req.flash('error','Username or Password is incorrect!!')
    res.redirect('/login');
}

module.exports.Logout=async function(req,res){
    req.session.destroy();
    res.redirect('/login');
}


// module.exports.a=async function(req,res){
   
// }