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
