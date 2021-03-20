const Joi = require('joi');

module.exports.destinationSchema = Joi.object({
   destination: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      expenditure: Joi.number().min(0),
      experience: Joi.string().allow('',null),
   }).required(),
//    images: Joi.string() ,
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        textarea:Joi.string().max(500).allow('').required(),
    }).required(),
})


module.exports.registerSchema = Joi.object({
    register: Joi.object({
        username: Joi.string().lowercase().min(3).max(30).required(),
        email:Joi.string().email({ minDomainSegments: 2, tlds: { allow:true} }).required(),
        password:Joi.string().min(4).required(),
    }).required(),
})



module.exports.loginSchema = Joi.object({
    login: Joi.object({
        username_email:Joi.alternatives().try(
            Joi.string()
               .lowercase()
               .email({
                   minDomainSegments: 2,
                   tlds: {
                      allow: ["com", "net", "in", "co"],
                   },
               }),
            Joi.string().lowercase().min(3).max(30)
          ).required(),
          
        password:Joi.string().min(4).required(),
    }).required(),
})



