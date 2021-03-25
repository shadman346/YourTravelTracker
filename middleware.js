
module.exports.isLogin = (req, res, next) => {
    // storing User {_id}
   if (req.session.User) next();
   else {
       req.flash('error',"Register first, If you already have account go to Login!!")
       res.redirect('/register')
   };
};