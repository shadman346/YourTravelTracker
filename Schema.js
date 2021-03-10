const Joi = require('joi');

module.exports.destinationSchema = Joi.object({
   destination: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      expenditure: Joi.number().min(0),
      imgUrl: Joi.string(),
      experience: Joi.string(),
   }).required(),
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        textarea:Joi.string().min(20).max(500).required(),
    })
})