const Joi = require("joi");

module.exports.destinationSchema = joi.object({
   destination: joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      expenditure: Joi.number().required().min(0),
      imgUrl: Joi.string().required(),
      experience: Joi.string().required(),
   }),
});
