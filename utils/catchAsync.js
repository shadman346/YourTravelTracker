module.exports= (foo) =>{
    return (req, res, next) => {
       foo(req, res, next).catch((err) => next(err));  //or .catch(next)  
    };
 }