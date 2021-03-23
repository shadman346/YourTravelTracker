
module.exports.isLogin = (req, res, next) => {
    
   if (req.session.User) next();
   else {
       req.flash('error',"Register first, If you already have account go to Login!!")
       res.redirect('/register')
   };
};